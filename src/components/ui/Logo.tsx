interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl'
};

const SUBTITLE_SIZES = {
  sm: 'text-[8px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base'
};

export function Logo({ size = 'md', showSubtitle = true, className = '' }: LogoProps) {
  return (
    <div className={'flex flex-col items-center ' + className}>
      <h1
        className={
          'font-display font-bold tracking-[0.2em] gold-gradient ' +
          SIZES[size]
        }
      >
        LUMA
      </h1>
      {showSubtitle && (
        <span
          className={
            'mt-1 tracking-[0.4em] text-[var(--luma-text-muted)] ' +
            SUBTITLE_SIZES[size]
          }
        >
          لوما
        </span>
      )}
    </div>
  );
}