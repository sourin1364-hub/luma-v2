import {
  authenticatedUser,
  corsHeaders,
  isOptions,
  jsonResponse,
  serviceClient,
} from '../_shared/http.ts';

const CYCLES = {
  monthly: { months: 1, days: 30, discount: 0 },
  quarterly: { months: 3, days: 90, discount: 15 },
  semiannual: { months: 6, days: 180, discount: 25 },
  annual: { months: 12, days: 365, discount: 40 },
} as const;

const BASE_PRICES = { premium: 99000, pro: 199000 } as const;
const RENEWAL_DISCOUNT = 10;

function isPlan(value: unknown): value is keyof typeof BASE_PRICES {
  return value === 'premium' || value === 'pro';
}

function getZarinpalConfig() {
  const merchantId = Deno.env.get('ZARINPAL_MERCHANT_ID');
  const callbackBaseUrl = Deno.env.get('APP_BASE_URL');
  const sandbox = Deno.env.get('ZARINPAL_SANDBOX') === 'true';
  if (!merchantId || !callbackBaseUrl) {
    throw new Error('Zarinpal merchant ID and application callback URL must be configured.');
  }
  const callback = new URL(callbackBaseUrl);
  callback.search = '';
  callback.hash = '';
  callback.searchParams.set('payment_verify', '1');
  return {
    merchantId,
    callbackUrl: callback.toString(),
    sandbox,
    apiBase: sandbox
      ? 'https://sandbox.zarinpal.com/pg/v4'
      : 'https://api.zarinpal.com/pg/v4',
    paymentBase: sandbox
      ? 'https://sandbox.zarinpal.com/pg/StartPay'
      : 'https://www.zarinpal.com/pg/StartPay',
  };
}

interface SitePricingSettings {
  monthly_premium: number;
  monthly_pro: number;
  discount_quarterly: number;
  discount_semiannual: number;
  discount_annual: number;
  renewal_discount: number;
}

async function loadSitePricing(db: ReturnType<typeof serviceClient>): Promise<SitePricingSettings> {
  const { data } = await db
    .from('site_settings')
    .select('monthly_premium, monthly_pro, discount_quarterly, discount_semiannual, discount_annual, renewal_discount')
    .eq('id', 'default')
    .maybeSingle();

  return {
    monthly_premium: Number(data?.monthly_premium ?? BASE_PRICES.premium),
    monthly_pro: Number(data?.monthly_pro ?? BASE_PRICES.pro),
    discount_quarterly: Number(data?.discount_quarterly ?? CYCLES.quarterly.discount),
    discount_semiannual: Number(data?.discount_semiannual ?? CYCLES.semiannual.discount),
    discount_annual: Number(data?.discount_annual ?? CYCLES.annual.discount),
    renewal_discount: Number(data?.renewal_discount ?? RENEWAL_DISCOUNT),
  };
}

function calculateAmountToman(
  plan: keyof typeof BASE_PRICES,
  cycle: keyof typeof CYCLES,
  isRenewal: boolean,
  settings?: SitePricingSettings
): number {
  const cycleInfo = CYCLES[cycle];
  const percent = Number(Deno.env.get('GLOBAL_PRICE_INCREASE_PERCENT') || 0);
  if (!Number.isFinite(percent) || percent < -90 || percent > 300) {
    throw new Error('Configured subscription price adjustment is outside the allowed range.');
  }
  const basePlanPrice = settings
    ? (plan === 'pro' ? settings.monthly_pro : settings.monthly_premium)
    : BASE_PRICES[plan];
  const cycleDiscount = settings
    ? (cycle === 'quarterly' ? settings.discount_quarterly : cycle === 'semiannual' ? settings.discount_semiannual : cycle === 'annual' ? settings.discount_annual : cycleInfo.discount)
    : cycleInfo.discount;
  const renewalDiscount = settings ? settings.renewal_discount : RENEWAL_DISCOUNT;

  const monthly = Math.round((basePlanPrice * (1 + percent / 100)) / 1000) * 1000;
  const total = monthly * cycleInfo.months * (1 - cycleDiscount / 100) *
    (isRenewal ? 1 - renewalDiscount / 100 : 1);
  return Math.round(total / 1000) * 1000;
}

