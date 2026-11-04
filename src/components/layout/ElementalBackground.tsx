import { useState, useEffect, useRef } from 'react';
import { Flame, Droplets, Wind, Sprout, Sparkles, Volume2, VolumeX, Sun, Moon, Eye, EyeOff, Sliders } from 'lucide-react';
import { ambientMusic, MUSIC_TRACKS, type MusicTrackId } from '../../utils/ambientMusic';

export type ElementTheme = 'cosmic' | 'fire' | 'water' | 'air' | 'earth';

const THEME_STORAGE_KEY = 'luma_element_theme';
const LIGHT_MODE_KEY = 'luma_light_mode';
const ANIM_ENABLED_KEY = 'luma_bg_anim_enabled';

export function ElementalBackground() {
  const [elementTheme, setElementTheme] = useState<ElementTheme>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ElementTheme) || 'cosmic';
  });
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem(LIGHT_MODE_KEY) === 'true';
  });
  const [animEnabled, setAnimEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(ANIM_ENABLED_KEY);
    return saved === null ? true : saved === 'true';
  });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrackId>('cosmos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, elementTheme);
    localStorage.setItem(LIGHT_MODE_KEY, String(isLightMode));
    localStorage.setItem(ANIM_ENABLED_KEY, String(animEnabled));

    const root = document.documentElement;
    const accentMap: Record<ElementTheme, { primary: string; glow: string }> = {
      cosmic: { primary: isLightMode ? '#B45309' : '#D4AF37', glow: 'rgba(212, 175, 55, 0.22)' },
      fire: { primary: isLightMode ? '#DC2626' : '#F97316', glow: 'rgba(249, 115, 22, 0.22)' },
      water: { primary: isLightMode ? '#0284C7' : '#38BDF8', glow: 'rgba(56, 189, 248, 0.22)' },
      air: { primary: isLightMode ? '#4F46E5' : '#A78BFA', glow: 'rgba(167, 139, 250, 0.22)' },
      earth: { primary: isLightMode ? '#059669' : '#10B981', glow: 'rgba(16, 185, 129, 0.22)' },
    };

    const currentAccent = accentMap[elementTheme];

    if (isLightMode) {
      root.style.setProperty('--luma-bg', '#F8FAFC');
      root.style.setProperty('--luma-bg-elevated', '#FFFFFF');
      root.style.setProperty('--luma-bg-subtle', '#E2E8F0');
      root.style.setProperty('--luma-bg-card', '#FFFFFF');
      root.style.setProperty('--luma-text', '#0F172A');
      root.style.setProperty('--luma-text-muted', '#1E293B');
      root.style.setProperty('--luma-text-subtle', '#334155');
      root.style.setProperty('--luma-border', '#CBD5E1');
      root.style.setProperty('--luma-gold', currentAccent.primary);
      root.style.setProperty('--luma-gold-light', currentAccent.primary);
      root.style.setProperty('--luma-gold-glow', currentAccent.glow);
    } else {
      const darkBgMap: Record<ElementTheme, string> = {
        cosmic: '#0B0D1A',
        fire: '#180909',
        water: '#061426',
        air: '#0E1029',
        earth: '#071912',
      };
      const darkElevatedMap: Record<ElementTheme, string> = {
        cosmic: '#13172B',
        fire: '#261111',
        water: '#0D223A',
        air: '#181B3D',
        earth: '#0E281E',
      };

      root.style.setProperty('--luma-bg', darkBgMap[elementTheme]);
      root.style.setProperty('--luma-bg-elevated', darkElevatedMap[elementTheme]);
      root.style.setProperty('--luma-bg-subtle', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--luma-bg-card', darkElevatedMap[elementTheme]);
      root.style.setProperty('--luma-text', '#F8FAFC');
      root.style.setProperty('--luma-text-muted', '#CBD5E1');
      root.style.setProperty('--luma-text-subtle', '#94A3B8');
      root.style.setProperty('--luma-border', 'rgba(255, 255, 255, 0.14)');
      root.style.setProperty('--luma-gold', currentAccent.primary);
      root.style.setProperty('--luma-gold-light', '#FDE68A');
      root.style.setProperty('--luma-gold-glow', currentAccent.glow);
    }
  }, [elementTheme, isLightMode, animEnabled]);

  useEffect(() => {
    const handler = (e: CustomEvent<ElementTheme>) => {
      if (e.detail) setElementTheme(e.detail);
    };
    window.addEventListener('luma:set-element-theme' as any, handler as any);
    return () => window.removeEventListener('luma:set-element-theme' as any, handler as any);
  }, []);

  // موتور گرافیکی 60 فریم بر ثانیه واقعی برای حرکت زنده عناصر
  useEffect(() => {
    if (!animEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ذرات برای آتش، آب، باد، خاک و کیهان
    const particles = Array.from({ length: 55 }).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 2 + Math.random() * 5,
      speedY: 0.8 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 1.4,
      phase: i * 0.4,
      growHeight: 40 + Math.random() * 90,
      currentGrow: Math.random() * 40,
    }));

    const clouds = Array.from({ length: 7 }).map((_, i) => ({
      x: (i * window.innerWidth) / 5,
      y: 60 + (i * 95) % (window.innerHeight - 160),
      w: 140 + (i % 3) * 60,
      h: 46 + (i % 2) * 20,
      speed: 0.45 + (i % 3) * 0.35,
    }));

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (elementTheme === 'water') {
        // ۳ لایه موج سینوسی متحرک دریا + حباب‌های بالارونده
        for (let layer = 0; layer < 3; layer++) {
          ctx.beginPath();
          ctx.moveTo(0, h);
          const waveBaseY = h - 140 + layer * 35;
          for (let x = 0; x <= w; x += 15) {
            const y =
              waveBaseY +
              Math.sin(x * 0.008 + time * (1.2 + layer * 0.4) + layer) * (18 + layer * 6) +
              Math.cos(x * 0.004 - time * 0.8) * 10;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fillStyle =
            layer === 0
              ? 'rgba(2, 132, 199, 0.18)'
              : layer === 1
              ? 'rgba(14, 165, 233, 0.22)'
              : 'rgba(56, 189, 248, 0.26)';
          ctx.fill();
        }

        particles.slice(0, 28).forEach((p) => {
          p.y -= p.speedY * 0.7;
          p.x += Math.sin(time + p.phase) * 0.5;
          if (p.y < h * 0.3) {
            p.y = h;
            p.x = Math.random() * w;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(125, 211, 252, 0.35)';
          ctx.fill();
        });
      } else if (elementTheme === 'fire') {
        // هاله شعله در پایین + زبانه کشیدن شعله‌ها و اخگرها به بالا
        const grad = ctx.createLinearGradient(0, h, 0, h - 260);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.28)');
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.12)');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h - 260, w, 260);

        particles.forEach((p) => {
          p.y -= p.speedY * 1.6;
          p.x += Math.sin(time * 2 + p.phase) * 1.2;
          if (p.y < h * 0.15) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          const lifeRatio = Math.max(0, (p.y - h * 0.15) / (h * 0.85));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.5 + lifeRatio), 0, Math.PI * 2);
          ctx.fillStyle =
            lifeRatio > 0.6
              ? 'rgba(253, 224, 71, 0.55)'
              : lifeRatio > 0.3
              ? 'rgba(249, 115, 22, 0.45)'
              : 'rgba(239, 68, 68, 0.25)';
          ctx.fill();
        });
      } else if (elementTheme === 'air') {
        // حرکت پیوسته ابرها و خطوط جریان باد در آسمان
        clouds.forEach((c) => {
          c.x += c.speed;
          if (c.x - c.w > w) {
            c.x = -c.w;
          }
          ctx.save();
          ctx.fillStyle = isLightMode ? 'rgba(99, 102, 241, 0.14)' : 'rgba(167, 139, 250, 0.14)';
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
          ctx.ellipse(c.x - c.w * 0.25, c.y + 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
          ctx.ellipse(c.x + c.w * 0.25, c.y + 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // خطوط نرم نسیم
        for (let i = 0; i < 6; i++) {
          const streamY = ((i * 130 + time * 20) % h);
          const streamX = ((time * 90 + i * 220) % (w + 300)) - 150;
          ctx.beginPath();
          ctx.moveTo(streamX, streamY);
          ctx.quadraticCurveTo(streamX + 60, streamY - 15, streamX + 120, streamY);
          ctx.strokeStyle = 'rgba(196, 181, 253, 0.22)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (elementTheme === 'earth') {
        // زمین خاکی که با روییدن چمن‌های متحرک سبز می‌شود
        ctx.fillStyle = 'rgba(120, 53, 15, 0.24)';
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.quadraticCurveTo(w * 0.3, h - 55, w * 0.6, h - 35);
        ctx.quadraticCurveTo(w * 0.85, h - 20, w, h - 45);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        const bladeCount = 65;
        for (let i = 0; i < bladeCount; i++) {
          const bx = (i / bladeCount) * w + 6;
          const p = particles[i % particles.length];
          p.currentGrow = Math.min(p.growHeight, p.currentGrow + 0.18);
          if (p.currentGrow >= p.growHeight && Math.random() < 0.002) {
            p.currentGrow = 15;
          }
          const sway = Math.sin(time * 1.8 + i * 0.5) * 12;
          ctx.beginPath();
          ctx.moveTo(bx, h - 18);
          ctx.quadraticCurveTo(
            bx + sway * 0.5,
            h - 18 - p.currentGrow * 0.5,
            bx + sway,
            h - 18 - p.currentGrow
          );
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(52, 211, 153, 0.38)';
          ctx.lineWidth = 2.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      } else {
        // تم کیهانی اصلی: درخشش و حرکت آرام ستارگان طلایی
        particles.slice(0, 35).forEach((p, idx) => {
          const alpha = 0.2 + Math.abs(Math.sin(time * 0.9 + idx)) * 0.55;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (idx % 3) + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [elementTheme, animEnabled, isLightMode]);

  const handleToggleMusic = () => {
    const playing = ambientMusic.toggle(selectedTrack);
    setIsPlayingMusic(playing);
  };

  const handleChangeTrack = (trackId: MusicTrackId) => {
    setSelectedTrack(trackId);
    ambientMusic.start(trackId);
    setIsPlayingMusic(true);
  };

  return (
    <>
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[var(--luma-bg)]/85 border-b border-[var(--luma-border)] px-3 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ' +
                (isPlayingMusic
                  ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold shadow-sm'
                  : 'bg-[var(--luma-bg-elevated)] text-[var(--luma-text)] border-[var(--luma-border)]')
              }
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isPlayingMusic ? 'موسیقی فعال' : 'موسیقی آرامش'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLightMode((prev) => !prev)}
              className="p-1.5 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
              title={isLightMode ? 'تغییر به تم شب' : 'تغییر به تم روز'}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </button>

            <button
              type="button"
              onClick={() => setAnimEnabled((prev) => !prev)}
              className="p-1.5 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
              title={animEnabled ? 'غیرفعال کردن انیمیشن پس‌زمینه' : 'فعال کردن انیمیشن پس‌زمینه'}
            >
              {animEnabled ? <Eye className="w-3.5 h-3.5 text-[var(--luma-gold)]" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
          >
            <Sliders className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
            <span>تم عنصر و آهنگ</span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="max-w-md mx-auto mt-2 p-3 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 shadow-xl space-y-3">
            <div>
              <p className="text-[11px] font-bold text-[var(--luma-text)] mb-1.5">
                انتخاب تم و انیمیشن زنده عنصر:
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'cosmic', label: 'اصلی لوما', Icon: Sparkles },
                  { id: 'fire', label: 'آتش', Icon: Flame },
                  { id: 'water', label: 'آب', Icon: Droplets },
                  { id: 'air', label: 'باد', Icon: Wind },
                  { id: 'earth', label: 'خاک', Icon: Sprout },
                ].map((item) => {
                  const Icon = item.Icon;
                  const active = elementTheme === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setElementTheme(item.id as ElementTheme)}
                      className={
                        'flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[10px] transition-all ' +
                        (active
                          ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold'
                          : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text)] border-[var(--luma-border)]')
                      }
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-[var(--luma-text)] mb-1.5">
                انتخاب موسیقی آرامش‌بخش پس‌زمینه:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {MUSIC_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleChangeTrack(track.id)}
                    className={
                      'flex items-center justify-between px-3 py-2 rounded-xl border text-right text-xs transition-all ' +
                      (selectedTrack === track.id && isPlayingMusic
                        ? 'bg-[var(--luma-gold)]/20 border-[var(--luma-gold)] text-[var(--luma-text)] font-bold'
                        : 'bg-[var(--luma-bg-subtle)] border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                    }
                  >
                    <span>{track.nameFa}</span>
                    <span className="text-[10px] text-[var(--luma-gold)]">
                      {selectedTrack === track.id && isPlayingMusic ? 'در حال پخش ♪' : 'پخش'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {animEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-0"
        />
      )}
    </>
  );
}
