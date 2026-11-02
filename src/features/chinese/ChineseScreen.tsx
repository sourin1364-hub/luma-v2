import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Star } from 'lucide-react';

export function ChineseScreen() {
  return (
    <div className="space-y-5">
      <PageHeader title="زودیاک چینی" subtitle="حیوان و عنصر سال تولد" />
      <Card variant="glass" padding="lg" className="text-center py-16">
        <Star className="w-16 h-16 text-[var(--luma-gold)] mx-auto mb-4 opacity-50" />
        <h3 className="font-heading text-xl text-[var(--luma-text)] mb-2">در حال ساخت...</h3>
        <p className="text-sm text-[var(--luma-text-muted)]">
          موتور چینی کامل است. صفحه نمایش در گام بعدی ساخته می‌شود.
        </p>
      </Card>
    </div>
  );
}