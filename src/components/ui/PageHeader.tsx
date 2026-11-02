import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, onBack, action }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-3 mb-6">
      {onBack && (
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[var(--luma-bg-subtle)] transition-colors"
          aria-label="بازگشت"
        >
          <ArrowRight className="w-5 h-5 text-[var(--luma-text-muted)]" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-[var(--luma-text)] truncate">
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-sm text-[var(--luma-text-muted)] mt-0.5 truncate"
            dir="rtl"
            style={{ unicodeBidi: 'plaintext' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}