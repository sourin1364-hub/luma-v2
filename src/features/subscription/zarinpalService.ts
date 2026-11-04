import type { Plan, BillingCycle } from '../../hooks/useSubscription';

export interface CycleConfig {
  id: BillingCycle;
  labelFa: string;
  months: number;
  days: number;
  discountPercent: number;
  badge?: string;
}

export const BILLING_CYCLES: CycleConfig[] = [
  {
    id: 'monthly',
    labelFa: 'یک ماهه',
    months: 1,
    days: 30,
    discountPercent: 0,
  },
  {
    id: 'quarterly',
    labelFa: 'سه ماهه',
    months: 3,
    days: 90,
    discountPercent: 15,
    badge: '۱۵٪ تخفیف',
  },
  {
    id: 'semiannual',
    labelFa: 'شش ماهه',
    months: 6,
    days: 180,
    discountPercent: 25,
    badge: '۲۵٪ تخفیف',
  },
  {
    id: 'annual',
    labelFa: 'سالیانه',
    months: 12,
    days: 365,
    discountPercent: 40,
    badge: '۴۰٪، به‌صرفه‌ترین',
  },
];

export const BASE_MONTHLY_PRICES: Record<Exclude<Plan, 'free'>, number> = {
  premium: 99000, // ۹۹,۰۰۰ تومان در ماه
  pro: 199000,    // ۱۹۹,۰۰۰ تومان در ماه
};

// درصد تخفیف وفاداری اضافه برای تمدید اشتراک فعال
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
  isRenewal: boolean
): PriceCalculation {
  const cycle = BILLING_CYCLES.find((c) => c.id === cycleId) || BILLING_CYCLES[0];
  const baseMonthly = BASE_MONTHLY_PRICES[plan];
  const baseTotalToman = baseMonthly * cycle.months;

  const cycleDiscount = cycle.discountPercent;
  const renewalDiscount = isRenewal ? RENEWAL_EXTRA_DISCOUNT_PERCENT : 0;

  // اعمال تخفیف دوره و سپس تخفیف وفاداری تمدید، گرد شده به هزار تومان
  const afterCycle = baseTotalToman * (1 - cycleDiscount / 100);
  const afterRenewal = afterCycle * (1 - renewalDiscount / 100);
  const finalPayableToman = Math.round(afterRenewal / 1000) * 1000;

  const monthlyEquivalentToman = Math.round(finalPayableToman / cycle.months / 1000) * 1000;
  const savedAmountToman = baseTotalToman - finalPayableToman;
  const totalDiscountPercent = Math.round((savedAmountToman / baseTotalToman) * 100);

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

/**
 * ارسال درخواست پرداخت به درگاه زرین‌پال
 * در صورتی که VITE_ZARINPAL_MERCHANT_ID در محیط تنظیم شده باشد به درگاه متصل می‌شود.
 */
export async function initiateZarinpalPayment(params: {
  userId: string;
  userEmail?: string;
  plan: Exclude<Plan, 'free'>;
  cycle: BillingCycle;
  amountToman: number;
}): Promise<ZarinpalRequestResult> {
  const merchantId = import.meta.env.VITE_ZARINPAL_MERCHANT_ID;

  if (!merchantId || merchantId.length < 32) {
    return {
      ready: false,
      message:
        'درگاه پرداخت زرین‌پال در حال اتصال نهایی و دریافت کد پذیرنده (Merchant ID) است. به‌زودی پرداخت آنلاین فعال خواهد شد.',
    };
  }

  try {
    const callbackUrl = `${window.location.origin}${import.meta.env.BASE_URL}?payment_verify=1&plan=${params.plan}&cycle=${params.cycle}`;
    const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: params.amountToman * 10, // تبدیل تومان به ریال برای زرین‌پال
        callback_url: callbackUrl,
        description: `خرید اشتراک ${params.plan === 'pro' ? 'حرفه‌ای' : 'پریمیوم'} LUMA (${params.cycle})`,
        metadata: {
          email: params.userEmail || '',
        },
      }),
    });

    const json = await response.json();
    if (json?.data?.code === 100 && json?.data?.authority) {
      const authority = json.data.authority;
      return {
        ready: true,
        authority,
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
        message: 'در حال انتقال به درگاه امن زرین‌پال...',
      };
    }

    return {
      ready: false,
      message: 'خطا در برقراری ارتباط با درگاه زرین‌پال. لطفاً دقایقی دیگر تلاش کنید.',
    };
  } catch (err) {
    return {
      ready: false,
      message: 'ارتباط با سرور درگاه زرین‌پال برقرار نشد. وضعیت اتصال اینترنت را بررسی کنید.',
    };
  }
}