async function createPayment(request: Request, body: Record<string, unknown>) {
  const user = await authenticatedUser(request);
  if (!isPlan(body.plan) || typeof body.cycle !== 'string' || !(body.cycle in CYCLES)) {
    return jsonResponse({ ready: false, message: 'پلن یا دوره پرداخت نامعتبر است.' }, 400);
  }

  const cycle = body.cycle as keyof typeof CYCLES;
  const db = serviceClient();
  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('role, plan, subscription_until')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) throw profileError;

  const expiresAt = profile?.subscription_until ? new Date(profile.subscription_until) : null;
  const renewal = profile?.role !== 'admin' && profile?.plan !== 'free' &&
    expiresAt !== null && !Number.isNaN(expiresAt.getTime()) && expiresAt > new Date();
  const sitePricing = await loadSitePricing(db);
  const amountToman = calculateAmountToman(body.plan, cycle, renewal, sitePricing);
  if (
    typeof body.expectedAmountToman !== 'number' ||
    !Number.isSafeInteger(body.expectedAmountToman) ||
    body.expectedAmountToman !== amountToman
  ) {
    return jsonResponse({
      ready: false,
      message: 'قیمت اشتراک تغییر کرده است. صفحه را تازه‌سازی و دوباره تلاش کنید.',
    }, 409);
  }

  const config = getZarinpalConfig();
  const response = await fetch(`${config.apiBase}/payment/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant_id: config.merchantId,
      amount: amountToman * 10,
      callback_url: config.callbackUrl,
      description: `خرید اشتراک ${body.plan === 'pro' ? 'حرفه‌ای' : 'پریمیوم'} لومرا (${cycle})`,
      metadata: {
        email: user.email || '',
        mobile: typeof user.user_metadata?.phone === 'string' ? user.user_metadata.phone : '',
      },
    }),
  });
  const result = await response.json();
  if (!response.ok || result?.data?.code !== 100 || typeof result?.data?.authority !== 'string') {
    console.error('Zarinpal payment request rejected:', response.status, result?.errors?.message);
    return jsonResponse({ ready: false, message: 'درگاه زرین‌پال نتوانست درخواست پرداخت را صادر کند.' }, 502);
  }

  const authority = result.data.authority as string;
  const { error: insertError } = await db.from('payment_orders').insert({
    user_id: user.id,
    authority,
    purpose: 'subscription',
    plan: body.plan,
    cycle,
    amount_rial: amountToman * 10,
  });
  if (insertError) {
    console.error('Could not persist payment order:', insertError.message);
    return jsonResponse({ ready: false, message: 'ثبت امن سفارش پرداخت انجام نشد.' }, 500);
  }

  return jsonResponse({
    ready: true,
    authority,
    paymentUrl: `${config.paymentBase}/${authority}`,
    message: 'در حال هدایت به درگاه پرداخت زرین‌پال...',
  });
}

async function verifyPayment(request: Request, body: Record<string, unknown>) {
  const user = await authenticatedUser(request);
  const authority = typeof body.authority === 'string' ? body.authority : '';
  const status = typeof body.status === 'string' ? body.status : '';
  if (!/^[A-Za-z0-9]{20,40}$/.test(authority)) {
    return jsonResponse({ success: false, message: 'شناسه پرداخت نامعتبر است.' }, 400);
  }

  const db = serviceClient();
  const { data: order, error: orderError } = await db
    .from('payment_orders')
    .select('authority, amount_rial, status')
    .eq('authority', authority)
    .eq('user_id', user.id)
    .maybeSingle();
  if (orderError) throw orderError;
  if (!order) return jsonResponse({ success: false, message: 'سفارش پرداخت متعلق به این حساب نیست.' }, 404);
  if (order.status === 'paid') {
    return jsonResponse({ success: true, message: 'این پرداخت قبلاً تأیید شده است.' });
  }
  if (status !== 'OK') {
    return jsonResponse({ success: false, message: 'پرداخت در درگاه تکمیل نشده است.' });
  }

  const config = getZarinpalConfig();
  const response = await fetch(`${config.apiBase}/payment/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant_id: config.merchantId,
      authority,
      amount: order.amount_rial,
    }),
  });
  const result = await response.json();
  if (!response.ok || ![100, 101].includes(result?.data?.code)) {
    console.error('Zarinpal verification rejected:', response.status, result?.errors?.message);
    await db.from('payment_orders').update({ status: 'failed' })
      .eq('authority', authority).eq('user_id', user.id).eq('status', 'pending');
    return jsonResponse({ success: false, message: 'زرین‌پال این پرداخت را تأیید نکرد.' }, 402);
  }

  const { data: completed, error: completionError } = await db.rpc('luma_complete_payment', {
    p_authority: authority,
    p_user_id: user.id,
  });
  if (completionError) throw completionError;
  if (completed !== true) {
    return jsonResponse({ success: false, message: 'به‌روزرسانی امن اشتراک انجام نشد.' }, 500);
  }
  return jsonResponse({ success: true, message: 'پرداخت تأیید شد و اشتراک شما فعال شد.' });
}

Deno.serve(async (request) => {
  if (isOptions(request)) return new Response('ok', { headers: { ...corsHeaders, 'Content-Length': '0' } });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  try {
    const body = await request.json();
    if (body.action === 'create') return await createPayment(request, body);
    if (body.action === 'verify') return await verifyPayment(request, body);
    return jsonResponse({ error: 'Unsupported payment action.' }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected payment service error.';
    console.error('Zarinpal payment function failed:', message);
    const status = message === 'Authentication is required.' ? 401 : 500;
    return jsonResponse({ error: message }, status);
  }
});
