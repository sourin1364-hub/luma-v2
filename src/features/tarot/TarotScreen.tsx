import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Sparkles } from 'lucide-react';

export function TarotScreen() {
  return (
    <div className="space-y-5">
      <PageHeader title="تاروت" subtitle="۷۸ کارت با معانی کامل" />
      <Card variant="glass" padding="lg" className="text-center py-16">
        <Sparkles className="w-16 h-16 text-[var(--luma-gold)] mx-auto mb-4 opacity-50" />
        <h3 className="font-heading text-xl text-[var(--luma-text)] mb-2">در حال ساخت...</h3>
        <p className="text-sm text-[var(--luma-text-muted)]">
          موتور تاروت کامل است (۷۸ کارت + ۶ چیدمان). صفحه انتخاب چیدمان در گام بعدی ساخته می‌شود.
        </p>
      </Card>
    </div>
  );
}