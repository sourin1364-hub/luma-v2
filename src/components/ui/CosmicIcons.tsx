import { getAssetUrl } from '../../utils/assetPath';

/**
 * آیکون‌های SVG اختصاصی برای ۸ فاز ماه
 */
export function MoonPhaseSvg({
  phaseIndex,
  className = 'w-14 h-14',
}: {
  phaseIndex: number;
  className?: string;
}) {
  const idx = ((phaseIndex % 8) + 8) % 8;

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lumaMoonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0.9" />
        </radialGradient>
        <linearGradient id="lumaDarkSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      <circle cx="32" cy="32" r="29" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="32" cy="32" r="24" fill="url(#lumaDarkSide)" stroke="#D4AF37" strokeWidth="1.8" />

      {idx === 0 && (
        <circle cx="32" cy="32" r="23" fill="none" stroke="#F59E0B" strokeOpacity="0.4" strokeWidth="1" />
      )}
      {idx === 1 && (
        <path d="M32 8 A24 24 0 0 1 32 56 A14 24 0 0 0 32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
      {idx === 2 && (
        <path d="M32 8 A24 24 0 0 1 32 56 L32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
      {idx === 3 && (
        <path d="M32 8 A24 24 0 0 1 32 56 A14 24 0 0 1 32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
      {idx === 4 && (
        <>
          <circle cx="32" cy="32" r="23.5" fill="url(#lumaMoonGlow)" />
          <circle cx="24" cy="24" r="3.5" fill="#B45309" fillOpacity="0.25" />
          <circle cx="40" cy="36" r="5" fill="#B45309" fillOpacity="0.2" />
          <circle cx="26" cy="40" r="2.5" fill="#B45309" fillOpacity="0.2" />
        </>
      )}
      {idx === 5 && (
        <path d="M32 8 A24 24 0 0 0 32 56 A14 24 0 0 0 32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
      {idx === 6 && (
        <path d="M32 8 A24 24 0 0 0 32 56 L32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
      {idx === 7 && (
        <path d="M32 8 A24 24 0 0 0 32 56 A14 24 0 0 1 32 8 Z" fill="url(#lumaMoonGlow)" />
      )}
    </svg>
  );
}

/**
 * آیکون‌های PNG/SVG باکیفیت برای ۱۲ حیوان زودیاک چینی
 */
export function ChineseAnimalSvg({
  animal,
  className = 'w-20 h-20',
}: {
  animal: string;
  className?: string;
}) {
  const key = (animal || 'dragon').toLowerCase();
  const pngUrl = getAssetUrl(`icons/chinese/${key}.png`);
  const svgUrl = getAssetUrl(`icons/chinese/${key}.svg`);

  return (
    <img
      src={pngUrl}
      alt={animal}
      className={`${className} object-contain drop-shadow-lg select-none`}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (img.src !== svgUrl) {
          img.src = svgUrl;
        }
      }}
    />
  );
}

/**
 * آیکون‌های وکتور ۴ عنصر طبیعت
 */
export function ElementSvg({
  element,
  className = 'w-5 h-5',
}: {
  element: 'fire' | 'water' | 'air' | 'earth' | string;
  className?: string;
}) {
  const el = (element || '').toLowerCase();
  if (el === 'fire') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#EF4444" strokeWidth="2">
        <path
          d="M12 2c1.5 3.5 4 5.5 4 9a4 4 0 1 1-8 0c0-2 1-3.5 2-5-.5 2 1 3 2 3s1-2 0-7z"
          fill="#EF4444"
          fillOpacity="0.25"
        />
      </svg>
    );
  }
  if (el === 'water') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#3B82F6" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#3B82F6" fillOpacity="0.25" />
      </svg>
    );
  }
  if (el === 'air') {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path
        d="M12 22v-9m0 0C12 8 16 4 21 4c0 5-4 9-9 9zm0 0C12 8 8 4 3 4c0 5 4 9 9 9z"
        fill="#10B981"
        fillOpacity="0.2"
      />
    </svg>
  );
}
