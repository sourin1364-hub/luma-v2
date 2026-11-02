import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[var(--luma-gold)] text-[#0B0D1A] hover:bg-[var(--luma-gold-soft)] active:scale-[0.98] shadow-glow-gold-sm hover:shadow-glow-gold',
  secondary:
    'bg-transparent text-[var(--luma-text)] border border-[var(--luma-border-strong)] hover:border-[var(--luma-gold)] hover:text-[var(--luma-gold)]',
  ghost:
    'bg-transparent text-[var(--luma-text-muted)] hover:bg-[var(--luma-bg-subtle)] hover:text-[var(--luma-text)]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
  gold:
    'bg-gradient-to-br from-[#D6B56D] via-[#E8C77A] to-[#B8944E] text-[#0B0D1A] hover:shadow-glow-gold active:scale-[0.98]'
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          'inline-flex items-center justify-center gap-2 font-medium',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--luma-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--luma-bg)]',
          VARIANTS[variant],
          SIZES[size],
          fullWidth ? 'w-full' : '',
          className
        ].join(' ')}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';