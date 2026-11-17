import { Crown, Sparkles, Infinity } from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

export type Plan = 'free' | 'premium' | 'pro';

export function SubscriptionStatusNotice({ error }: { error: string | null }) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];
  if (!error) return null;
  return (
    <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
      {t['subscription_load_failed']}
    </div>
  );
}

interface SubscriptionBadgeProps {
  plan: Plan;
  isAdmin: boolean;
  expiresAt: string | null;
  variant?: 'compact' | 'full';
}

function getRemainingDays(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - new Date().getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function SubscriptionBadge({ plan, isAdmin, expiresAt, variant = 'compact' }: SubscriptionBadgeProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const PLAN_CONFIG = {
    free: {
      label: t['sub_badge_free'],
      icon: Sparkles,
      color: 'text-[var(--luma-text-muted)]',
      bg: 'bg-[var(--luma-bg-subtle)]',
      border: 'border-[var(--luma-border)]',
    },
    premium: {
      label: t['sub_badge_premium'],
      icon: Crown,
      color: 'text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-400/30',
    },
    pro: {
      label: t['sub_badge_pro'],
      icon: Crown,
      color: 'text-[var(--luma-gold)]',
      bg: 'bg-[var(--luma-gold-glow)]',
      border: 'border-[var(--luma-gold)]/40',
    },
  };

  const config = PLAN_CONFIG[plan];
  const Icon = config.icon;

  let remaining = '—';
  if (isAdmin) {
    remaining = t['sub_badge_unlimited'];
  } else {
    const days = getRemainingDays(expiresAt);
    if (days !== null) {
      if (days <= 0) remaining = t['sub_badge_expired'];
      else if (days === 1) remaining = t['sub_badge_1_day'];
      else if (days < 30) remaining = `${formatNum(days, lang)} ${t['sub_badge_days']}`;
      else {
        const months = Math.floor(days / 30);
        const remDays = days % 30;
        if (remDays === 0) remaining = `${formatNum(months, lang)} ${t['sub_badge_months']}`;
        else remaining = `${formatNum(months, lang)} ${t['sub_badge_months_days']} ${formatNum(remDays, lang)} ${t['sub_badge_days']}`;
      }
    }
  }

  if (variant === 'compact') {
    return (
      <span
        className={
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ' +
          config.bg + ' ' + config.color + ' ' + config.border
        }
      >
        <Icon className="w-3 h-3" />
        {isAdmin ? t['sub_badge_admin'] : config.label}
      </span>
    );
  }

  return (
    <div className={'p-4 rounded-xl border ' + config.bg + ' ' + config.border}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={'w-5 h-5 ' + config.color} />
        <div className="flex-1">
          <p className={'text-sm font-bold ' + config.color}>
            {isAdmin ? t['sub_badge_admin_title'] : `${t['sub_badge_member']} ${config.label}`}
          </p>
          <p className="text-[10px] text-[var(--luma-text-muted)]">
            {isAdmin ? t['sub_badge_admin_desc'] : t['sub_badge_active']}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--luma-border)]/30">
        {isAdmin ? (
          <Infinity className="w-3 h-3 text-[var(--luma-gold)]" />
        ) : null}
        <p className="text-[10px] text-[var(--luma-text-muted)]">
          {remaining}
        </p>
      </div>
    </div>
  );
}