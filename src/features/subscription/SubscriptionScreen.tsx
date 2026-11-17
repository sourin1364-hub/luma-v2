import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
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
  Zap,
  Lock,
  Headphones,
} from 'lucide-react';
import { useSubscription, type Plan, type BillingCycle } from '../../hooks/useSubscription';
import { SubscriptionStatusNotice } from './SubscriptionBadge';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';
import {
  BILLING_CYCLES,
  calculateSubscriptionPrice,
  initiateZarinpalPayment,
  getGlobalPriceIncreasePercent,
} from './zarinpalService';
import { getSiteSettings, DEFAULT_SITE_SETTINGS, type SiteSettings } from './siteSettingsService';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const BILLING_CYCLE_TRANSLATION_KEYS: Record<BillingCycle, TranslationKey> = {
  monthly: 'sub_cycle_monthly',
  quarterly: 'sub_cycle_quarterly',
  semiannual: 'sub_cycle_biannual',
  annual: 'sub_cycle_yearly',
};

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const user = useAuthStore((s) => s.user);
  const sub = useSubscription();
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('quarterly');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  useEffect(() => { getSiteSettings().then(setSiteSettings); }, []);
  const [payingPlan, setPayingPlan] = useState<Plan | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'info' | 'error';
    text: string;
  } | null>(null);

  const currentPercent = getGlobalPriceIncreasePercent();

  const isRenewalEligible = !sub.isAdmin && sub.isActive && sub.plan !== 'free';
  const formatTomanLocal = (amount: number) => formatNum(amount.toLocaleString('en-US'), lang);

  const getCycleLabel = (cycle: BillingCycle) => t[BILLING_CYCLE_TRANSLATION_KEYS[cycle]];

  const PLAN_DETAILS = useMemo(
    () => [
      {
        id: 'free' as Plan,
        name: t['sub_screen_plan_free_name'],
        subtitle: t['sub_screen_plan_free_sub'],
        features: [
          t['sub_screen_plan_free_f1'],
          t['sub_screen_plan_free_f2'],
          t['sub_screen_plan_free_f3'],
          t['sub_screen_plan_free_f4'],
          t['sub_screen_plan_free_f5'],
        ],
      },
      {
        id: 'premium' as Plan,
        name: t['sub_screen_plan_premium_name'],
        subtitle: t['sub_screen_plan_premium_sub'],
        popular: true,
        features: [
          t['sub_screen_plan_premium_f1'],
          t['sub_screen_plan_premium_f2'],
          t['sub_screen_plan_premium_f3'],
          t['sub_screen_plan_premium_f4'],
          t['sub_screen_plan_premium_f5'],
          t['sub_screen_plan_premium_f6'],
        ],
      },
      {
        id: 'pro' as Plan,
        name: t['sub_screen_plan_pro_name'],
        subtitle: t['sub_screen_plan_pro_sub'],
        features: [
          t['sub_screen_plan_pro_f1'],
          t['sub_screen_plan_pro_f2'],
          t['sub_screen_plan_pro_f3'],
          t['sub_screen_plan_pro_f4'],
          t['sub_screen_plan_pro_f5'],
          t['sub_screen_plan_pro_f6'],
        ],
      },
    ],
    [t]
  );

  const handleCheckout = async (planId: Exclude<Plan, 'free'>) => {
    if (!user) return;
    setPayingPlan(planId);
    setPaymentMessage(null);

    try {
      const pricing = calculateSubscriptionPrice(planId, selectedCycle, isRenewalEligible, siteSettings);
      const res = await initiateZarinpalPayment({
        plan: planId,
        cycle: selectedCycle,
        expectedAmountToman: pricing.finalPayableToman,
      });

      if (res.ready && res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        setPaymentMessage({ type: 'error', text: t['sub_screen_pay_err'] });
      }
    } catch {
      setPaymentMessage({ type: 'error', text: t['sub_screen_pay_err'] });
    } finally {
      setPayingPlan(null);
    }
  };

  return (
    <div className="relative isolate mx-auto w-full max-w-6xl space-y-8 overflow-x-hidden px-2 pb-28 text-[var(--luma-text)] sm:px-4 lg:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-64 w-[min(90vw,48rem)] -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: 'color-mix(in srgb, var(--luma-accent) 10%, transparent)' }}
      />
      <PageHeader
        title={t['sub_screen_title']}
        subtitle={t['sub_screen_subtitle']}
        onBack={onBack}
      />

      <SubscriptionStatusNotice error={sub.error} />

      {sub.isAdmin && (
        <div
          className="space-y-4 rounded-2xl border bg-[var(--luma-bg-elevated)] p-4 backdrop-blur-md sm:p-6"
          style={{ borderColor: 'color-mix(in srgb, var(--luma-accent) 30%, transparent)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-[var(--luma-accent-soft)]" />
              <span className="text-sm font-semibold text-[var(--luma-text)]">{t['sub_admin_percent_title']}</span>
            </div>
            {currentPercent !== 0 && (
              <span
                className="whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium text-[var(--luma-accent-soft)]"
                style={{
                  borderColor: 'color-mix(in srgb, var(--luma-accent) 30%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--luma-accent) 15%, transparent)',
                }}
              >
                {t['sub_admin_percent_current']} {currentPercent > 0 ? `+${currentPercent}%` : `${currentPercent}%`}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-start">
            {t['sub_admin_percent_environment']}
          </p>
        </div>
      )}

      {sub.isAdmin && (
        <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 backdrop-blur-md">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-amber-300">{t['sub_screen_admin_banner_title']}</h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed text-start">{t['sub_screen_admin_banner_desc']}</p>
            </div>
          </div>
        </div>
      )}

      {isRenewalEligible && (
        <div className="rounded-2xl p-4 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <div className="flex items-start sm:items-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-emerald-300">
                {t['sub_screen_renew_banner_title']}
                {formatNum(siteSettings.renewal_discount, lang)}
                {t['sub_screen_renew_banner_title_end']}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed text-start">
                {t['sub_screen_renew_banner_desc_1']} {formatNum(sub.daysRemaining, lang)}{' '}
                {t['sub_screen_renew_banner_desc_2']} {formatNum(siteSettings.renewal_discount, lang)}
                {t['sub_screen_renew_banner_desc_3']}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl p-4 sm:p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
          <span className="text-sm sm:text-base font-semibold text-slate-300 flex items-center gap-2">
            <Percent className="w-5 h-5 text-purple-400" />
            {t['sub_screen_cycle_title']}
          </span>
          <span className="text-xs font-medium text-[var(--luma-accent-soft)] sm:text-sm">{t['sub_screen_cycle_savings']}</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {BILLING_CYCLES.map((cycle) => {
            const isSelected = selectedCycle === cycle.id;
            return (
              <button
                key={cycle.id}
                type="button"
                onClick={() => setSelectedCycle(cycle.id)}
                className={`relative py-3.5 px-3 rounded-2xl border text-center transition-all duration-300 flex flex-col justify-center items-center ${
                  isSelected
                    ? 'scale-[1.02] border bg-[var(--luma-bg-elevated)] shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10'
                }`}
                style={isSelected ? {
                    borderColor: 'var(--luma-accent)',
                    backgroundColor: 'color-mix(in srgb, var(--luma-accent) 15%, transparent)',
                    boxShadow: '0 4px 16px color-mix(in srgb, var(--luma-accent) 20%, transparent)',
                } : undefined}
              >
                <div className={`text-xs font-medium sm:text-sm ${isSelected ? 'text-[var(--luma-text)]' : 'text-slate-300'}`}>
                  {getCycleLabel(cycle.id)}
                </div>
                {(cycle.id === 'quarterly' ? siteSettings.discount_quarterly : cycle.id === 'semiannual' ? siteSettings.discount_semiannual : cycle.id === 'annual' ? siteSettings.discount_annual : cycle.discountPercent) > 0 ? (
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-bold mt-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                    {formatNum(cycle.id === 'quarterly' ? siteSettings.discount_quarterly : cycle.id === 'semiannual' ? siteSettings.discount_semiannual : cycle.id === 'annual' ? siteSettings.discount_annual : cycle.discountPercent, lang)} {t['sub_screen_cycle_discount']}
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs text-slate-500 mt-1.5 whitespace-nowrap">{t['sub_screen_cycle_base_price']}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {paymentMessage && (
        <div
          className={`rounded-2xl p-4 border backdrop-blur-md flex items-start gap-3 ${
            paymentMessage.type === 'error'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed text-start">{paymentMessage.text}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full">
        {PLAN_DETAILS.map((plan) => {
          const isCurrentPlan = sub.plan === plan.id;
          const isFree = plan.id === 'free';
          const pricing = !isFree
            ? calculateSubscriptionPrice(plan.id as Exclude<Plan, 'free'>, selectedCycle, isRenewalEligible, siteSettings)
            : null;
          const cycleObj = BILLING_CYCLES.find((c) => c.id === selectedCycle)!;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 relative backdrop-blur-2xl w-full flex flex-col justify-between ${
                plan.popular
                ? 'border-2 bg-[var(--luma-bg-elevated)] shadow-2xl lg:-translate-y-2'
                : 'border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] hover:border-[var(--luma-accent)]'
              }`}
              style={plan.popular ? {
              borderColor: 'color-mix(in srgb, var(--luma-accent) 60%, transparent)',
              boxShadow: '0 24px 70px color-mix(in srgb, var(--luma-accent) 10%, transparent)',
              } : undefined}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[var(--luma-accent)] to-[var(--luma-gold)] px-4 py-1.5 text-[10px] font-semibold text-white shadow-lg sm:text-xs">
                    <Sparkles className="w-4 h-4" />
                    {t['sub_screen_popular']}
                  </span>
                </div>
              )}

              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      plan.popular
                        ? 'bg-gradient-to-tr from-[var(--luma-accent)] to-[var(--luma-gold)] text-white shadow-md'
                        : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]'
                    }`}
                  >
                    {isFree ? <Sparkles className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
                  </div>

                  {isCurrentPlan && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold whitespace-nowrap">
                      {t['sub_screen_current_plan']}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <h3 className="font-heading text-lg font-semibold tracking-tight text-[var(--luma-text)] sm:text-xl">
                    {plan.name}
                  </h3>
                  <p className="mt-1.5 text-xs font-normal leading-relaxed text-[var(--luma-text-muted)] text-start">
                    {plan.subtitle}
                  </p>
                </div>

                <div className="h-px bg-white/10 w-full mb-5" />

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 w-full mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 w-full">
                      <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-purple-300" />
                      </div>
                      <span className="leading-relaxed flex-1 text-start">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full flex flex-col pt-4 mt-auto">
                <div className="mb-4 w-full rounded-2xl border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)]/70 p-4 shadow-inner sm:p-5">
                  {isFree ? (
                    <div className="py-2 text-center">
                      <span className="text-3xl font-semibold text-[var(--luma-text)]">{t['sub_badge_free']}</span>
                      <p className="text-xs text-slate-400 mt-2">{t['sub_screen_free_forever']}</p>
                    </div>
                  ) : pricing ? (
                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-slate-400">
                          {t['sub_screen_payable']} {getCycleLabel(cycleObj.id)}
                        </span>
                        {pricing.totalDiscountPercent > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            {formatNum(pricing.totalDiscountPercent, lang)} {t['sub_screen_discount_total']}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-3xl font-semibold tracking-tight text-[var(--luma-text)]">
                          {formatTomanLocal(pricing.finalPayableToman)}
                        </span>
                        <span className="text-xs font-medium text-[var(--luma-accent-soft)]">{t['sub_screen_toman']}</span>
                      </div>

                      {pricing.savedAmountToman > 0 && (
                        <div className="text-xs text-slate-500 line-through">
                          {formatTomanLocal(pricing.baseTotalToman)}
                        </div>
                      )}

                      <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                        {t['sub_screen_monthly_eq']} {formatTomanLocal(pricing.monthlyEquivalentToman)} {t['sub_screen_toman']}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="w-full">
                  {isFree ? (
                    <Button variant="secondary" fullWidth disabled className="opacity-60 py-3.5 text-sm">
                      {isCurrentPlan ? t['sub_screen_btn_current'] : t['sub_screen_btn_base']}
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCheckout(plan.id as Exclude<Plan, 'free'>)}
                      disabled={payingPlan === plan.id}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition duration-200 shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-[var(--luma-accent)] to-[var(--luma-gold)] text-white'
                          : 'border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)] text-[var(--luma-text)] hover:bg-[var(--luma-bg-elevated)]'
                      }`}
                    >
                      {payingPlan === plan.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{t['sub_screen_connecting']}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">
                            {isRenewalEligible && isCurrentPlan
                              ? `${t['sub_screen_btn_renew']} ${getCycleLabel(cycleObj.id)}`
                              : `${t['sub_screen_btn_buy']} ${getCycleLabel(cycleObj.id)}`}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs lg:text-sm text-slate-400 pt-8 border-t border-white/10">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[var(--luma-accent-soft)] text-sm font-semibold">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <span>{t['sub_footer_zap_title']}</span>
          </div>
          <p className="leading-relaxed text-start">
            {t['sub_footer_zap_desc']}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <span>{t['sub_footer_lock_title']}</span>
          </div>
          <p className="leading-relaxed text-start">
            {t['sub_footer_lock_desc']}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
            <Headphones className="w-5 h-5 flex-shrink-0" />
            <span>{t['sub_footer_support_title']}</span>
          </div>
          <p className="leading-relaxed text-start">
            {t['sub_footer_support_desc']}
          </p>
        </div>
      </div>
    </div>
  );
}