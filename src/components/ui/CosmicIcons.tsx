/**
 * آیکون‌های SVG اختصاصی برای ۸ فاز ماه (بدون استفاده از ایموجی)
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
 * آیکون‌های وکتور SVG برای ۱۲ حیوان زودیاک چینی (جایگزین ایموجی)
 */
export function ChineseAnimalSvg({
  animal,
  className = 'w-16 h-16',
}: {
  animal: string;
  className?: string;
}) {
  const key = (animal || '').toLowerCase();
  const titles: Record<string, string> = {
    rat: 'موش',
    ox: 'گاو',
    tiger: 'ببر',
    rabbit: 'خرگوش',
    dragon: 'اژدها',
    snake: 'مار',
    horse: 'اسب',
    goat: 'بز',
    monkey: 'میمون',
    rooster: 'خروس',
    dog: 'سگ',
    pig: 'خوک',
  };

  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chineseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill="#0F172A" stroke="url(#chineseGoldGrad)" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="31" stroke="#D4AF37" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 2" />
      <polygon points="40,8 43,14 40,12 37,14" fill="url(#chineseGoldGrad)" />
      <polygon points="40,72 43,66 40,68 37,66" fill="url(#chineseGoldGrad)" />

      {key === 'dragon' && (
        <path
          d="M24 50 C20 36, 30 22, 44 24 C54 25, 58 34, 50 40 C42 46, 34 42, 36 52 C38 58, 50 56, 56 48"
          stroke="url(#chineseGoldGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}
      {key === 'tiger' && (
        <g stroke="url(#chineseGoldGrad)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M24 28 L30 22 L34 28 M56 28 L50 22 L46 28" />
          <circle cx="40" cy="42" r="14" />
          <path d="M33 36 L37 36 M43 36 L47 36 M36 47 Q40 51 44 47" />
        </g>
      )}
      {key === 'rabbit' && (
        <g stroke="url(#chineseGoldGrad)" strokeWidth="2.5" strokeLinecap="round">
          <path d="M34 34 C31 20, 36 18, 38 32 M46 34 C49 20, 44 18, 42 32" />
          <circle cx="40" cy="45" r="11" />
          <circle cx="37" cy="43" r="1.5" fill="#FDE68A" />
          <circle cx="43" cy="43" r="1.5" fill="#FDE68A" />
        </g>
      )}
      {key === 'snake' && (
        <path
          d="M28 54 C24 44, 48 44, 44 34 C40 24, 30 28, 38 22 L44 20"
          stroke="url(#chineseGoldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {key === 'horse' && (
        <path
          d="M28 54 L32 34 L28 28 L38 22 L44 26 L42 36 L52 44 L48 54"
          stroke="url(#chineseGoldGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {key === 'ox' && (
        <g stroke="url(#chineseGoldGrad)" strokeWidth="2.6" strokeLinecap="round">
          <path d="M22 26 C22 36, 30 36, 32 34 M58 26 C58 36, 50 36, 48 34" />
          <rect x="29" y="32" width="22" height="20" rx="8" />
        </g>
      )}
      {!['dragon', 'tiger', 'rabbit', 'snake', 'horse', 'ox'].includes(key) && (
        <g stroke="url(#chineseGoldGrad)" strokeWidth="2.4">
          <polygon
            points="40,20 45,33 59,33 48,41 52,55 40,47 28,55 32,41 21,33 35,33"
            fill="#D4AF37"
            fillOpacity="0.18"
          />
        </g>
      )}

      <text x="40" y="64" textAnchor="middle" fill="#FDE68A" fontSize="9" fontWeight="bold">
        {titles[key] || animal}
      </text>
    </svg>
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
