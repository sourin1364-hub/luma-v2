import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Crown, Check, Sparkles, Lock } from 'lucide-react';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'رایگان',
    price: '۰',
    period: 'همیشگی',
    features: [
      'چارت تولد پایه',
      'تحلیل خورشید، ماه و طالع',
      '۳ فال تاروت در ماه',
      'کارت روزانه',
      'تاریخچه محدود',
      'زودیاک چینی پایه'
    ],
    active: true
  },
  {
    id: 'premium',
    name: 'پریمیوم',
    price: '۹۹,۰۰۰',
    period: 'ماهانه',
    features: [
      'همه قابلیت‌های رایگان',
      'چیدمان‌های پیشرفته تاروت',
      'تفسیر جامع LUMA (بدون محدودیت)',
      'گزارش‌های ترکیبی شخصی‌سازی‌شده',
      'سیناستری و مقایسه چارت',
      'ترانزیت‌های شخصی',
      'تاریخچه نامحدود',
      'تحلیل‌های پیشرفته عددشناسی',
      'تم‌های ویژه و شخصی‌سازی'
    ],
    active: false,
    popular: true
  },
  {
    id: 'pro',
    name: 'حرفه‌ای',
    price: '۱۹۹,۰۰۰',
    period: 'ماهانه',
    features: [
      'همه قابلیت‌های پریمیوم',
      'مشاوره تاروت اختصاصی (ماهانه)',
      'تحلیل چارت پیشرفته',
      'گزارش سالانه کامل',
      'پشتیبانی اولویت‌دار',
      'دسترسی زودهنگام به قابلیت‌های جدید'
    ],
    active: false
  }
];

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  return (
    <div className="space-y-5">
      <PageHeader title="اشتراک LUMA" subtitle="قابلیت‌های حرفه‌ای را فعال کنید" onBack={onBack} />

      {/* پیام غیرفعال بودن */}
      <Card variant="elevated" padding="md" className="border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-amber-400">
            درگاه پرداخت در حال آماده‌سازی است. به‌زودی می‌توانید اشتراک تهیه کنید.
          </p>
        </div>
      </Card>

      {/* پلن‌ها */}
      <div className="space-y-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.popular ? 'gold-border' : 'elevated'}
            padding="md"
            className={plan.popular ? 'relative' : ''}
          >
            {plan.popular && (
              <span className="absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] font-bold">
                محبوب‌ترین
              </span>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {plan.id === 'free' ? <Sparkles className="w-4 h-4 text-[var(--luma-text-muted)]" /> : <Crown className="w-4 h-4 text-[var(--luma-gold)]" />}
                  <h3 className="font-heading text-lg text-[var(--luma-text)]">{plan.name}</h3>
                </div>
                <p className="text-xs text-[var(--luma-text-muted)]">
                  <span className="text-xl font-bold text-[var(--luma-text)]">{plan.price}</span>
                  {' '}تومان / {plan.period}
                </p>
              </div>
              {plan.active && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  فعال
                </span>
              )}
            </div>

            <ul className="space-y-1.5 mb-4">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--luma-text-muted)]">
                  <Check className="w-3 h-3 text-[var(--luma-gold)] flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.id === 'free' ? 'secondary' : 'gold'}
              fullWidth
              disabled={!plan.active}
            >
              {plan.active ? 'پلن فعلی شما' : 'به‌زودی'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}