import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Hash } from 'lucide-react';

export function NumerologyScreen() {
  return (
    <div className="space-y-5">
      <PageHeader title="علم اعداد" subtitle="ابجد و شماره مسیر زندگی" />
      <Card variant="glass" padding="lg" className="text-center py-16">
        <Hash className="w-16 h-16 text-[var(--luma-gold)] mx-auto mb-4 opacity-50" />
        <h3 className="font-heading text-xl text-[var(--luma-text)] mb-2">در حال ساخت...</h3>
        <p className="text-sm text-[var(--luma-text-muted)]">
          موتور اعداد کامل است (ابجد + مسیر زندگی). صفحه نمایش در گام بعدی ساخته می‌شود.
        </p>
      </Card>
    </div>
  );
}