import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Percent,
  RefreshCw,
  CreditCard,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useSubscription, type Plan, type BillingCycle } from '../../hooks/useSubscription';
import { useAuthStore } from '../../store/useAuthStore';
import {
  BILLING_CYCLES,
  calculateSubscriptionPrice,
  formatToman,
  initiateZarinpalPayment,
  RENEWAL_EXTRA_DISCOUNT_PERCENT,
} from './zarinpalService';
import { toPersianDigits } from '../../engines/calendar/format';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const PLAN_DETAILS: {
  id: Plan;
  name: string;
  subtitle: string;
  popular?: boolean;
  features: string[];
}[] = [
  {
    id: 'free',
    name: 'رایگان پایه',
    subtitle: 'برای آشنایی با دنیای لوما',
    features: [
      'چارت تولد پایه و موقعیت سیارات',
      'کارت روزانه تاروت با انیمیشن سه‌بعدی',
      '۶ چیدمان پایه تاروت (تک‌کارتی، ۳ کارتی، بله/خیر)',
      'محاسبه پایه ابجد کبیر و عدد مسیر زندگی',
      'زودیاک غربی، سنگ تولد و زودیاک چینی پایه',
    ],
  },
  {
    id: 'premium',
    name: 'پریمیوم (نقره کیهانی)',
    subtitle: 'دسترسی به چیدمان‌ها و تحلیل‌های عمیق',
    popular: true,
    features: [
      'تمامی امکانات پلن رایگان بدون محدودیت',
      'چیدمان‌های تخصصی تاروت (نعل اسب، رابطه عاطفی، مسیر شغلی)',
      'موتور سنتز و روایت ترکیبی هوشمند LUMA',
      'سیناستری و بررسی تطابق عاطفی دو چارت تولد',
      'ذخیره نامحدود فال‌ها در تاریخچه ابری',
      'تحلیل کامل ارتعاش نام و عدد روح در عددشناسی',
    ],
  },
  {
    id: 'pro',
    name: 'حرفه‌ای (طلای کیهانی)',
    subtitle: 'کامل‌ترین سطح خودشناسی و پیش‌بینی',
    features: [
      'تمامی امکانات پلن پریمیوم',
      'چیدمان جامع ۱۰ کارتی صلیب سلتیک (Celtic Cross)',
      'چیدمان ۱۲ کارتی سالانه (پیش‌بینی ماه به ماه سال)',
      'تقویم نجومی، ترانزیت‌های روزانه و فازهای ماه',
      'تحلیل جامع چالش‌ها، کارما و نقاط قوت چارت تولد',
      'اولویت در دریافت قابلیت‌های جدید هوش مصنوعی',
    ],
  },
];

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const user = useAuthStore((s) => s.user);
  const sub = useSubscription();

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('quarterly');
  const [payingPlan, setPayingPlan] = useState<Plan | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'info' | 'error';
    text: string;
  } | null>(null);

  // اگر کاربر اشتراک فعال غیررایگان داشته باشد، خرید جدید شامل تخفیف تمدید وفاداری می‌شود
  const isRenewalEligible = !sub.isAdmin && sub.isActive && sub.plan !== 'free';

  const handleCheckout = async (planId: Exclude<Plan, 'free'>) => {
    if (!user) return;
    setPayingPlan(planId);
    setPaymentMessage(null);

    try {
      const pricing = calculateSubscriptionPrice(planId, selectedCycle, isRenewalEligible);
      const res = await initiateZarinpalPayment({
        userId: user.id,
        userEmail: user.email,
        plan: planId,
        cycle: selectedCycle,
        amountToman: pricing.finalPayableToman,
      });

      if (res.ready && res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        setPaymentMessage({
          type: 'info',
          text: res.message,
        });
      }
    } catch (e) {
      setPaymentMessage({
        type: 'error',
        text: 'خطا در پردازش درخواست پرداخت.',
      });
    } finally {
      setPayingPlan(null);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      <PageHeader
        title="اشتراک ویژه LUMA"
        subtitle="ارتقای سطح دسترسی و بازگشایی چیدمان‌های تخصصی"
        onBack={onBack}
      />

      {/* بنر وضعیت ادمین یا تخفیف تمدید */}
      {sub.isAdmin ? (
        <Card variant="gold-border" padding="md" className="bg-[var(--luma-gold)]/10">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[var(--luma-gold)] flex-shrink-0" />
            <div>
              <h4 className="font-heading text-xs text-[var(--luma-gold)] font-bold">
                حساب مدیریت کل (Admin) فعال است
              </h4>
              <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
                شما به عنوان مدیر سیستم به تمامی قابلیت‌های پریمیوم و حرفه‌ای دسترسی دائمی و کامل دارید.
              </p>
            </div>
          </div>
        </Card>
      ) : isRenewalEligible ? (
        <Card variant="gold-border" padding="md" className="bg-emerald-500/10 border-emerald-500/40">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-heading text-xs text-emerald-400 font-bold">
                هدیه وفاداری تمدید اشتراک ({toPersianDigits(RENEWAL_EXTRA_DISCOUNT_PERCENT)}٪ تخفیف بیشتر!)
              </h4>
              <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
                از اشتراک فعلی شما {toPersianDigits(sub.daysRemaining)} روز باقی مانده است. با تمدید زودهنگام، علاوه بر تخفیف دوره‌ای، {toPersianDigits(RENEWAL_EXTRA_DISCOUNT_PERCENT)}٪ تخفیف وفاداری روی فاکتور شما اعمال شد.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* انتخابگر دوره زمانی با تخفیف پلکانی */}
      <Card variant="elevated" padding="sm">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs text-[var(--luma-text)] font-medium flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
            انتخاب مدت اشتراک (تخفیف پلکانی):
          </span>
          <span className="text-[10px] text-[var(--luma-gold)]">تا ۴۰٪ صرفه‌جویی</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BILLING_CYCLES.map((cycle) => {
            const isSelected = selectedCycle === cycle.id;
            return (
              <button
                key={cycle.id}
                type="button"
                onClick={() => setSelectedCycle(cycle.id)}
                className={
                  'relative p-2.5 rounded-xl border text-center transition-all ' +
                  (isSelected
                    ? 'bg-[var(--luma-gold)]/15 border-[var(--luma-gold)] text-[var(--luma-text)] shadow-sm'
                    : 'bg-[var(--luma-bg-subtle)] border-[var(--luma-border)] text-[var(--luma-text-muted)] hover:border-[var(--luma-gold)]/40')
                }
              >
                <div className="text-xs font-bold">{cycle.labelFa}</div>
                {cycle.discountPercent > 0 ? (
                  <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                    {toPersianDigits(cycle.discountPercent)}٪ تخفیف
                  </div>
                ) : (
                  <div className="text-[10px] text-[var(--luma-text-subtle)] mt-0.5">قیمت پایه</div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* پیام وضعیت درگاه پرداخت */}
      {paymentMessage && (
        <Card
          variant="elevated"
          padding="md"
          className={
            paymentMessage.type === 'error'
              ? 'border-red-500/40 bg-red-500/10'
              : 'border-amber-500/40 bg-amber-500/10'
          }
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className={
                'w-5 h-5 flex-shrink-0 mt-0.5 ' +
                (paymentMessage.type === 'error' ? 'text-red-400' : 'text-amber-400')
              }
            />
            <div className="text-xs leading-relaxed text-[var(--luma-text)]">
              {paymentMessage.text}
            </div>
          </div>
        </Card>
      )}

      {/* کارت‌های پلن‌ها */}
      <div className="space-y-4">
        {PLAN_DETAILS.map((plan) => {
          const isCurrentPlan = sub.plan === plan.id;
          const isFree = plan.id === 'free';
          const pricing = !isFree
            ? calculateSubscriptionPrice(
                plan.id as Exclude<Plan, 'free'>,
                selectedCycle,
                isRenewalEligible
              )
            : null;
          const cycleObj = BILLING_CYCLES.find((c) => c.id === selectedCycle)!;

          return (
            <Card
              key={plan.id}
              variant={plan.popular ? 'gold-border' : 'elevated'}
              padding="md"
              className={plan.popular ? 'relative' : ''}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] font-bold shadow">
                  محبوب‌ترین انتخاب
                </span>
              )}

              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {isFree ? (
                      <Sparkles className="w-4 h-4 text-[var(--luma-text-muted)]" />
                    ) : (
                      <Crown className="w-4 h-4 text-[var(--luma-gold)]" />
                    )}
                    <h3 className="font-heading text-base text-[var(--luma-text)]">{plan.name}</h3>
                  </div>
                  <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">{plan.subtitle}</p>
                </div>

                {isCurrentPlan && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    پلن فعال شما
                  </span>
                )}
              </div>

              {/* بخش قیمت‌گذاری و تخفیف */}
              <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] mb-4">
                {isFree ? (
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-[var(--luma-text)]">رایگان</span>
                    <span className="text-xs text-[var(--luma-text-muted)]">همیشگی</span>
                  </div>
                ) : pricing ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--luma-text-muted)]">
                        مبلغ قابل پرداخت ({cycleObj.labelFa}):
                      </span>
                      {pricing.totalDiscountPercent > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          {toPersianDigits(pricing.totalDiscountPercent)}٪ تخفیف کل
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[var(--luma-gold)]">
                        {formatToman(pricing.finalPayableToman)}
                      </span>
                      <span className="text-xs text-[var(--luma-text)]">تومان</span>
                      {pricing.savedAmountToman > 0 && (
                        <span className="text-xs text-[var(--luma-text-subtle)] line-through mr-auto">
                          {formatToman(pricing.baseTotalToman)} تومان
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--luma-text-muted)] pt-1 border-t border-[var(--luma-border)]">
                      <span>معادل ماهانه: {formatToman(pricing.monthlyEquivalentToman)} تومان</span>
                      {pricing.savedAmountToman > 0 && (
                        <span className="text-emerald-400">
                          سود شما: {formatToman(pricing.savedAmountToman)} تومان
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* ویژگی‌های پلن */}
              <ul className="space-y-2 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--luma-text)]">
                    <Check className="w-3.5 h-3.5 text-[var(--luma-gold)] flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              {isFree ? (
                <Button variant="secondary" fullWidth disabled>
                  {isCurrentPlan ? 'پلن فعلی شما' : 'پلن پایه پیش‌فرض'}
                </Button>
              ) : (
                <Button
                  variant="gold"
                  fullWidth
                  onClick={() => handleCheckout(plan.id as Exclude<Plan, 'free'>)}
                  disabled={payingPlan === plan.id}
                >
                  {payingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال اتصال به زرین‌پال...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      {isRenewalEligible && isCurrentPlan
                        ? `تمدید ${cycleObj.labelFa} با تخفیف ویژه`
                        : `خرید اشتراک ${cycleObj.labelFa} (زرین‌پال)`}
                    </>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
