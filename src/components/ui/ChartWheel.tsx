import type { NatalChart, PlanetPosition, HouseCusp } from '../../engines/astronomy/types';
import { PLANET_NAMES_FA } from '../../engines/astronomy/constants';

interface ChartWheelProps {
  chart: NatalChart;
  size?: number;
}

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#D6B56D',
  opposition: '#EF4444',
  trine: '#10B981',
  square: '#F59E0B',
  sextile: '#3B82F6'
};

// تبدیل درجه (0-360) به مختصات SVG (0 درجه در بالا، ساعتگرد)
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

export function ChartWheel({ chart, size = 340 }: ChartWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const signR = outerR - 18;
  const houseR = signR - 22;
  const planetR = houseR - 25;
  const centerR = 30;

  // ASC به‌عنوان نقطه شروع (سمت چپ، ۹ ساعت)
  const ascLongitude = chart.ascendant.longitude;

  // تبدیل longitude به زاویه SVG (ASC در 180 درجه = سمت چپ)
  const toSvgAngle = (longitude: number) => {
    return (longitude - ascLongitude + 180 + 360) % 360;
  };

  // رسم خطوط خانه‌ها
  const houseLines = chart.houses.map((h: HouseCusp) => {
    const angle = toSvgAngle(h.longitude);
    const inner = polarToCartesian(cx, cy, centerR, angle);
    const outer = polarToCartesian(cx, cy, houseR, angle);
    return (
      <line
        key={`house-line-${h.house}`}
        x1={inner.x} y1={inner.y}
        x2={outer.x} y2={outer.y}
        stroke="rgba(214,181,109,0.25)"
        strokeWidth={1}
      />
    );
  });

  // شماره خانه‌ها
  const houseNumbers = chart.houses.map((h: HouseCusp) => {
    const angle = toSvgAngle(h.longitude) + 15;
    const pos = polarToCartesian(cx, cy, houseR - 8, angle);
    return (
      <text
        key={`house-num-${h.house}`}
        x={pos.x} y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(214,181,109,0.5)"
        fontSize={9}
        fontFamily="Vazirmatn"
      >
        {h.house}
      </text>
    );
  });

  // نمادهای برج‌ها
  const signSymbols = SIGN_SYMBOLS.map((symbol, idx) => {
    const angle = (idx * 30 + 15);
    const pos = polarToCartesian(cx, cy, signR, angle);
    return (
      <text
        key={`sign-${idx}`}
        x={pos.x} y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#D6B56D"
        fontSize={18}
      >
        {symbol}
      </text>
    );
  });

  // خطوط جنبه‌ها
  const aspectLines = chart.aspects.slice(0, 20).map((aspect, idx) => {
    const p1 = chart.planets.find((p: PlanetPosition) => p.planet === aspect.planet1);
    const p2 = chart.planets.find((p: PlanetPosition) => p.planet === aspect.planet2);
    if (!p1 || !p2) return null;

    const angle1 = toSvgAngle(p1.longitude);
    const angle2 = toSvgAngle(p2.longitude);
    const pos1 = polarToCartesian(cx, cy, planetR - 5, angle1);
    const pos2 = polarToCartesian(cx, cy, planetR - 5, angle2);

    return (
      <line
        key={`aspect-${idx}`}
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke={ASPECT_COLORS[aspect.type] || '#888'}
        strokeWidth={aspect.type === 'conjunction' ? 1.5 : 0.8}
        opacity={0.35}
      />
    );
  });

  // سیارات
  const planets = chart.planets.map((p: PlanetPosition) => {
    const angle = toSvgAngle(p.longitude);
    const pos = polarToCartesian(cx, cy, planetR, angle);
    return (
      <g key={`planet-${p.planet}`}>
        <circle
          cx={pos.x} cy={pos.y} r={9}
          fill="rgba(11,13,26,0.9)"
          stroke="#D6B56D"
          strokeWidth={1}
        />
        <text
          x={pos.x} y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D6B56D"
          fontSize={11}
        >
          {PLANET_SYMBOLS[p.planet]}
        </text>
      </g>
    );
  });

  // ASC و MC
  const ascPos = polarToCartesian(cx, cy, outerR - 4, 180);
  const ascTextPos = polarToCartesian(cx, cy, outerR + 0, 180);

  // دایره میانی (مرکز)
  const centerElements = (
    <>
      <circle cx={cx} cy={cy} r={centerR} fill="rgba(214,181,109,0.05)" stroke="rgba(214,181,109,0.3)" strokeWidth={1} />
      <text
        x={cx} y={cy - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#D6B56D"
        fontSize={11}
        fontFamily="Cormorant Garamond, serif"
        fontWeight="bold"
      >
        LUMA
      </text>
      <text
        x={cx} y={cy + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="rgba(214,181,109,0.6)"
        fontSize={8}
        fontFamily="Vazirmatn"
      >
        {chart.ascendant.signDegree.toFixed(0)}°
      </text>
    </>
  );

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* دایره بیرونی */}
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(214,181,109,0.3)" strokeWidth={1.5} />
        <circle cx={cx} cy={cy} r={signR} fill="none" stroke="rgba(214,181,109,0.15)" strokeWidth={0.8} />
        <circle cx={cx} cy={cy} r={houseR} fill="none" stroke="rgba(214,181,109,0.2)" strokeWidth={1} />
        <circle cx={cx} cy={cy} r={planetR + 15} fill="none" stroke="rgba(214,181,109,0.1)" strokeWidth={0.5} />

        {/* خطوط برج‌ها */}
        {SIGN_SYMBOLS.map((_, idx) => {
          const angle = idx * 30;
          const inner = polarToCartesian(cx, cy, houseR, angle);
          const outer = polarToCartesian(cx, cy, outerR, angle);
          return (
            <line
              key={`sign-line-${idx}`}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="rgba(214,181,109,0.3)"
              strokeWidth={0.8}
            />
          );
        })}

        {houseLines}
        {aspectLines}
        {signSymbols}
        {houseNumbers}
        {planets}

        {/* ASC Marker */}
        <circle cx={ascPos.x} cy={ascPos.y} r={3} fill="#D6B56D" />
        <text
          x={ascTextPos.x} y={ascTextPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#D6B56D"
          fontSize={7}
          fontFamily="Vazirmatn"
          fontWeight="bold"
        >
          ASC
        </text>

        {centerElements}
      </svg>

      {/* راهنمای سیارات */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs w-full max-w-xs">
        {chart.planets.map((p: PlanetPosition) => (
          <div key={`legend-${p.planet}`} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[var(--luma-text-muted)]">
              <span className="text-[var(--luma-gold)] text-sm">{PLANET_SYMBOLS[p.planet]}</span>
              {PLANET_NAMES_FA[p.planet]}
            </span>
            <span className="text-[var(--luma-text-subtle)] font-mono text-[10px]">
              {p.signDegree.toFixed(0)}° {p.retrograde && '℞'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}