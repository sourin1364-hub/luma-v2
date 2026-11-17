import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SubscriptionScreen } from '../subscription/SubscriptionScreen';
import { SubscriptionStatusNotice } from '../subscription/SubscriptionBadge';
import { ElementSvg } from '../../components/ui/CosmicIcons';
import {
  Sparkles,
  Gem,
  Hash,
  Star,
  Calendar,
  BookMarked,
  Lock,
  X,
  Plus,
  Trash2,
  Loader2,
  Activity,
  CloudMoon,
  Hexagon,
  ArrowRight,
  Eye,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscription } from '../../hooks/useSubscription';
import { getBirthProfile, getProfile } from '../profile/profileService';
import type { BirthProfile } from '../profile/types';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { jalaaliToGregorian } from '../../engines/calendar/jalaali';
import { formatJalaaliDate } from '../../engines/calendar/format';
import { getZodiacFromBirthDate, getBirthstoneFromBirthDate } from '../../engines/zodiac';
import { calculateAbjad, calculateLifePath, getNumberMeaning } from '../../engines/numerology';
import { MAJOR_ARCANA, ALL_TAROT_CARDS } from '../../engines/tarot';
import {
  COMPREHENSIVE_DREAMS,
  ELDER_FUTHARK_RUNES,
  DREAM_CATEGORY_LABELS,
  type DreamCategoryKey,
} from '../../engines/dreamsAndRunes';
import { generateSmartAiResponse, type AiChatMessage } from '../../engines/ai/lumaAiEngine';
import { exportAndShareReadingImage } from '../../utils/shareAsImage';
import { getAssetUrl } from '../../utils/assetPath';
import type { TabId } from '../../components/layout/BottomNav';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';
import { getLocalizedCardName, getLocalizedCardMeaning } from '../tarot/tarotI18nResolver';
import { formatNum } from '../../i18n/format';
import { createPortal } from 'react-dom';

interface MyCosmicProfileScreenProps {
  onNavigate?: (tab: TabId) => void;
}

const SIGN_ELEMENT: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

const ZODIAC_RULER: Record<string, string> = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon', leo: 'sun', virgo: 'mercury', libra: 'venus', scorpio: 'pluto', sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'uranus', pisces: 'neptune'
};

function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

interface JournalNote {
  id: string;
  title: string;
  category: 'tarot' | 'astrology' | 'dream' | 'daily';
  content: string;
  createdAt: string;
}

const JOURNAL_STORAGE_KEY = 'luma_my_journal_notes';

