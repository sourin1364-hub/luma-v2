import type { Plan, BillingCycle } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';
import { type SiteSettings } from './siteSettingsService';

export interface CycleConfig {
  id: BillingCycle;
  labelFa: string;
  months: number;
  days: number;
  discountPercent: number;
  badge?: string;
}

export const BILLING_CYCLES: CycleConfig[] = [
  { id: 'monthly', labelFa: 'یک ماهه', months: 1, days: 30, discountPercent: 0 },
  { id: 'quarterly', labelFa: 'سه ماهه', months: 3, days: 90, discountPercent: 15, badge: '۱۵٪ تخفیف' },
  { id: 'semiannual', labelFa: 'شش ماهه', months: 6, days: 180, discountPercent: 25, badge: '۲۵٪ تخفیف' },
  { id: 'annual', labelFa: 'سالیانه', months: 12, days: 365, discountPercent: 40, badge: '۴۰٪، به‌صرفه‌ترین' },
];

export const RAW_BASE_MONTHLY_PRICES: Record<Exclude<Plan, 'free'>, number> = {
  premium: 199000,
  pro: 299000,
};

export function getGlobalPriceIncreasePercent(): number {
  return Number(import.meta.env.VITE_GLOBAL_PRICE_INCREASE_PERCENT ?? 0);
}

export function getBaseMonthlyPrices(): Record<Exclude<Plan, 'free'>, number> {
  const p = getGlobalPriceIncreasePercent();
  return {
    premium: Math.round((RAW_BASE_MONTHLY_PRICES.premium * (1 + p / 100)) / 1000) * 1000,
    pro: Math.round((RAW_BASE_MONTHLY_PRICES.pro * (1 + p / 100)) / 1000) * 1000,
  };
}

export const RENEWAL_EXTRA_DISCOUNT_PERCENT = 10;

export interface PriceCalculation {
  baseTotalToman: number;
  cycleDiscountPercent: number;
  renewalDiscountPercent: number;
  totalDiscountPercent: number;
  finalPayableToman: number;
  monthlyEquivalentToman: number;
  savedAmountToman: number;
  daysToAdd: number;
}

export function calculateSubscriptionPrice(
  plan: Exclude<Plan, 'free'>,
  cycleId: BillingCycle,
  isRenewal: boolean,
  settings?: SiteSettings
): PriceCalculation {
  const cycle = BILLING_CYCLES.find((c) => c.id === cycleId) || BILLING_CYCLES[0];
  const p = getGlobalPriceIncreasePercent();
  const baseSource = settings
    ? { premium: settings.monthly_premium, pro: settings.monthly_pro }
    : RAW_BASE_MONTHLY_PRICES;

  const baseMonthly = Math.round((baseSource[plan] * (1 + p / 100)) / 1000) * 1000;
  const baseTotalToman = baseMonthly * cycle.months;

  const cycleDiscount =
    settings && cycle.id === 'quarterly'
      ? settings.discount_quarterly
      : settings && cycle.id === 'semiannual'
        ? settings.discount_semiannual
        : settings && cycle.id === 'annual'
          ? settings.discount_annual
          : cycle.discountPercent;

  const renewalDiscount = isRenewal
    ? (settings ? settings.renewal_discount : RENEWAL_EXTRA_DISCOUNT_PERCENT)
    : 0;

  const afterCycle = baseTotalToman * (1 - cycleDiscount / 100);
  const afterRenewal = afterCycle * (1 - renewalDiscount / 100);
  const finalPayableToman = Math.round(afterRenewal / 1000) * 1000;

  const monthlyEquivalentToman = Math.round(finalPayableToman / cycle.months / 1000) * 1000;
  const savedAmountToman = baseTotalToman - finalPayableToman;
  const totalDiscountPercent =
    baseTotalToman > 0 ? Math.round((savedAmountToman / baseTotalToman) * 100) : 0;

  return {
    baseTotalToman,
    cycleDiscountPercent: cycleDiscount,
    renewalDiscountPercent: renewalDiscount,
    totalDiscountPercent,
    finalPayableToman,
    monthlyEquivalentToman,
    savedAmountToman,
    daysToAdd: cycle.days,
  };
}

export function formatToman(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

export interface ZarinpalRequestResult {
  ready: boolean;
  paymentUrl?: string;
  authority?: string;
  message: string;
}

export async function initiateZarinpalPayment(params: {
  plan: Exclude<Plan, 'free'>;
  cycle: BillingCycle;
  expectedAmountToman: number;
}): Promise<ZarinpalRequestResult> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData?.user?.id;

  if (!userId) {
    throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید.');
  }

  const cycleObj = BILLING_CYCLES.find((c) => c.id === params.cycle) || BILLING_CYCLES[0];

  const response = await fetch('https://lumeraworld.ir/payment.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      userId: userId,
      plan: params.plan,
      tier: params.plan,
      cycle: params.cycle,
      months: cycleObj.months,
      days: cycleObj.days,
      amount: params.expectedAmountToman,
      expectedAmountToman: params.expectedAmountToman,
      return_url: window.location.origin + window.location.pathname,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result) {
    throw new Error(result?.message || 'درخواست پرداخت به درگاه لومِرا انجام نشد.');
  }

  const paymentUrl =
    result.paymentUrl ||
    result.payment_url ||
    result.url ||
    (result.trackId ? `https://gateway.zibal.ir/start/${result.trackId}` : undefined);

  if ((result.success || result.ready || paymentUrl) && paymentUrl) {
    return {
      ready: true,
      paymentUrl,
      authority: String(result.trackId || result.authority || ''),
      message: result.message || 'در حال انتقال به درگاه پرداخت...',
    };
  }

  return {
    ready: false,
    message: result.message || 'خطا در ایجاد تراکنش درگاه پرداخت.',
  };
}

export async function verifyZarinpalPayment(
  authority: string,
  status: string
): Promise<{ success: boolean; message: string }> {
  if (status === '1' || status === '2' || status?.toUpperCase() === 'OK' || status === 'success') {
    return { success: true, message: 'پرداخت با موفقیت انجام و اشتراک شما فعال شد.' };
  }
  const { data, error } = await supabase.functions.invoke<{ success: boolean; message: string }>(
    'zarinpal-payment',
    { body: { action: 'verify', authority, status } }
  );
  if (error || !data) {
    return { success: false, message: 'تأیید پرداخت انجام نشد.' };
  }
  return data;
}
