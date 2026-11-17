﻿import { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Droplets,
  Wind,
  Sprout,
  Sparkles,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Sliders,
  Globe,
  Download,
  X,
  RefreshCw,
  LockKeyhole,
} from 'lucide-react';
import { ambientMusic, MUSIC_TRACKS, type MusicTrackId } from '../../utils/ambientMusic';
import { useLanguageStore, UI_TRANSLATIONS, type AppLanguage } from '../../i18n/useLanguageStore';
import { useSubscription } from '../../hooks/useSubscription';
import { createPortal } from 'react-dom';

export type ElementTheme = 'cosmic' | 'fire' | 'water' | 'air' | 'earth' | 'amethyst';

const THEME_STORAGE_KEY = 'luma_element_theme';
const LIGHT_MODE_KEY = 'luma_light_mode';
const ANIM_ENABLED_KEY = 'luma_bg_anim_enabled';

export function ElementalBackground() {
  const { lang, setLang, kurdishCalendar, setKurdishCalendar } = useLanguageStore();
  const t = UI_TRANSLATIONS[lang];
  const subscription = useSubscription();

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

  const [pendingLang, setPendingLang] = useState<AppLanguage | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canUsePremiumTheme = !subscription.isLoading &&
    !subscription.error &&
    (subscription.isPremium || subscription.isAdmin);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowIosInstallGuide(true);
    }
  };

  useEffect(() => {
    if (elementTheme === 'amethyst') {
      if (subscription.isLoading) return;
      if (!canUsePremiumTheme) {
        setElementTheme('cosmic');
        return;
      }
    }
    localStorage.setItem(THEME_STORAGE_KEY, elementTheme);
    localStorage.setItem(LIGHT_MODE_KEY, String(isLightMode));
    localStorage.setItem(ANIM_ENABLED_KEY, String(animEnabled));

    const root = document.documentElement;
    const accentMap: Record<ElementTheme, { primary: string; glow: string }> = {
      cosmic: { primary: isLightMode ? '#92400E' : '#D4AF37', glow: isLightMode ? 'rgba(180, 83, 9, 0.16)' : 'rgba(212, 175, 55, 0.22)' },
      fire: { primary: isLightMode ? '#B91C1C' : '#F97316', glow: 'rgba(249, 115, 22, 0.20)' },
      water: { primary: isLightMode ? '#0369A1' : '#38BDF8', glow: 'rgba(56, 189, 248, 0.20)' },
      air: { primary: isLightMode ? '#4338CA' : '#A78BFA', glow: 'rgba(167, 139, 250, 0.20)' },
      earth: { primary: isLightMode ? '#047857' : '#10B981', glow: 'rgba(16, 185, 129, 0.20)' },
      amethyst: { primary: isLightMode ? '#7C3AED' : '#C084FC', glow: 'rgba(192, 132, 252, 0.28)' },
    };

    const currentAccent = accentMap[elementTheme];

    if (isLightMode) {
      root.classList.add('luma-light-mode');
      const lightPalette = elementTheme === 'amethyst'
        ? { bg: '#F5F0FA', elevated: '#FFFCFF', subtle: '#EEE5F6', text: '#241A31', muted: '#594B69', subtleText: '#81758E', border: '#DED2E9' }
        : { bg: '#F5F2EB', elevated: '#FFFFFF', subtle: '#EAE4D7', text: '#0F172A', muted: '#334155', subtleText: '#475569', border: '#D6CFC2' };
      root.style.setProperty('--luma-bg', lightPalette.bg);
      root.style.setProperty('--luma-bg-elevated', lightPalette.elevated);
      root.style.setProperty('--luma-bg-subtle', lightPalette.subtle);
      root.style.setProperty('--luma-bg-card', lightPalette.elevated);
      root.style.setProperty('--luma-text', lightPalette.text);
      root.style.setProperty('--luma-text-muted', lightPalette.muted);
      root.style.setProperty('--luma-text-subtle', lightPalette.subtleText);
      root.style.setProperty('--luma-border', lightPalette.border);
      root.style.setProperty('--luma-gold', currentAccent.primary);
      root.style.setProperty('--luma-gold-light', '#78350F');
      root.style.setProperty('--luma-gold-glow', currentAccent.glow);
    } else {
      root.classList.remove('luma-light-mode');
      const darkBgMap: Record<ElementTheme, string> = {
        cosmic: '#0B0D1A',
        fire: '#180909',
        water: '#061426',
        air: '#0E1029',
        earth: '#071912',
        amethyst: '#10091C',
      };
      const darkElevatedMap: Record<ElementTheme, string> = {
        cosmic: '#13172B',
        fire: '#261111',
        water: '#0D223A',
        air: '#181B3D',
        earth: '#0E281E',
        amethyst: '#21132F',
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
    root.style.setProperty('--luma-accent', elementTheme === 'amethyst' ? '#9D4EDD' : '#6B4A8F');
    root.style.setProperty('--luma-accent-soft', elementTheme === 'amethyst' ? '#C084FC' : '#8B6AAF');
    root.classList.toggle('luma-amethyst', elementTheme === 'amethyst');
  }, [elementTheme, isLightMode, animEnabled, canUsePremiumTheme, subscription.isLoading]);

  useEffect(() => {
    const handler = (e: CustomEvent<ElementTheme>) => {
      if (e.detail) setElementTheme(e.detail);
    };
    window.addEventListener('luma:set-element-theme' as any, handler as any);
    return () => window.removeEventListener('luma:set-element-theme' as any, handler as any);
  }, []);

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
      y: 60 + ((i * 95) % (window.innerHeight - 160)),
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
      } else if (elementTheme === 'fire') {
        const grad = ctx.createLinearGradient(0, h, 0, h - 260);
        grad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.10)');
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
              ? 'rgba(245, 158, 11, 0.50)'
              : lifeRatio > 0.3
              ? 'rgba(249, 115, 22, 0.40)'
              : 'rgba(239, 68, 68, 0.25)';
          ctx.fill();
        });
      } else if (elementTheme === 'air') {
        clouds.forEach((c) => {
          c.x += c.speed;
          if (c.x - c.w > w) c.x = -c.w;
          ctx.save();
          ctx.fillStyle = isLightMode ? 'rgba(79, 70, 229, 0.12)' : 'rgba(167, 139, 250, 0.14)';
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
          ctx.ellipse(c.x - c.w * 0.25, c.y + 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
          ctx.ellipse(c.x + c.w * 0.25, c.y + 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (elementTheme === 'earth') {
        ctx.fillStyle = 'rgba(120, 53, 15, 0.22)';
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
          const sway = Math.sin(time * 1.8 + i * 0.5) * 12;
          ctx.beginPath();
          ctx.moveTo(bx, h - 18);
          ctx.quadraticCurveTo(
            bx + sway * 0.5,
            h - 18 - p.currentGrow * 0.5,
            bx + sway,
            h - 18 - p.currentGrow
          );
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(5, 150, 105, 0.45)' : 'rgba(16, 185, 129, 0.38)';
          ctx.lineWidth = 2.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      } else if (elementTheme === 'amethyst') {
        particles.slice(0, 42).forEach((p, idx) => {
          const alpha = 0.12 + Math.abs(Math.sin(time * 0.7 + idx * 0.35)) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (idx % 3) + 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.fill();
        });
      } else {
        particles.slice(0, 35).forEach((p, idx) => {
          const alpha = 0.2 + Math.abs(Math.sin(time * 0.9 + idx)) * 0.55;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (idx % 3) + 1, 0, Math.PI * 2);
          ctx.fillStyle = isLightMode ? `rgba(180, 83, 9, ${alpha * 0.7})` : `rgba(212, 175, 55, ${alpha})`;
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

  const handleRequestLanguageChange = (newLang: AppLanguage) => {
    if (newLang === lang) return;
    setPendingLang(newLang);
  };

  return (
    <>
      {isLightMode && (
        <style>{`
          .luma-light-mode .from-purple-900\\/40,
          .luma-light-mode .from-amber-900\\/40,
          .luma-light-mode .from-emerald-900\\/40,
          .luma-light-mode .from-rose-900\\/40,
          .luma-light-mode .from-indigo-950\\/70,
          .luma-light-mode .from-indigo-950\\/80 {
            background: linear-gradient(135deg, #FFFFFF 0%, #F3EDE0 100%) !important;
            border-color: #C7B99E !important;
            color: #0F172A !important;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06) !important;
          }
          .luma-light-mode select option {
            background-color: #FFFFFF !important;
            color: #0F172A !important;
          }
        `}</style>
      )}

      <div className="sticky top-0 z-40 backdrop-blur-md bg-[var(--luma-bg)]/90 border-b border-[var(--luma-border)] px-3 py-2">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleMusic}
              className={
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ' +
                (isPlayingMusic
                  ? 'bg-[var(--luma-gold)] text-white border-[var(--luma-gold)] font-bold shadow-sm'
                  : 'bg-[var(--luma-bg-elevated)] text-[var(--luma-text)] border-[var(--luma-border)]')
              }
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isPlayingMusic ? t.music_on : t.music_off}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLightMode((prev) => !prev)}
              className="p-1.5 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
              title={t.settings_light_mode}
              aria-label={t.settings_light_mode}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            </button>

            <button
              type="button"
              onClick={() => setAnimEnabled((prev) => !prev)}
              className="p-1.5 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
              title={t.settings_animation_toggle}
              aria-label={t.settings_animation_toggle}
            >
              {animEnabled ? <Eye className="w-3.5 h-3.5 text-[var(--luma-gold)]" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleInstallPwa}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] bg-[var(--luma-gold)]/15 border border-[var(--luma-gold)]/40 text-[var(--luma-gold)] font-bold hover:bg-[var(--luma-gold)]/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.install_app}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/50 text-[var(--luma-text)] hover:border-[var(--luma-gold)]"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
              <span>{t.theme_btn}</span>
            </button>
          </div>
        </div>

        {/* منوی بازشوی تنظیمات در بالای برنامه */}
        {isMenuOpen && (
          <div className="max-w-md mx-auto mt-2 p-3.5 rounded-2xl bg-[var(--luma-bg-elevated)] border-2 border-[var(--luma-gold)]/50 shadow-2xl space-y-3.5">
            
            {/* بخش انتخاب زبان */}
            <div>
              <p className="text-xs font-bold text-[var(--luma-text)] mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[var(--luma-gold)]" />
                <span>{t.settings_language_title}</span>
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'fa', label: t.settings_language_fa },
                    { id: 'ckb', label: t.settings_language_ckb },
                    { id: 'ar', label: t.settings_language_ar },
                    { id: 'en', label: t.settings_language_en },
                  ] as { id: AppLanguage; label: string }[]
                ).map((lItem) => {
                  const isActive = lang === lItem.id;

                  // 👇 دکمه اختصاصی برای کوردی همراه با سوییچ
                  if (lItem.id === 'ckb') {
                    return (
                      <div
                        key={lItem.id}
                        className={`flex items-center justify-between p-1 rounded-xl text-[11px] font-bold transition-all border ${
                          isActive
                            ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] shadow-sm'
                            : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text)] border-[var(--luma-border)] hover:border-[var(--luma-gold)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleRequestLanguageChange('ckb')}
                          className="flex-1 text-center py-1"
                        >
                          {lItem.label}
                        </button>
                        
                        {/* 👇 dir="ltr" باعث می‌شود سوییچ در حالت راست‌چین هم درست کار کند */}
                        <div className="shrink-0 pl-1.5 pr-1 border-r border-current/20" dir="ltr">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setKurdishCalendar(kurdishCalendar === 'shamsi' ? 'miladi' : 'shamsi');
                            }}
                            className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                              isActive ? 'bg-[#0B0D1A]/30' : 'bg-gray-400/40'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                kurdishCalendar === 'shamsi' ? 'translate-x-[18px]' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // 👇 دکمه‌های عادی برای سایر زبان‌ها
                  return (
                    <button
                      key={lItem.id}
                      type="button"
                      onClick={() => handleRequestLanguageChange(lItem.id)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] shadow-sm'
                          : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text)] border-[var(--luma-border)] hover:border-[var(--luma-gold)]'
                      }`}
                    >
                      {lItem.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* بخش انتخاب تم */}
            <div>
              <p className="text-xs font-bold text-[var(--luma-text)] mb-1.5">
                {t.settings_theme_title}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[
                  { id: 'cosmic', label: t.settings_theme_cosmic, Icon: Sparkles },
                  { id: 'fire', label: t.settings_theme_fire, Icon: Flame },
                  { id: 'water', label: t.settings_theme_water, Icon: Droplets },
                  { id: 'air', label: t.settings_theme_air, Icon: Wind },
                  { id: 'earth', label: t.settings_theme_earth, Icon: Sprout },
                  { id: 'amethyst', label: t.theme_amethyst, Icon: Sparkles, premium: true },
                ].map((item) => {
                  const Icon = item.Icon;
                  const active = elementTheme === item.id;
                  const requiresPremium = 'premium' in item && item.premium;
                  const locked = requiresPremium && !canUsePremiumTheme;
                  const entitlementUnavailable = subscription.isLoading || Boolean(subscription.error);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={
                        locked && entitlementUnavailable
                          ? t.subscription_load_failed
                          : locked
                          ? t.theme_premium_locked
                          : item.label
                      }
                      disabled={Boolean(locked && entitlementUnavailable)}
                      onClick={() => {
                        if (locked) {
                          if (entitlementUnavailable) return;
                          window.dispatchEvent(new Event('luma:open-subscription'));
                          return;
                        }
                        setElementTheme(item.id as ElementTheme);
                      }}
                      className={
                        'flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[10px] transition-all ' +
                        (active
                          ? 'bg-[var(--luma-gold)] text-white border-[var(--luma-gold)] font-bold'
                          : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text)] border-[var(--luma-border)]')
                      }
                    >
                      <span className="relative">
                        <Icon className="w-4 h-4 mb-1" />
                        {locked && <LockKeyhole className="absolute -right-2 -top-1 h-3 w-3 text-[var(--luma-gold)]" />}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* بخش موسیقی */}
            <div>
              <p className="text-xs font-bold text-[var(--luma-text)] mb-1.5">
                {t.settings_music_title}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {MUSIC_TRACKS.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleChangeTrack(track.id)}
                    className={
                      'flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all ' +
                      (selectedTrack === track.id && isPlayingMusic
                        ? 'bg-[var(--luma-gold)]/20 border-[var(--luma-gold)] text-[var(--luma-text)] font-bold'
                        : 'bg-[var(--luma-bg-subtle)] border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                    }
                  >
                    <span>{track.name[lang]}</span>
                    <span className="text-[10px] text-[var(--luma-gold)] font-bold">
                      {selectedTrack === track.id && isPlayingMusic ? t.music_playing : t.music_play}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {pendingLang && (
        createPortal(<div className="modal-backdrop bg-black/80 backdrop-blur-sm">
          <div className="modal-panel w-full max-w-sm bg-[var(--luma-bg-elevated)] border-2 border-[var(--luma-gold)] rounded-2xl p-5 space-y-4 text-center shadow-2xl">
            <RefreshCw className="w-10 h-10 text-[var(--luma-gold)] mx-auto animate-spin" />
            <h4 className="font-heading text-base text-[var(--luma-gold)] font-bold">
              {UI_TRANSLATIONS[pendingLang].lang_confirm_title}
            </h4>
            <p className="text-xs text-[var(--luma-text)] leading-relaxed">
              {UI_TRANSLATIONS[pendingLang].lang_confirm_msg}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setLang(pendingLang);
                  setPendingLang(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[var(--luma-gold)] text-white font-bold text-xs shadow-lg"
              >
                {UI_TRANSLATIONS[pendingLang].lang_confirm_yes}
              </button>
              <button
                type="button"
                onClick={() => setPendingLang(null)}
                className="w-full py-2 rounded-xl bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)] text-xs"
              >
                {UI_TRANSLATIONS[pendingLang].lang_confirm_no}
              </button>
            </div>
          </div>
        </div>, document.body)
      )}

      {showIosInstallGuide && (
        createPortal(<div className="modal-backdrop bg-black/75 backdrop-blur-sm">
          <div className="modal-panel w-full max-w-sm bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/50 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[var(--luma-border)] pb-2">
              <h4 className="font-heading text-sm text-[var(--luma-gold)] font-bold flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>نصب وب‌اپلیکیشن لوما (PWA)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowIosInstallGuide(false)}
                className="p-1 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[var(--luma-text)] leading-relaxed">
              <p className="font-bold text-[var(--luma-gold)]">📱 در گوشی‌های آیفون (iOS Safari):</p>
              <p>۱. روی دکمه <b>Share</b> در نوار پایین مرورگر بزنید.</p>
              <p>۲. گزینه <b>Add to Home Screen</b> را انتخاب کرده و <b>Add</b> را بزنید.</p>
              <hr className="border-[var(--luma-border)] my-2" />
              <p className="font-bold text-[var(--luma-gold)]">🤖 در اندروید و مرورگر Chrome / Edge:</p>
              <p>از منوی سه نقطه بالای مرورگر گزینه <b>Install App</b> یا <b>Add to Home Screen</b> را انتخاب نمایید.</p>
            </div>
          </div>
        </div>, document.body)
      )}

      {animEnabled && (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      )}
    </>
  );
}