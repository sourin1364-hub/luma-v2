import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Download, LibraryBig, Loader2, Search, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';
import {
  listResearchArticles,
  RESEARCH_CATEGORIES,
  type ResearchArticle,
  type ResearchCategory,
} from './researchService';

const CATEGORY_TRANSLATION_KEYS: Record<ResearchCategory | 'all', TranslationKey> = {
  all: 'research_category_all',
  astronomy: 'research_category_astronomy',
  astrology: 'research_category_astrology',
  tarot: 'research_category_tarot',
  psychology: 'research_category_psychology',
  spirituality: 'research_category_spirituality',
  other: 'research_category_other',
};

export default function ResearchScreen() {
  const lang = useLanguageStore((state) => state.lang);
  const t = UI_TRANSLATIONS[lang];
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<ResearchCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    listResearchArticles(lang)
      .then((items) => {
        if (active) {
          setArticles(items);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lang]);

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(lang);
    return articles.filter((article) => {
      const matchesCategory = category === 'all' || article.category === category;
      const matchesSearch = !query
        || article.title.toLocaleLowerCase(lang).includes(query)
        || article.description.toLocaleLowerCase(lang).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [articles, category, lang, search]);

  const categoryLabel = (value: ResearchCategory | 'all') =>
    t[CATEGORY_TRANSLATION_KEYS[value]];

  return (
    <div className="space-y-6 pb-24">
      <PageHeader title={t.research_title} subtitle={t.research_subtitle} />

      <section className="relative isolate overflow-hidden rounded-[1.75rem] border border-[var(--luma-gold)]/20 bg-gradient-to-br from-[var(--luma-bg-elevated)] via-[var(--luma-bg-subtle)] to-[var(--luma-bg-elevated)] px-5 py-6 shadow-xl sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -end-10 -top-14 -z-10 h-48 w-48 rounded-full bg-[var(--luma-gold)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 start-1/3 -z-10 h-40 w-40 rounded-full bg-[var(--luma-accent)]/10 blur-3xl" />
        <div className="flex items-start gap-4">
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--luma-gold)]/30 bg-[var(--luma-gold)]/10 text-[var(--luma-gold)] sm:flex">
            <LibraryBig className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-[var(--luma-gold)]">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-semibold tracking-wide">{t.research_library_eyebrow}</span>
            </div>
            <h1 className="font-heading text-xl font-bold leading-relaxed text-[var(--luma-text)] sm:text-2xl">
              {t.research_library_heading}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--luma-text-muted)]">
              {t.research_library_description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--luma-border)] bg-[var(--luma-bg)]/60 px-3 py-1.5 text-xs text-[var(--luma-text-muted)]">
              <BookOpen className="h-3.5 w-3.5 text-[var(--luma-gold)]" />
              <span>{t.research_library_count.replace('{count}', String(articles.length))}</span>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--luma-gold)]" />
        </div>
      ) : error ? (
        <Card variant="elevated" padding="md">
          <p role="alert" className="text-sm text-rose-400">{t.research_load_error}</p>
        </Card>
      ) : articles.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-[var(--luma-gold)]" />
          <p className="text-sm text-[var(--luma-text-muted)]">{t.research_empty}</p>
        </Card>
      ) : (
        <>
          <section aria-label={t.research_library_filters} className="space-y-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--luma-text-muted)]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.research_library_search}
                className="min-h-12 w-full rounded-2xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] ps-10 pe-4 text-sm text-[var(--luma-text)] outline-none transition focus:border-[var(--luma-gold)]/60 focus:ring-2 focus:ring-[var(--luma-gold)]/10"
              />
            </label>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label={t.research_library_categories}>
              {(['all', ...RESEARCH_CATEGORIES] as const).map((item) => {
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? 'border-[var(--luma-gold)] bg-[var(--luma-gold)] text-[var(--luma-bg)] shadow-md shadow-[var(--luma-gold)]/15'
                        : 'border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] text-[var(--luma-text-muted)] hover:border-[var(--luma-gold)]/40 hover:text-[var(--luma-text)]'
                    }`}
                  >
                    {categoryLabel(item)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[var(--luma-text-muted)]">
              {t.research_library_showing.replace('{shown}', String(visibleArticles.length)).replace('{total}', String(articles.length))}
            </p>
          </section>

          {visibleArticles.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center">
              <Search className="mx-auto mb-3 h-7 w-7 text-[var(--luma-gold)]" />
              <p className="text-sm text-[var(--luma-text-muted)]">{t.research_library_no_results}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visibleArticles.map((article) => (
                <Card
                  key={article.id}
                  variant="elevated"
                  padding="none"
                  className="group overflow-hidden rounded-2xl border-[var(--luma-border)] transition duration-300 hover:-translate-y-1 hover:border-[var(--luma-gold)]/35 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--luma-bg-subtle)]">
                    <img
                      src={article.coverUrl}
                      alt={t.research_cover_alt.replace('{title}', article.title)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
                    <span className="absolute start-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                      {categoryLabel(article.category)}
                    </span>
                  </div>
                  <div className="flex min-h-44 flex-col p-3 sm:min-h-48 sm:p-4">
                    <h2 className="line-clamp-2 font-heading text-sm font-bold leading-6 text-[var(--luma-text)] sm:text-base">
                      {article.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-6 text-[var(--luma-text-muted)]">
                      {article.description}
                    </p>
                    <a
                      href={article.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--luma-accent)] to-[var(--luma-gold)] px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--luma-gold)]"
                    >
                      <Download className="h-4 w-4 shrink-0" />
                      <span className="truncate">{t.research_download}</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
