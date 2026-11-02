import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gold-border';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  default:
    'bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]',
  elevated:
    'bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] shadow-card',
  glass: 'glass',
  'gold-border':
    'bg-[var(--luma-bg-elevated)] border border-[rgba(214,181,109,0.3)] hover:border-[rgba(214,181,109,0.6)] transition-colors'
};

const PADDINGS = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7'
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-2xl',
          VARIANTS[variant],
          PADDINGS[padding],
          className
        ].join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';