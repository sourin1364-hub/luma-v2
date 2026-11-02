import { Crown, Sparkles, Infinity } from 'lucide-react';

export type Plan = 'free' | 'premium' | 'pro';

interface SubscriptionBadgeProps {
  plan: Plan;
  isAdmin: boolean;
  expiresAt: string | null;
  variant?: 'compact' | 'full';
}

const PLAN_CONFIG = {
  free: {
    label: 'رایگان',
    icon: Sparkles,
    color: 'text-[var(--luma-text-muted)]',
    bg: 'bg-[var(--luma-bg-subtle)]',
    border: 'border-[var(--luma-border)]',
  },
  premium: {
    label: 'پریمیوم',
    icon: Crown,
    color: 'text-slate-300',
    bg: 'bg-slate-500/10',
    border: 'border-slate-400/30',
  },
  pro: {
    label: 'حرفه‌ای',
    icon: Crown,
    color: 'text-[var(--luma-gold)]',
    bg: 'bg-[var(--luma-gold-glow)]',
    border: 'border-[var(--luma-gold)]/40',
  },
};

function getRemainingDays(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - new Date().getTime();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatRemaining(expiresAt: string | null, isAdmin: boolean): string {
  if (isAdmin) return 'نامحدود';
  const days = getRemainingDays(expiresAt);
  if (days === null) return '—';
  if (days <= 0) return 'منقضی شده';
  if (days === 1) return '۱ روز باقیمانده';
  if (days < 30) return `${days} روز باقیمانده`;
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (remainingDays === 0) return `${months} ماه باقیمانده`;
  return `${months} ماه و ${remainingDays} روز باقیمانده`;
}

export function SubscriptionBadge({ plan, isAdmin, expiresAt, variant = 'compact' }: SubscriptionBadgeProps) {
  const config = PLAN_CONFIG[plan];
  const Icon = config.icon;
  const remaining = formatRemaining(expiresAt, isAdmin);

  if (variant === 'compact') {
    return (
      <span
        className={
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ' +
          config.bg + ' ' + config.color + ' ' + config.border
        }
      >
        <Icon className="w-3 h-3" />
        {isAdmin ? 'ادمین' : config.label}
      </span>
    );
  }

  return (
    <div className={'p-4 rounded-xl border ' + config.bg + ' ' + config.border}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={'w-5 h-5 ' + config.color} />
        <div className="flex-1">
          <p className={'text-sm font-bold ' + config.color}>
            {isAdmin ? 'ادمین LUMA' : `مشترک ${config.label}`}
          </p>
          <p className="text-[10px] text-[var(--luma-text-muted)]">
            {isAdmin ? 'دسترسی کامل به همه قابلیت‌ها' : 'اشتراک فعال'}
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