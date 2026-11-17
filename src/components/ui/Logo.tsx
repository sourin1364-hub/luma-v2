import { getAssetUrl } from '../../utils/assetPath';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function Logo({ className = '', size = 'md', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}>
      {/* هاله نور طلایی پشت لوگو */}
      {animated && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 to-yellow-300/20 blur-md animate-pulse" />
      )}
      
      {/* لوگوی اختصاصی لومرا با فیلتر درخشش طلایی */}
      <img
        src={getAssetUrl('icons/luma-logo.png')}
        alt="LUMA Cosmic Logo"
        className={`w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)] ${
          animated ? 'hover:scale-105 transition-transform duration-300' : ''
        }`}
        onError={(e) => {
          // در صورت لود نشدن تصویر موقتاً SVG پیش‌فرض لود شود
          (e.target as HTMLImageElement).src = getAssetUrl('favicon.svg');
        }}
      />
    </div>
  );
}