function loadJournalNotes(): JournalNote[] {
  try {
    const raw = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveJournalNotes(notes: JournalNote[]) {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export function MyCosmicProfileScreen({ onNavigate }: MyCosmicProfileScreenProps) {
  const lang = useLanguageStore((s) => s.lang);
  const kurdishCalendar = useLanguageStore((s) => s.kurdishCalendar) as
    | 'shamsi'
    | 'miladi'
    | undefined;
  const t = UI_TRANSLATIONS[lang];

  const user = useAuthStore((s) => s.user);
  const sub = useSubscription();

  const [birth, setBirth] = useState<BirthProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDailyCardDetailView, setShowDailyCardDetailView] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const [dreamQuery, setDreamQuery] = useState('');
  const [dreamCategory, setDreamCategory] = useState<DreamCategoryKey | 'all'>('all');
  const [drawnRuneIndex, setDrawnRuneIndex] = useState<number>(0);

  // استیت‌های چت‌بات تعاملی هوش مصنوعی
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([]);

  // استیت‌های جامعه کاربری و ساخت گروه
  const [groups, setGroups] = useState<{ id: string; name: string; members: number; joined: boolean }[]>(() => {
    try {
      const raw = localStorage.getItem('luma_community_groups');
      return raw
        ? JSON.parse(raw)
        : [
            { id: 'g1', name: 'tarot_lovers', members: 1240, joined: true },
            { id: 'g2', name: 'astro_watchers', members: 980, joined: false },
            { id: 'g3', name: 'dream_circle', members: 815, joined: false },
          ];
    } catch {
      return [];
    }
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [communityPosts, setCommunityPosts] = useState<{ id: string; author: string; text: string; likes: number }[]>(() => {
    try {
      const raw = localStorage.getItem('luma_community_posts');
      return raw
        ? JSON.parse(raw)
        : [
            { id: 'p1', author: 'post_1_author', text: 'post_1_text', likes: 18 },
            { id: 'p2', author: 'post_2_author', text: 'post_2_text', likes: 11 },
          ];
    } catch {
      return [];
    }
  });
  const [newPostText, setNewPostText] = useState('');

  const [notes, setNotes] = useState<JournalNote[]>(() => loadJournalNotes());
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<JournalNote['category']>('daily');

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const [p, b] = await Promise.all([getProfile(user.id), getBirthProfile(user.id)]);
        setDisplayName(p?.displayName || user.displayName || user.username);
        if (b) {
          setBirth(b);
        } else {
          setBirth({
            year: 1364,
            month: 4,
            day: 1,
            birthTime: '04:30',
            birthCity: 'تهران',
            birthCityEn: 'Tehran',
            birthProvince: 'تهران',
            latitude: 35.6892,
            longitude: 51.389,
            timezone: 'Asia/Tehran',
            motherName: '',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const cosmicData = useMemo(() => {
    if (!birth) return null;
    const [hour, minute] = (birth.birthTime || '04:30').split(':').map(Number);
    const utc = birthToUtc(
      { year: birth.year, month: birth.month, day: birth.day },
      hour || 4,
      minute || 30,
      birth.timezone || 'Asia/Tehran'
    );
    const natalChart = calculateNatalChart(utc, birth.latitude || 35.6892, birth.longitude || 51.389);
    const gBirth = jalaaliToGregorian({ year: birth.year, month: birth.month, day: birth.day });

    const sunPlanet = natalChart.planets.find((p) => p.planet === 'sun');
    const moonPlanet = natalChart.planets.find((p) => p.planet === 'moon');
    const ascendantSign = natalChart.houses?.[0]?.sign || sunPlanet?.sign || 'aries';

    const sunKey = (sunPlanet?.sign || 'aries').toLowerCase();
    const moonKey = (moonPlanet?.sign || 'cancer').toLowerCase();
    const ascKey = String(ascendantSign).toLowerCase();

    const zodiac = getZodiacFromBirthDate({ year: birth.year, month: birth.month, day: birth.day });
    const birthstone = getBirthstoneFromBirthDate({ year: birth.year, month: birth.month, day: birth.day });

    const lifePath = calculateLifePath(gBirth.year, gBirth.month, gBirth.day);
    const lifePathMeaning = getNumberMeaning(lifePath.reduced);
    const nameAbjad = calculateAbjad(displayName || t['common_user_fallback']);

    const sumDigits = (n: number): number =>
      String(n)
        .split('')
        .reduce((acc, d) => acc + Number(d), 0);
    let tarotBirthNum = sumDigits(gBirth.year) + sumDigits(gBirth.month) + sumDigits(gBirth.day);
    while (tarotBirthNum > 21) {
      tarotBirthNum = sumDigits(tarotBirthNum);
    }
    const birthTarotCard = MAJOR_ARCANA[tarotBirthNum % MAJOR_ARCANA.length] || MAJOR_ARCANA[0];

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const uniqueSeedString = `${user?.id || 'luma-guest'}-${user?.email || ''}-${todayKey}`;
    const hashVal = hashString(uniqueSeedString);
    const dailyTarotCard = ALL_TAROT_CARDS[hashVal % ALL_TAROT_CARDS.length] || MAJOR_ARCANA[0];

    const todayChart = calculateNatalChart(today, birth.latitude || 35.6892, birth.longitude || 51.389);
    const todayMoon = todayChart.planets.find((p) => p.planet === 'moon');

    const personalDayNumber = ((hashVal + lifePath.reduced) % 9) + 1;
    const dailyColor = t[`daily_color_${hashVal % 7}` as TranslationKey] || t['daily_color_0'];

    const rulingPlanet = t[`chart_planet_${ZODIAC_RULER[sunKey] || 'sun'}` as TranslationKey];

    const luckyNumbers = [
      lifePath.reduced,
      nameAbjad.reduced,
      (lifePath.reduced + personalDayNumber) % 9 || 9,
      ((birth.day + birth.month) % 22) + 1,
    ];

    return {
      sunKey,
      moonKey,
      ascKey,
      sunElement: (SIGN_ELEMENT[sunKey] || 'fire') as 'fire' | 'earth' | 'air' | 'water',
      moonElement: (SIGN_ELEMENT[moonKey] || 'water') as 'fire' | 'earth' | 'air' | 'water',
      ascElement: (SIGN_ELEMENT[ascKey] || 'air') as 'fire' | 'earth' | 'air' | 'water',
      rulingPlanet,
      zodiac,
      birthstone,
      lifePath,
      lifePathMeaning,
      nameAbjad,
      birthTarotCard,
      dailyTarotCard,
      personalDayNumber,
      dailyColor,
      luckyNumbers,
      todayMoon,
    };
  }, [birth, displayName, user?.id, user?.email, t]);

  const handleApplyMyElementTheme = () => {
    if (!cosmicData) return;
    window.dispatchEvent(new CustomEvent('luma:set-element-theme', { detail: cosmicData.sunElement }));
  };

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const newNote: JournalNote = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      category: noteCategory,
      content: noteContent.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveJournalNotes(updated);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveJournalNotes(updated);
  };

  if (showSubscription) {
    return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
  }

  if (isLoading || !cosmicData || !birth) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin" />
      </div>
    );
  }

  const sunSignFa = t[`chart_zodiac_${cosmicData.sunKey}` as TranslationKey] || t['chart_zodiac_aries'];
  const moonSignFa = t[`chart_zodiac_${cosmicData.moonKey}` as TranslationKey] || t['chart_zodiac_cancer'];
  const ascSignFa = t[`chart_zodiac_${cosmicData.ascKey}` as TranslationKey] || sunSignFa;

  const sunDetail = {
    identity: t[`sun_detail_${cosmicData.sunKey}_identity` as TranslationKey] || '',
    strengths: t[`sun_detail_${cosmicData.sunKey}_strengths` as TranslationKey] || '',
    challenges: t[`sun_detail_${cosmicData.sunKey}_challenges` as TranslationKey] || '',
    career: t[`sun_detail_${cosmicData.sunKey}_career` as TranslationKey] || '',
  };
  const moonDetail = {
    emotions: t[`moon_detail_${cosmicData.moonKey}_emotions` as TranslationKey] || '',
    attachment: t[`moon_detail_${cosmicData.moonKey}_attachment` as TranslationKey] || '',
    comfort: t[`moon_detail_${cosmicData.moonKey}_comfort` as TranslationKey] || '',
  };
  const ascDetail = {
    persona: t[`asc_detail_${cosmicData.ascKey}_persona` as TranslationKey] || '',
    approach: t[`asc_detail_${cosmicData.ascKey}_approach` as TranslationKey] || '',
    energy: t[`asc_detail_${cosmicData.ascKey}_energy` as TranslationKey] || '',
  };

  const currentRune = ELDER_FUTHARK_RUNES[drawnRuneIndex] || ELDER_FUTHARK_RUNES[0];
  const dailyTarotCardName = getLocalizedCardName(cosmicData.dailyTarotCard, lang);

  const handleSendAiQuestion = async () => {
    if (!aiInput.trim() || isAiTyping) return;
    const q = aiInput.trim();
    setAiInput('');
    const userMsg: AiChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: q,
      createdAt: new Date().toISOString(),
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);
    try {
      const reply = await generateSmartAiResponse(q, {
        displayName: displayName || t['common_user_fallback'],
        sunSignFa,
        moonSignFa,
        ascSignFa,
        elementFa: t[`chart_el_${cosmicData.sunElement}` as TranslationKey],
        lifePathNumber: cosmicData.lifePath.reduced,
        rulingPlanet: cosmicData.rulingPlanet,
      }, lang, aiMessages
        .filter((message) => message.sender === 'user' || message.sender === 'ai')
        .slice(-8)
        .map((message) => ({
          role: message.sender === 'ai' ? 'assistant' as const : 'user' as const,
          content: message.text,
        })));
      setAiMessages((prev) => [...prev, reply]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const GRID_ITEMS = [
    {
      id: 'daily-guidance',
      title: t['cosmic_profile_grid_daily_title'],
      subtitle: t['cosmic_profile_grid_daily_sub'].replace('{0}', formatNum(cosmicData.personalDayNumber, lang)).replace('{1}', cosmicData.dailyColor),
      Icon: Sparkles,
      locked: false,
    },
    {
      id: 'ai-chatbot',
      title: t['cosmic_profile_grid_ai_title'],
      subtitle: t['cosmic_profile_grid_ai_sub'],
      Icon: Sparkles,
      locked: false,
    },
    {
      id: 'weekly-forecast',
      title: t['cosmic_profile_grid_weekly_title'],
      subtitle: t['cosmic_profile_grid_weekly_sub'],
      Icon: Calendar,
      locked: !sub.isPremium,
      tierLabel: t['cosmic_profile_tier_premium'],
    },
    {
      id: 'monthly-forecast',
      title: t['cosmic_profile_grid_monthly_title'],
      subtitle: t['cosmic_profile_grid_monthly_sub'],
      Icon: Star,
      locked: !sub.isPremium,
      tierLabel: t['cosmic_profile_tier_premium'],
    },
    {
      id: 'birthstone',
      title: t['cosmic_profile_grid_stone_title'],
      subtitle: t[`bs_${birth.month}_name` as TranslationKey],
      Icon: Gem,
      locked: false,
    },
    {
      id: 'personal-numbers',
      title: t['cosmic_profile_grid_numbers_title'],
      subtitle: t['cosmic_profile_grid_numbers_sub'].replace('{0}', formatNum(cosmicData.lifePath.reduced, lang)),
      Icon: Hash,
      locked: false,
    },
    {
      id: 'birth-tarot',
      title: t['cosmic_profile_grid_birth_tarot_title'],
      subtitle: getLocalizedCardName(cosmicData.birthTarotCard, lang),
      Icon: Star,
      locked: false,
    },
    {
      id: 'chakras',
      title: t['cosmic_profile_grid_chakra_title'],
      subtitle: t['cosmic_profile_grid_chakra_sub'].replace('{0}', t[`chart_el_${cosmicData.sunElement}` as TranslationKey]),
      Icon: Activity,
      locked: false,
    },
    {
      id: 'dreams',
      title: t['cosmic_profile_grid_dreams_title'],
      subtitle: t['cosmic_profile_grid_dreams_sub'].replace('{0}', formatNum(COMPREHENSIVE_DREAMS.length, lang)),
      Icon: CloudMoon,
      locked: false,
    },
    {
      id: 'runes',
      title: t['cosmic_profile_grid_runes_title'],
      subtitle: t['cosmic_profile_grid_runes_sub'],
      Icon: Hexagon,
      locked: false,
    },
    {
      id: 'community-hub',
      title: t['cosmic_profile_grid_comm_title'],
      subtitle: t['cosmic_profile_grid_comm_sub'],
      Icon: Star,
      locked: false,
    },
    {
      id: 'articles-meditation',
      title: t['cosmic_profile_grid_art_title'],
      subtitle: t['cosmic_profile_grid_art_sub'],
      Icon: Activity,
      locked: false,
    },
    {
      id: 'my-journal',
      title: t['cosmic_profile_grid_journal_title'],
      subtitle: t['cosmic_profile_grid_journal_sub'].replace('{0}', formatNum(notes.length, lang)),
      Icon: BookMarked,
      locked: false,
    },
  ];

  const modalTitles: Record<string, string> = {
    'sun-modal': t['cosmic_profile_modal_sun_title'].replace('{0}', sunSignFa),
    'moon-modal': t['cosmic_profile_modal_moon_title'].replace('{0}', moonSignFa),
    'ascendant-modal': t['cosmic_profile_modal_asc_title'].replace('{0}', ascSignFa),
  };

  const CHAKRAS_DATA = Array.from({ length: 7 }).map((_, i) => ({
    name: t[`chakra_${i}_name` as TranslationKey],
    color: ['#EF4444', '#F97316', '#EAB308', '#10B981', '#0EA5E9', '#6366F1', '#A855F7'][i],
    stone: t[`chakra_${i}_stone` as TranslationKey],
    focus: t[`chakra_${i}_focus` as TranslationKey],
  }));

  const DREAM_CATEGORIES: { id: DreamCategoryKey | 'all'; label: string }[] = [
    { id: 'all', label: t['dream_cat_all'] },
    { id: 'nature', label: DREAM_CATEGORY_LABELS.nature[lang] },
    { id: 'animals', label: DREAM_CATEGORY_LABELS.animals[lang] },
    { id: 'flight', label: DREAM_CATEGORY_LABELS.flight[lang] },
    { id: 'objects', label: DREAM_CATEGORY_LABELS.objects[lang] },
    { id: 'human', label: DREAM_CATEGORY_LABELS.human[lang] },
    { id: 'colors', label: DREAM_CATEGORY_LABELS.colors[lang] },
  ];

  return (
    <div className="space-y-5 pb-24">
      <SubscriptionStatusNotice error={sub.error} />
      <PageHeader
        title={t['cosmic_profile_title']}
                subtitle={`${displayName} • ${formatJalaaliDate({ year: birth.year, month: birth.month, day: birth.day }, { lang, kurdishCalendar })} • ${lang === 'en' ? (birth.birthCityEn || birth.birthCity) : birth.birthCity}`}
        action={
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={handleApplyMyElementTheme}>
              <ElementSvg element={cosmicData.sunElement} className="w-4 h-4" />
              {t['cosmic_profile_theme']} {t[`chart_el_${cosmicData.sunElement}` as TranslationKey]}
            </Button>
            {onNavigate && (
              <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
                {t['cosmic_profile_edit_birth']}
              </Button>
            )}
          </div>
        }
      />

      {/* سه کارت اصلی */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('sun-modal')}
        >
          <img src={getAssetUrl('icons/ui/sun.png')} alt={t['profile_sun_sign']} className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">{t['profile_sun_sign']}</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{sunSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">{t['cosmic_profile_view_core']}</p>
        </Card>

        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('moon-modal')}
        >
          <img src={getAssetUrl('icons/ui/moon.png')} alt={t['cosmic_profile_moon_sign']} className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_moon_sign']}</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{moonSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">{t['cosmic_profile_analyze_emotions']}</p>
        </Card>

        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('ascendant-modal')}
        >
          <img src={getAssetUrl('icons/ui/ascendant.png')} alt={t['cosmic_profile_ascendant']} className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_ascendant']}</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{ascSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">{t['cosmic_profile_outer_persona']}</p>
        </Card>
      </div>

      {/* کارت راهنمای روزانه اختصاصی لوما */}
      <Card variant="elevated" padding="md" className="border-[var(--luma-gold)]/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="font-heading text-sm text-[var(--luma-gold)]">{t['cosmic_profile_daily_guide_title']}</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)] font-bold">
            {t['cosmic_profile_today_card']} {dailyTarotCardName}
          </span>
        </div>

        <div className="flex gap-3.5 items-center mb-3">
          <button
            type="button"
            onClick={() => {
              setShowDailyCardDetailView(true);
              setActiveModal('daily-guidance');
            }}
            className="w-20 h-32 rounded-xl overflow-hidden border-2 border-[var(--luma-gold)] shadow-lg flex-shrink-0 group relative"
          >
            <img
              src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
              alt={dailyTarotCardName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
              }}
            />
          </button>

          <p className="text-xs text-[var(--luma-text)] leading-relaxed text-justify">
            {lang === 'en' ? (
              <>
                With the Moon in {cosmicData.todayMoon ? t[`chart_zodiac_${cosmicData.todayMoon.sign.toLowerCase()}` as TranslationKey] : moonSignFa} and the energy of "{dailyTarotCardName}", today is a day to focus on {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)}. Your harmonic color today is <span className="text-[var(--luma-gold)] font-bold">{cosmicData.dailyColor}</span>.
              </>
            ) : lang === 'ar' ? (
              <>
                مع وجود القمر في برج {cosmicData.todayMoon ? t[`chart_zodiac_${cosmicData.todayMoon.sign.toLowerCase()}` as TranslationKey] : moonSignFa} وتأثير بطاقة «{dailyTarotCardName}»، اليوم هو يوم التركيز على {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)}. لونك المتناغم اليوم هو <span className="text-[var(--luma-gold)] font-bold">{cosmicData.dailyColor}</span>.
              </>
            ) : lang === 'ckb' ? (
              <>
                بە بوونی مانگ لە بورجی {cosmicData.todayMoon ? t[`chart_zodiac_${cosmicData.todayMoon.sign.toLowerCase()}` as TranslationKey] : moonSignFa} و لەرینەوەی کارتی «{dailyTarotCardName}»، ئەمڕۆ ڕۆژی تەرکیزە لەسەر {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)}. ڕەنگی هاوئاهەنگی ئەمڕۆت <span className="text-[var(--luma-gold)] font-bold">{cosmicData.dailyColor}</span>ە.
              </>
            ) : (
              <>
                با قرارگیری ماه در برج {cosmicData.todayMoon ? t[`chart_zodiac_${cosmicData.todayMoon.sign.toLowerCase()}` as TranslationKey] : moonSignFa} و ارتعاش کارت «{dailyTarotCardName}»، امروز برای شما روز تمرکز بر {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)} است. رنگ هم‌ارتعاش امروز شما <span className="text-[var(--luma-gold)] font-bold">{cosmicData.dailyColor}</span> است.
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setShowDailyCardDetailView(false);
              setActiveModal('daily-guidance');
            }}
          >
            {t['cosmic_profile_view_daily_report']}
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() =>
              exportAndShareReadingImage({
                lang,
                title: `${t['cosmic_profile_daily_guide_title']} — ${displayName}`,
                subtitle: `${sunSignFa} • ${t['cosmic_profile_theme']}: ${cosmicData.dailyColor}`,
                cardNames: [dailyTarotCardName],
                summaryText: getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang),
                adviceText: `${t['cosmic_profile_num_lucky']} ${formatNum(cosmicData.personalDayNumber, lang)}`,
              })
            }
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {t['cosmic_profile_export_story']}
          </Button>
        </div>
      </Card>

      {/* شبکه ابزارها */}
      <div className="grid grid-cols-2 gap-3">
        {GRID_ITEMS.map((item) => {
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.locked) {
                  setShowSubscription(true);
                } else {
                  setShowDailyCardDetailView(false);
                  setActiveModal(item.id);
                }
              }}
              className="text-right p-4 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all relative"
            >
              {item.locked && (
                <span className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-[9px] text-amber-500 font-bold">
                  <Lock className="w-3 h-3" />
                  {item.tierLabel}
                </span>
              )}
              <Icon className="w-6 h-6 text-[var(--luma-gold)] mb-2" />
              <h4 className="font-heading text-xs text-[var(--luma-text)] font-bold mb-1">
                {item.title}
              </h4>
              <p className="text-[10px] text-[var(--luma-text-muted)] truncate">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* پنجره‌های جزئیات */}
      {activeModal && (
        createPortal(<div className="modal-backdrop bg-black/75 backdrop-blur-sm">
          <div
            className="modal-panel w-full max-w-md bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 rounded-2xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--luma-border)] pb-3">
              <h3 className="font-heading text-base text-[var(--luma-gold)]">
                {modalTitles[activeModal] ||
                  GRID_ITEMS.find((g) => g.id === activeModal)?.title ||
                  t['cosmic_profile_modal_details']}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === 'sun-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/sun.png')} alt={t['profile_sun_sign']} className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_ruling_planet']}</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{cosmicData.rulingPlanet}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_element']}</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{t[`chart_el_${cosmicData.sunElement}` as TranslationKey]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_sun_identity']}</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.identity}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">{t['cosmic_profile_sun_strengths']}</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.strengths}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-amber-500 font-bold mb-1">{t['cosmic_profile_sun_challenges']}</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.challenges}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-sky-500 font-bold mb-1">{t['cosmic_profile_sun_career']}</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.career}</p>
                </Card>
              </div>
            )}

            {activeModal === 'moon-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/moon.png')} alt={t['cosmic_profile_moon_sign']} className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_moon_place']}</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{moonSignFa}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_moon_element']}</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{t[`chart_el_${cosmicData.moonElement}` as TranslationKey]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_moon_emotions']}</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.emotions}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-rose-500 font-bold mb-1">{t['cosmic_profile_moon_attachment']}</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.attachment}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">{t['cosmic_profile_moon_comfort']}</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.comfort}</p>
                </Card>
              </div>
            )}

            {activeModal === 'ascendant-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/ascendant.png')} alt={t['cosmic_profile_ascendant']} className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_asc_place']}</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{ascSignFa}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_asc_element']}</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{t[`chart_el_${cosmicData.ascElement}` as TranslationKey]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_asc_persona']}</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.persona}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">{t['cosmic_profile_asc_approach']}</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.approach}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-sky-500 font-bold mb-1">{t['cosmic_profile_asc_energy']}</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.energy}</p>
                </Card>
              </div>
            )}

            {activeModal === 'daily-guidance' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                {showDailyCardDetailView ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-36 h-56 rounded-2xl overflow-hidden border-2 border-[var(--luma-gold)] shadow-2xl mb-3">
                        <img
                          src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
                          alt={dailyTarotCardName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
                          }}
                        />
                      </div>
                      <h4 className="font-heading text-lg text-[var(--luma-gold)] font-bold">
                        {dailyTarotCardName}
                      </h4>
                    </div>

                    <Card variant="elevated" padding="sm">
                      <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_daily_interpretation']}</p>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                        {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)}
                      </p>
                    </Card>

                    <Button variant="gold" fullWidth onClick={() => setShowDailyCardDetailView(false)}>
                      <ArrowRight className="w-4 h-4" />
                      {t['cosmic_profile_daily_back']}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Card variant="gold-border" padding="sm">
                      <div className="flex gap-3 items-start">
                        <img
                          src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
                          alt={dailyTarotCardName}
                          onClick={() => setShowDailyCardDetailView(true)}
                          className="w-20 h-32 rounded-xl object-cover border border-[var(--luma-gold)] cursor-pointer flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                          <p className="text-[var(--luma-gold)] font-bold">
                            {t['cosmic_profile_today_card']} ({dailyTarotCardName}):
                          </p>
                          <p className="text-[var(--luma-text)] line-clamp-3">
                            {getLocalizedCardMeaning(cosmicData.dailyTarotCard, false, lang)}
                          </p>
                          <Button variant="gold" size="sm" fullWidth onClick={() => setShowDailyCardDetailView(true)}>
                            <Eye className="w-3.5 h-3.5" />
                            {t['cosmic_profile_view_daily_report']}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card variant="elevated" padding="sm">
                      <div className="flex items-start gap-3">
                        <img src={getAssetUrl('icons/ui/love.png')} alt={t['cosmic_profile_daily_love']} className="w-11 h-11 rounded-xl flex-shrink-0" />
                        <div>
                          <p className="text-rose-500 font-bold mb-1">{t['cosmic_profile_daily_love']}</p>
                          <p className="text-[var(--luma-text)]">
                            {t['cosmic_profile_daily_love_desc'].replace('{0}', moonSignFa)}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card variant="elevated" padding="sm">
                      <div className="flex items-start gap-3">
                        <img src={getAssetUrl('icons/ui/career.png')} alt={t['cosmic_profile_daily_career']} className="w-11 h-11 rounded-xl flex-shrink-0" />
                        <div>
                          <p className="text-emerald-500 font-bold mb-1">{t['cosmic_profile_daily_career']}</p>
                          <p className="text-[var(--luma-text)]">
                            {t['cosmic_profile_daily_career_desc'].replace('{0}', formatNum(cosmicData.personalDayNumber, lang))}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            )}

            {activeModal === 'ai-chatbot' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="gold-border" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">
                    {t['cosmic_profile_ai_title']}
                  </p>
                  <p className="text-[var(--luma-text-muted)] text-[11px]">
                    {t['cosmic_profile_ai_desc'].replace('{0}', sunSignFa).replace('{1}', moonSignFa)}
                  </p>
                </Card>

                <div className="max-h-72 overflow-y-auto space-y-2.5 p-2 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  {aiMessages.length === 0 ? (
                    <p className="text-center text-[var(--luma-text-muted)] py-6">
                      {t['cosmic_profile_ai_empty']}
                    </p>
                  ) : (
                    aiMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={
                          'p-3 rounded-xl ' +
                          (msg.sender === 'user'
                            ? 'bg-[var(--luma-gold)]/20 border border-[var(--luma-gold)]/40 mr-6'
                            : 'bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] ml-2')
                        }
                      >
                        {msg.sentiment && (
                          <div className="mb-1.5 flex items-center justify-between">
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                              style={{ backgroundColor: `${msg.sentiment.color}22`, color: msg.sentiment.color }}
                            >
                              {t['cosmic_profile_ai_sentiment']} {msg.sentiment.labelFa}
                            </span>
                            {msg.drawnCard && (
                              <span className="text-[10px] text-[var(--luma-gold)] font-bold">
                                {t['cosmic_profile_ai_card']} {getLocalizedCardName(msg.drawnCard, lang)}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="whitespace-pre-line text-[var(--luma-text)] leading-relaxed">
                          {msg.text}
                        </p>
                      </div>
                    ))
                  )}
                  {isAiTyping && (
                    <div className="flex items-center gap-2 text-[var(--luma-gold)] p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t['cosmic_profile_ai_typing']}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendAiQuestion();
                    }}
                    placeholder={t['cosmic_profile_ai_ph']}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <Button variant="gold" size="sm" disabled={isAiTyping || !aiInput.trim()} onClick={handleSendAiQuestion}>
                    {t['cosmic_profile_ai_send']}
                  </Button>
                </div>
              </div>
            )}

            {activeModal === 'community-hub' && (
              <div className="space-y-4 text-xs leading-relaxed">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <Card variant="gold-border" padding="sm">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_comm_xp']}</p>
                    <p className="text-lg font-bold text-[var(--luma-gold)] mt-0.5">
                      {formatNum(1450 + notes.length * 50 + communityPosts.length * 30, lang)} XP
                    </p>
                  </Card>
                  <Card variant="gold-border" padding="sm">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_comm_groups']}</p>
                    <p className="text-lg font-bold text-emerald-500 mt-0.5">
                      {formatNum(groups.filter((g) => g.joined).length, lang)} {t['cosmic_profile_comm_group_unit']}
                    </p>
                  </Card>
                </div>

                <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] space-y-2">
                  <p className="font-bold text-[var(--luma-gold)]">{t['cosmic_profile_comm_new_group']}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder={t['cosmic_profile_comm_group_ph']}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                    />
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => {
                        if (!newGroupName.trim()) return;
                        const updated = [
                          { id: 'g-' + Date.now(), name: newGroupName.trim(), members: 1, joined: true },
                          ...groups,
                        ];
                        setGroups(updated);
                        localStorage.setItem('luma_community_groups', JSON.stringify(updated));
                        setNewGroupName('');
                      }}
                    >
                      {t['cosmic_profile_comm_create']}
                    </Button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                    {groups.map((grp) => (
                      <div
                        key={grp.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]"
                      >
                        <div>
                          <p className="font-bold text-[var(--luma-text)]">
                            {grp.name === 'tarot_lovers' ? t['comm_group_1'] : grp.name === 'astro_watchers' ? t['comm_group_2'] : grp.name === 'dream_circle' ? t['comm_group_3'] : grp.name}
                          </p>
                          <p className="text-[10px] text-[var(--luma-text-muted)]">{formatNum(grp.members, lang)} {t['cosmic_profile_comm_member']}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = groups.map((item) =>
                              item.id === grp.id
                                ? { ...item, joined: !item.joined, members: item.joined ? item.members - 1 : item.members + 1 }
                                : item
                            );
                            setGroups(updated);
                            localStorage.setItem('luma_community_groups', JSON.stringify(updated));
                          }}
                          className={
                            'px-2.5 py-1 rounded-full text-[10px] font-bold ' +
                            (grp.joined
                              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                              : 'bg-[var(--luma-gold)] text-white')
                          }
                        >
                          {grp.joined ? t['cosmic_profile_comm_joined'] : t['cosmic_profile_comm_join']}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] space-y-2">
                  <p className="font-bold text-[var(--luma-gold)]">{t['cosmic_profile_comm_share']}</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder={t['cosmic_profile_comm_post_ph']}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (!newPostText.trim()) return;
                        const updated = [
                          {
                            id: 'p-' + Date.now(),
                            author: `${displayName || 'User'} (${sunSignFa})`,
                            text: newPostText.trim(),
                            likes: 1,
                          },
                          ...communityPosts,
                        ];
                        setCommunityPosts(updated);
                        localStorage.setItem('luma_community_posts', JSON.stringify(updated));
                        setNewPostText('');
                      }}
                    >
                      {t['cosmic_profile_comm_publish']}
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                    {communityPosts.map((post) => (
                      <Card key={post.id} variant="elevated" padding="sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[var(--luma-gold)] text-[11px]">
                            {post.author === 'post_1_author' ? t['comm_post_1_author'] : post.author === 'post_2_author' ? t['comm_post_2_author'] : post.author}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = communityPosts.map((p) =>
                                p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                              );
                              setCommunityPosts(updated);
                              localStorage.setItem('luma_community_posts', JSON.stringify(updated));
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500"
                          >
                            ❤️ {formatNum(post.likes, lang)}
                          </button>
                        </div>
                        <p className="text-[var(--luma-text)] text-justify">
                          {post.text === 'post_1_text' ? t['comm_post_1_text'] : post.text === 'post_2_text' ? t['comm_post_2_text'] : post.text}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'articles-meditation' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="gold-border" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_art_q']}</p>
                  <p className="text-[var(--luma-text)] mb-1">
                    <b>{t['cosmic_profile_art_q']}</b> {t['cosmic_profile_art_q_text'].replace('{0}', dailyTarotCardName)}
                  </p>
                  <p className="text-[11px] text-[var(--luma-text-muted)]">
                    {t['cosmic_profile_art_q_desc']}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="font-bold text-emerald-500 mb-1">{t['cosmic_profile_art_1_title']}</p>
                  <p className="text-[var(--luma-text)]">{t['cosmic_profile_art_1_body']}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="font-bold text-sky-500 mb-1">{t['cosmic_profile_art_2_title']}</p>
                  <p className="text-[var(--luma-text)]">{t['cosmic_profile_art_2_body']}</p>
                </Card>
              </div>
            )}

            {activeModal === 'weekly-forecast' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_week_1']}</p>
                  <p className="text-[var(--luma-text)]">
                    {t['cosmic_profile_week_1_body'].replace('{0}', t[`chart_el_${cosmicData.sunElement}` as TranslationKey])}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_week_2']}</p>
                  <p className="text-[var(--luma-text)]">
                    {t['cosmic_profile_week_2_body'].replace('{0}', moonSignFa)}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_week_3']}</p>
                  <p className="text-[var(--luma-text)]">{t['cosmic_profile_week_3_body']}</p>
                </Card>
              </div>
            )}

            {activeModal === 'monthly-forecast' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_month_1']}</p>
                  <p className="text-[var(--luma-text)]">
                    {t['cosmic_profile_month_1_body'].replace('{0}', cosmicData.rulingPlanet)}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_month_2']}</p>
                  <p className="text-[var(--luma-text)]">{t['cosmic_profile_month_2_body']}</p>
                </Card>
              </div>
            )}

            {activeModal === 'birthstone' && cosmicData.birthstone && (
              <div className="space-y-3 text-xs leading-relaxed text-center">
                <img
                  src={getAssetUrl(`icons/birthstones/${cosmicData.birthstone.nameEn.toLowerCase()}.png`)}
                  alt={t[`bs_${birth.month}_name` as TranslationKey]}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[var(--luma-gold)]"
                />
                <h4 className="font-heading text-base text-[var(--luma-gold)]">
                  {t[`bs_${birth.month}_name` as TranslationKey]} ({cosmicData.birthstone.nameEn})
                </h4>
                <p className="text-[var(--luma-text)] text-justify">
                  {t['cosmic_profile_stone_desc'].replace('{0}', t[`chart_el_${cosmicData.sunElement}` as TranslationKey])}
                </p>
              </div>
            )}

            {activeModal === 'personal-numbers' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm" className="text-center">
                  <p className="text-[var(--luma-text-muted)]">{t['cosmic_profile_num_life_path']}</p>
                  <p className="text-3xl font-bold text-[var(--luma-gold)] my-1">
                    {formatNum(cosmicData.lifePath.reduced, lang)}
                  </p>
                  <p className="text-[var(--luma-text)] text-justify">
                    {cosmicData.lifePathMeaning?.meaning}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-2">{t['cosmic_profile_num_lucky']}</p>
                  <div className="flex justify-center gap-3">
                    {cosmicData.luckyNumbers.map((num, idx) => (
                      <span
                        key={idx}
                        className="w-9 h-9 rounded-full bg-[var(--luma-gold-glow)] border border-[var(--luma-gold)] flex items-center justify-center font-bold text-[var(--luma-gold)]"
                      >
                        {formatNum(num, lang)}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeModal === 'birth-tarot' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex gap-4 items-center">
                  <img
                    src={getAssetUrl(`assets/tarot/cards/${cosmicData.birthTarotCard.id}.webp`)}
                    alt={getLocalizedCardName(cosmicData.birthTarotCard, lang)}
                    className="w-24 h-36 rounded-xl object-cover border border-[var(--luma-gold)]/40"
                  />
                  <div>
                    <h4 className="font-heading text-base text-[var(--luma-gold)] mb-1">
                      {getLocalizedCardName(cosmicData.birthTarotCard, lang)}
                    </h4>
                    <p className="text-[11px] text-[var(--luma-text-muted)] mb-2">
                      {t['cosmic_profile_birth_tarot_desc']}
                    </p>
                  </div>
                </div>
                <p className="text-[var(--luma-text)] text-justify">
                  {getLocalizedCardMeaning(cosmicData.birthTarotCard, false, lang)}
                </p>
              </div>
            )}

            {activeModal === 'chakras' && (
              <div className="space-y-2.5 text-xs">
                {CHAKRAS_DATA.map((ch, i) => (
                  <Card key={i} variant="elevated" padding="sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold" style={{ color: ch.color }}>{ch.name}</span>
                      <span className="text-[10px] text-[var(--luma-text-muted)]">{t['cosmic_profile_chakra_stone']} {ch.stone}</span>
                    </div>
                    <p className="text-[var(--luma-text)] leading-relaxed text-justify">{ch.focus}</p>
                  </Card>
                ))}
              </div>
            )}

            {activeModal === 'dreams' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <img src={getAssetUrl('icons/ui/dream.png')} alt={t['cosmic_profile_grid_dreams_title']} className="w-9 h-9" />
                  <div className="relative flex-1">
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--luma-text-muted)]" />
                    <input
                      type="text"
                      value={dreamQuery}
                      onChange={(e) => setDreamQuery(e.target.value)}
                      placeholder={t['cosmic_profile_dream_search_ph']}
                      className="w-full pr-8 pl-3 py-2 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {DREAM_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDreamCategory(cat.id)}
                      className={
                        'px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap border ' +
                        (dreamCategory === cat.id
                          ? 'bg-[var(--luma-gold)] text-white border-[var(--luma-gold)] font-bold'
                          : 'border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                      }
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {COMPREHENSIVE_DREAMS.filter((d) => {
                    const matchCat = dreamCategory === 'all' || d.category === dreamCategory;
                    const q = dreamQuery.trim();
                    const matchQ =
                      !q ||
                      d.symbol[lang].includes(q) ||
                      d.meaning[lang].includes(q) ||
                      d.advice[lang].includes(q);
                    return matchCat && matchQ;
                  }).map((d, i) => (
                    <Card key={i} variant="elevated" padding="sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--luma-gold)]">{d.symbol[lang]}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                          {DREAM_CATEGORY_LABELS[d.category][lang]}
                        </span>
                      </div>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify mb-1.5">{d.meaning[lang]}</p>
                      <p className="text-[10px] text-emerald-500 text-justify">{t['cosmic_profile_dream_advice']} {d.advice[lang]}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'runes' && (
              <div className="space-y-4 text-xs text-center">
                <div className="flex flex-col items-center">
                  <img
                    src={getAssetUrl(`icons/runes/rune-${currentRune.index}.png`)}
                    alt={currentRune.name[lang]}
                    className="w-28 h-36 object-contain mx-auto mb-2 drop-shadow-xl"
                  />
                  <h4 className="font-heading text-base text-[var(--luma-gold)] font-bold">
                    {currentRune.name[lang]} ({currentRune.nameEn})
                  </h4>
                </div>
                <Card variant="elevated" padding="sm" className="text-right">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">{t['cosmic_profile_rune_meaning']}</p>
                  <p className="text-[var(--luma-text)] leading-relaxed text-justify">{currentRune.meaning[lang]}</p>
                </Card>
                <Button
                  variant="gold"
                  size="sm"
                  fullWidth
                  onClick={() => setDrawnRuneIndex(Math.floor(Math.random() * ELDER_FUTHARK_RUNES.length))}
                >
                  {t['cosmic_profile_rune_draw']}
                </Button>
              </div>
            )}

            {activeModal === 'my-journal' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2 p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder={t['cosmic_profile_journal_title_ph']}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <div className="flex gap-1.5">
                    {[
                      { id: 'daily', label: t['cosmic_profile_journal_cat_daily'] },
                      { id: 'tarot', label: t['cosmic_profile_journal_cat_tarot'] },
                      { id: 'astrology', label: t['cosmic_profile_journal_cat_astro'] },
                      { id: 'dream', label: t['cosmic_profile_journal_cat_dream'] },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNoteCategory(cat.id as any)}
                        className={
                          'px-2.5 py-1 rounded-full text-[10px] border ' +
                          (noteCategory === cat.id
                            ? 'bg-[var(--luma-gold)] text-white border-[var(--luma-gold)] font-bold'
                            : 'border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                        }
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={3}
                    placeholder={t['cosmic_profile_journal_content_ph']}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <Button variant="gold" size="sm" fullWidth onClick={handleAddNote}>
                    <Plus className="w-3.5 h-3.5" />
                    {t['cosmic_profile_journal_save']}
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notes.map((n) => (
                    <Card key={n.id} variant="elevated" padding="sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--luma-gold)]">{n.title}</span>
                        <button type="button" onClick={() => handleDeleteNote(n.id)} className="text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify">{n.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Button variant="secondary" fullWidth onClick={() => setActiveModal(null)}>
              {t['cosmic_profile_modal_close']}
            </Button>
          </div>
        </div>, document.body)
      )}
    </div>
  );
}