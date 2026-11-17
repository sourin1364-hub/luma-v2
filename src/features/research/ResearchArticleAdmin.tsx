import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { BookOpen, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import {
  deleteResearchArticle,
  listResearchArticles,
  RESEARCH_CATEGORIES,
  saveResearchArticle,
  validateResearchCoverFile,
  type ResearchCategory,
  type ResearchCoverValidationError,
  type ResearchArticle,
} from './researchService';

const LANGUAGES = [
  { id: 'fa', label: 'فارسی' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
  { id: 'ckb', label: 'کوردی' },
] as const;

const EMPTY_FORM = {
  category: 'other' as ResearchCategory,
  title: '',
  description: '',
  downloadUrl: '',
  coverUrl: '',
};

const COVER_VALIDATION_ERRORS: ResearchCoverValidationError[] = [
  'research_form_image_type',
  'research_form_image_size',
  'research_form_image_ratio',
  'research_form_image_invalid',
];

function isResearchCoverValidationError(message: string): message is ResearchCoverValidationError {
  return COVER_VALIDATION_ERRORS.some((errorKey) => errorKey === message);
}

export function ResearchArticleAdmin() {
  const lang = useLanguageStore((state) => state.lang);
  const t = UI_TRANSLATIONS[lang];
  const [open, setOpen] = useState(false);
  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]['id']>(lang);
  const [editing, setEditing] = useState<ResearchArticle | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const coverPreview = useMemo(
    () => (coverFile ? URL.createObjectURL(coverFile) : form.coverUrl),
    [coverFile, form.coverUrl]
  );

  useEffect(() => {
    return () => {
      if (coverFile && coverPreview.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    };
  }, [coverFile, coverPreview]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      setArticles(await listResearchArticles(language, true));
    } catch {
      setMessage({ text: t.research_load_error, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void loadArticles();
  }, [open, language]);

  const resetForm = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setMessage(null);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.downloadUrl.trim() || (!coverFile && !form.coverUrl)) {
      setMessage({ text: t.research_form_required, error: true });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await saveResearchArticle({
        id: editing?.id,
        language,
        category: form.category,
        title: form.title,
        description: form.description,
        coverUrl: form.coverUrl,
        downloadUrl: form.downloadUrl,
        published: true,
      }, coverFile);
      resetForm();
      setMessage({ text: t.research_form_saved, error: false });
      await loadArticles();
    } catch (error) {
      const errorMessage = error instanceof Error && error.message.includes('HTTPS')
        ? error.message
        : error instanceof Error && isResearchCoverValidationError(error.message)
          ? t[error.message]
          : t.research_form_save_error;
      setMessage({ text: errorMessage, error: true });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (article: ResearchArticle) => {
    setEditing(article);
    setLanguage(article.language);
    setForm({
      category: article.category,
      title: article.title,
      description: article.description,
      downloadUrl: article.downloadUrl,
      coverUrl: article.coverUrl,
    });
    setCoverFile(null);
    setMessage(null);
  };

  const handleCoverChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    const validationError = await validateResearchCoverFile(file);
    if (validationError) {
      setCoverFile(null);
      input.value = '';
      setMessage({ text: t[validationError], error: true });
      return;
    }

    setCoverFile(file);
    setMessage(null);
  };

  const handleDelete = async (article: ResearchArticle) => {
    if (!window.confirm(t.research_form_delete_confirm)) return;
    setMessage(null);
    try {
      await deleteResearchArticle(article);
      setArticles((current) => current.filter((item) => item.id !== article.id));
    } catch {
      setMessage({ text: t.research_form_save_error, error: true });
    }
  };

  return (
    <Card variant="gold-border" padding="md" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[var(--luma-gold)]" />
          <h2 className="font-heading text-sm text-[var(--luma-text)]">{t.research_admin_title}</h2>
        </div>
        <Button
          variant="gold"
          size="md"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="shrink-0 rounded-full shadow-lg shadow-[var(--luma-gold)]/15"
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? t.research_admin_close : t.research_admin_open}
        </Button>
      </div>

      {open && (
        <div className="space-y-4">
          <label className="block space-y-1.5 text-xs text-[var(--luma-text-muted)]">
            <span>{t.research_form_language}</span>
            <select
              value={language}
              onChange={(event) => {
                resetForm();
                setLanguage(event.target.value as typeof language);
              }}
              className="w-full rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)] px-3 py-2.5 text-sm text-[var(--luma-text)]"
            >
              {LANGUAGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>

          <form onSubmit={handleSave} className="space-y-3 rounded-2xl border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)]/60 p-3">
            <label className="block space-y-1.5 text-xs text-[var(--luma-text-muted)]">
              <span>{t.research_form_category}</span>
              <select
                value={form.category}
                onChange={(event) => {
                  const selected = RESEARCH_CATEGORIES.find((item) => item === event.target.value) ?? 'other';
                  setForm((value) => ({ ...value, category: selected }));
                }}
                className="w-full rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] px-3 py-2.5 text-sm text-[var(--luma-text)]"
              >
                {RESEARCH_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {t[`research_category_${category}`]}
                  </option>
                ))}
              </select>
            </label>
            <input
              required
              maxLength={180}
              value={form.title}
              onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))}
              placeholder={t.research_form_title}
              className="w-full rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] px-3 py-2.5 text-sm text-[var(--luma-text)]"
            />
            <textarea
              required
              maxLength={1200}
              rows={4}
              value={form.description}
              onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
              placeholder={t.research_form_description}
              className="w-full resize-y rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] px-3 py-2.5 text-sm font-normal text-[var(--luma-text)]"
            />
            <input
              required
              type="url"
              pattern="https://.+"
              value={form.downloadUrl}
              onChange={(event) => setForm((value) => ({ ...value, downloadUrl: event.target.value }))}
              placeholder={t.research_form_download}
              dir="ltr"
              className="w-full rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] px-3 py-2.5 text-sm text-[var(--luma-text)]"
            />
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center">
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--luma-gold)]/50 bg-[var(--luma-bg-elevated)] px-4 py-5 text-center text-sm text-[var(--luma-gold)] transition hover:border-[var(--luma-gold)] hover:bg-[var(--luma-gold)]/5">
                <ImagePlus className="h-5 w-5" />
                <span className="font-semibold">{t.research_form_cover}</span>
                <span className="text-[11px] leading-5 text-[var(--luma-text-muted)]">{t.research_form_image_specs}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => void handleCoverChange(event)}
                />
              </label>
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt={t.research_form_image_alt}
                  className="mx-auto aspect-[4/5] w-full max-w-40 rounded-xl border border-[var(--luma-gold)]/30 bg-[var(--luma-bg-elevated)] object-cover shadow-lg"
                />
              ) : (
                <div className="mx-auto flex aspect-[4/5] w-full max-w-40 items-center justify-center rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] p-3 text-center text-xs text-[var(--luma-text-muted)]">
                  {t.research_form_no_cover}
                </div>
              )}
            </div>

            {message && (
              <p role={message.error ? 'alert' : 'status'} className={`text-xs ${message.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                {message.text}
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="gold" fullWidth disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editing ? t.research_form_update : t.research_form_publish}
              </Button>
              {editing && (
                <Button type="button" variant="secondary" onClick={resetForm}>
                  <X className="h-4 w-4" />
                  {t.research_form_cancel}
                </Button>
              )}
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-[var(--luma-gold)]" /></div>
          ) : (
            <div className="space-y-2">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center gap-3 rounded-xl border border-[var(--luma-border)] p-2.5">
                  <img src={article.coverUrl} alt="" className="aspect-[4/5] w-11 rounded-lg object-cover" />
                  <span className="shrink-0 rounded-full border border-[var(--luma-gold)]/20 bg-[var(--luma-gold)]/5 px-2 py-1 text-[10px] text-[var(--luma-gold)]">
                    {t[`research_category_${article.category}`]}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-[var(--luma-text)]">{article.title}</p>
                  <button type="button" onClick={() => handleEdit(article)} aria-label={t.research_form_edit} className="rounded-lg p-2 text-[var(--luma-gold)] hover:bg-[var(--luma-gold)]/10">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => void handleDelete(article)} aria-label={t.research_form_delete} className="rounded-lg p-2 text-rose-400 hover:bg-rose-400/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
