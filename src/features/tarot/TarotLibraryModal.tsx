import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ALL_TAROT_CARDS } from '../../engines/tarot';
import type { TarotCard, Suit } from '../../engines/tarot/types';
import { getAssetUrl } from '../../utils/assetPath';
import {
  Search,
  BookOpen,
  RotateCcw,
  Sparkles,
  X,
  Layers,
  Heart,
  Briefcase,
  Compass,
  Flame,
} from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import { getLocalizedCardName, getLocalizedKeywords, getLocalizedCardMeaning } from './tarotI18nResolver';
import { generateCardDeepAnalysis, type AnalysisCategory } from '../../engines/tarot/interpretation/meaningGenerator';
import { createPortal } from 'react-dom';

interface TarotLibraryModalProps {
  onBack: () => void;
}

export function TarotLibraryModal({ onBack }: TarotLibraryModalProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [tab, setTab] = useState<'cards' | 'combo'>('cards');
  const [search, setSearch] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | Suit>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const [isReversedView, setIsReversedView] = useState(false);
  const [activeAnalysisSection, setActiveAnalysisSection] = useState<AnalysisCategory>('general');

  const [comboCard1, setComboCard1] = useState<string>(ALL_TAROT_CARDS[0].id);
  const [comboCard2, setComboCard2] = useState<string>(ALL_TAROT_CARDS[1].id);

  const SUIT_FILTERS: { id: 'all' | Suit; label: string }[] = [
    { id: 'all', label: t['tarot_lib_filter_all'] },
    { id: 'major', label: t['tarot_lib_filter_major'] },
    { id: 'wands', label: t['tarot_lib_filter_wands'] },
    { id: 'cups', label: t['tarot_lib_filter_cups'] },
    { id: 'swords', label: t['tarot_lib_filter_swords'] },
    { id: 'pentacles', label: t['tarot_lib_filter_pentacles'] },
  ];

  const filteredCards = useMemo(() => {
    return ALL_TAROT_CARDS.filter((c) => {
      if (suitFilter !== 'all' && c.suit !== suitFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();

      const locName = getLocalizedCardName(c, lang).toLowerCase();
      const locKeywords = getLocalizedKeywords(c, lang).map((k) => k.toLowerCase());

      return (
        locName.includes(q) ||
        c.nameFa.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        locKeywords.some((k) => k.includes(q))
      );
    });
  }, [search, suitFilter, lang]);

  const cardA = useMemo(() => ALL_TAROT_CARDS.find((c) => c.id === comboCard1) || ALL_TAROT_CARDS[0], [comboCard1]);
  const cardB = useMemo(() => ALL_TAROT_CARDS.find((c) => c.id === comboCard2) || ALL_TAROT_CARDS[1], [comboCard2]);

  const nameA = getLocalizedCardName(cardA, lang);
  const nameB = getLocalizedCardName(cardB, lang);
  const kwA = getLocalizedKeywords(cardA, lang);
  const kwB = getLocalizedKeywords(cardB, lang);
  const meaningA = getLocalizedCardMeaning(cardA, false, lang);
  const meaningB = getLocalizedCardMeaning(cardB, false, lang);

  const comboTitle = t['tarot_lib_combo_combination'].replace('{0}', nameA).replace('{1}', nameB);
  const loveText = t['tarot_lib_combo_love_desc']
    .replace('{0}', kwA[0] || '')
    .replace('{1}', nameA)
    .replace('{2}', kwB[0] || '')
    .replace('{3}', nameB)
    .replace('{4}', meaningA);
  const careerText = t['tarot_lib_combo_career_desc']
    .replace('{0}', kwA.slice(0, 2).join(' & '))
    .replace('{1}', kwB.slice(0, 2).join(' & '))
    .replace('{2}', meaningB);

  return (
    <div className="space-y-4 pb-24">
      <PageHeader
        title={t['tarot_lib_title']}
        subtitle={t['tarot_lib_subtitle']}
        onBack={onBack}
      />

      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]">
        <button
          type="button"
          onClick={() => setTab('cards')}
          className={
            'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ' +
            (tab === 'cards' ? 'bg-[var(--luma-gold)] text-[#0B0D1A]' : 'text-[var(--luma-text-muted)]')
          }
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t['tarot_lib_tab_cards']}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('combo')}
          className={
            'py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ' +
            (tab === 'combo' ? 'bg-[var(--luma-gold)] text-[#0B0D1A]' : 'text-[var(--luma-text-muted)]')
          }
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t['tarot_lib_tab_combo']}</span>
        </button>
      </div>

      {tab === 'combo' ? (
        <div className="space-y-4">
          <Card variant="elevated" padding="md" className="space-y-3">
            <p className="text-xs text-[var(--luma-text-muted)] text-justify leading-relaxed">
              {t['tarot_lib_combo_desc']}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-[var(--luma-gold)] mb-1">{t['tarot_lib_combo_card1']}</label>
                <select
                  value={comboCard1}
                  onChange={(e) => setComboCard1(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-xs text-[var(--luma-text)]"
                >
                  {ALL_TAROT_CARDS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0F172A] text-white">
                      {getLocalizedCardName(c, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-[var(--luma-gold)] mb-1">{t['tarot_lib_combo_card2']}</label>
                <select
                  value={comboCard2}
                  onChange={(e) => setComboCard2(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-xs text-[var(--luma-text)]"
                >
                  {ALL_TAROT_CARDS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0F172A] text-white">
                      {getLocalizedCardName(c, lang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center gap-4 py-2">
              <div className="text-center">
                <img
                  src={getAssetUrl(`assets/tarot/cards/${cardA.id}.webp`)}
                  alt={nameA}
                  className="w-24 h-36 rounded-xl object-cover border-2 border-[var(--luma-gold)] mx-auto mb-1"
                />
                <span className="text-xs font-bold text-[var(--luma-text)]">{nameA}</span>
              </div>
              <div className="flex items-center text-[var(--luma-gold)] font-bold text-xl">+</div>
              <div className="text-center">
                <img
                  src={getAssetUrl(`assets/tarot/cards/${cardB.id}.webp`)}
                  alt={nameB}
                  className="w-24 h-36 rounded-xl object-cover border-2 border-[var(--luma-gold)] mx-auto mb-1"
                />
                <span className="text-xs font-bold text-[var(--luma-text)]">{nameB}</span>
              </div>
            </div>
          </Card>

          <Card variant="gold-border" padding="md" className="space-y-3 text-xs">
            <h4 className="font-heading text-sm text-[var(--luma-gold)] font-bold">
              {comboTitle}
            </h4>
            <div>
              <p className="font-bold text-rose-400 mb-1">{t['tarot_lib_combo_love']}</p>
              <p className="text-[var(--luma-text)] text-justify leading-relaxed">{loveText}</p>
            </div>
            <div className="pt-2 border-t border-[var(--luma-border)]">
              <p className="font-bold text-emerald-400 mb-1">{t['tarot_lib_combo_career']}</p>
              <p className="text-[var(--luma-text)] text-justify leading-relaxed">{careerText}</p>
            </div>
          </Card>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t['tarot_lib_search_ph']}
              className="w-full pe-10 ps-4 py-2.5 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] text-xs focus:outline-none focus:border-[var(--luma-gold)]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {SUIT_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSuitFilter(f.id)}
                className={
                  'px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap border transition-all ' +
                  (suitFilter === f.id
                    ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold'
                    : 'bg-[var(--luma-bg-elevated)] border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {filteredCards.map((card) => {
              const imgUrl = getAssetUrl(`assets/tarot/cards/${card.id}.webp`);
              const fallbackUrl = getAssetUrl('assets/tarot/cards/back.webp');
              const locName = getLocalizedCardName(card, lang);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    setSelectedCard(card);
                    setIsReversedView(false);
                    setActiveAnalysisSection('general');
                  }}
                  className="text-center p-2 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all group"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-[var(--luma-bg-subtle)]">
                    <img
                      src={imgUrl}
                      alt={locName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackUrl;
                      }}
                    />
                  </div>
                  <p className="font-heading text-xs text-[var(--luma-text)] truncate">{locName}</p>
                  <p className="text-[9px] text-[var(--luma-text-muted)] truncate">{card.nameEn}</p>
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedCard && (
        createPortal(<div
          className="modal-backdrop bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="modal-panel w-full max-w-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-heading text-lg sm:text-xl text-[var(--luma-gold)] font-bold">
                  {getLocalizedCardName(selectedCard, lang)}
                </h3>
                <p className="text-xs text-[var(--luma-text-muted)] tracking-wider">
                  {selectedCard.nameEn} • {selectedCard.suit.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-28 h-44 rounded-2xl overflow-hidden border-2 border-[var(--luma-gold)] shadow-xl transition-transform duration-500 ${
                    isReversedView ? 'rotate-180' : ''
                  }`}
                >
                  <img
                    src={getAssetUrl(`assets/tarot/cards/${selectedCard.id}.webp`)}
                    alt={getLocalizedCardName(selectedCard, lang)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsReversedView(!isReversedView)}
                  className="mt-2 w-full py-1.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[11px] text-[var(--luma-gold)] font-bold flex items-center justify-center gap-1.5 hover:border-[var(--luma-gold)] transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isReversedView ? (lang === 'fa' ? 'حالت مستقیم' : 'Upright') : (lang === 'fa' ? 'حالت معکوس' : 'Reversed')}</span>
                </button>
              </div>

              <div className="flex-1 w-full space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {getLocalizedKeywords(selectedCard, lang).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--luma-gold)]/15 text-[var(--luma-gold)] font-bold border border-[var(--luma-gold)]/30"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[var(--luma-text-muted)]">
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> {lang === 'fa' ? 'عنصر حاکم:' : 'Element:'}</span>
                    <span className="font-bold text-[var(--luma-text)]">{selectedCard.element?.toUpperCase() || 'SPIRIT'}</span>
                  </div>
                  {selectedCard.astrology && (
                    <div className="flex items-center justify-between text-[var(--luma-text-muted)] pt-1 border-t border-white/5">
                      <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-sky-400" /> {lang === 'fa' ? 'همبستگی نجومی:' : 'Astrology:'}</span>
                      <span className="font-bold text-[var(--luma-text)]">{selectedCard.astrology}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setActiveAnalysisSection('general')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition ${
                  activeAnalysisSection === 'general' ? 'bg-[var(--luma-gold)] text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'کلی' : 'General'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisSection('love')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition ${
                  activeAnalysisSection === 'love' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'عاطفی' : 'Love'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisSection('career')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition ${
                  activeAnalysisSection === 'career' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'کاری' : 'Career'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisSection('advice')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition ${
                  activeAnalysisSection === 'advice' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{lang === 'fa' ? 'پند شهودی' : 'Advice'}</span>
              </button>
            </div>

            <Card variant="elevated" padding="md" className="border-[var(--luma-gold)]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--luma-gold)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {isReversedView
                    ? (lang === 'fa' ? 'تحلیل عمیق معکوس (Reversed)' : 'Reversed Deep Guidance')
                    : (lang === 'fa' ? 'تحلیل عمیق مستقیم (Upright)' : 'Upright Deep Guidance')}
                </span>
                <span className="text-[10px] text-[var(--luma-text-muted)] uppercase tracking-wider font-mono">
                  {activeAnalysisSection}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--luma-text)] text-justify leading-relaxed">
                {generateCardDeepAnalysis(selectedCard, isReversedView, activeAnalysisSection, lang as any)}
              </p>
            </Card>

            <Button variant="gold" fullWidth onClick={() => setSelectedCard(null)}>
              {t['tarot_lib_modal_close'] || (lang === 'fa' ? 'بستن پنجره' : 'Close')}
            </Button>
          </div>
        </div>, document.body)
      )}
    </div>
  );
}