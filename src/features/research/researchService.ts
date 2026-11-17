import { supabase } from '../../lib/supabase';
import type { AppLanguage } from '../../i18n/useLanguageStore';

const COVER_BUCKET = 'research-article-covers';
export const MAX_RESEARCH_COVER_BYTES = 100 * 1024;
export const RESEARCH_COVER_WIDTH = 4;
export const RESEARCH_COVER_HEIGHT = 5;

export const RESEARCH_CATEGORIES = [
  'astronomy',
  'astrology',
  'tarot',
  'psychology',
  'spirituality',
  'other',
] as const;

export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];
export type ResearchCoverValidationError =
  | 'research_form_image_type'
  | 'research_form_image_size'
  | 'research_form_image_ratio'
  | 'research_form_image_invalid';

function getResearchCategory(category: string): ResearchCategory {
  return RESEARCH_CATEGORIES.find((candidate) => candidate === category) ?? 'other';
}

export function isResearchCoverAspectRatioValid(width: number, height: number): boolean {
  return Number.isFinite(width)
    && Number.isFinite(height)
    && width > 0
    && height > 0
    && width * RESEARCH_COVER_HEIGHT === height * RESEARCH_COVER_WIDTH;
}

export async function validateResearchCoverFile(
  file: File
): Promise<ResearchCoverValidationError | null> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'research_form_image_type';
  }
  if (file.size >= MAX_RESEARCH_COVER_BYTES) return 'research_form_image_size';

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return 'research_form_image_invalid';
  }

  const validRatio = isResearchCoverAspectRatioValid(bitmap.width, bitmap.height);
  bitmap.close();
  return validRatio ? null : 'research_form_image_ratio';
}

export interface ResearchArticle {
  id: string;
  language: AppLanguage;
  category: ResearchCategory;
  title: string;
  description: string;
  coverUrl: string;
  downloadUrl: string;
  published: boolean;
  createdAt: string;
}

export interface ResearchArticleInput {
  id?: string;
  language: AppLanguage;
  category: ResearchCategory;
  title: string;
  description: string;
  coverUrl: string;
  downloadUrl: string;
  published: boolean;
}

function mapArticle(row: {
  id: string;
  language: AppLanguage;
  category: string;
  title: string;
  description: string;
  cover_url: string;
  download_url: string;
  published: boolean;
  created_at: string;
}): ResearchArticle {
  return {
    id: row.id,
    language: row.language,
    category: getResearchCategory(row.category),
    title: row.title,
    description: row.description,
    coverUrl: row.cover_url,
    downloadUrl: row.download_url,
    published: row.published,
    createdAt: row.created_at,
  };
}

export async function listResearchArticles(
  language: AppLanguage,
  includeDrafts = false
): Promise<ResearchArticle[]> {
  let query = supabase
    .from('research_articles')
    .select('id, language, category, title, description, cover_url, download_url, published, created_at')
    .eq('language', language)
    .order('created_at', { ascending: false });

  if (!includeDrafts) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) {
    console.error('Could not load LUMERA research articles:', error);
    throw new Error('Could not load research articles.');
  }
  return (data || []).map(mapArticle);
}

async function uploadCover(file: File, language: AppLanguage): Promise<string> {
  const validationError = await validateResearchCoverFile(file);
  if (validationError) throw new Error(validationError);
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `${language}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error('Could not upload research cover:', error);
    throw new Error('Could not upload article cover.');
  }
  return supabase.storage.from(COVER_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function saveResearchArticle(
  input: ResearchArticleInput,
  coverFile?: File | null
): Promise<void> {
  const downloadUrl = new URL(input.downloadUrl);
  if (downloadUrl.protocol !== 'https:') throw new Error('Article download links must use HTTPS.');

  const coverUrl = coverFile ? await uploadCover(coverFile, input.language) : input.coverUrl;
  if (!coverUrl) throw new Error('Article cover image is required.');

  const row = {
    language: input.language,
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    cover_url: coverUrl,
    download_url: downloadUrl.toString(),
    published: input.published,
    updated_at: new Date().toISOString(),
  };
  const query = input.id
    ? supabase.from('research_articles').update(row).eq('id', input.id)
    : supabase.from('research_articles').insert(row);
  const { error } = await query;
  if (error) {
    console.error('Could not save LUMERA research article:', error);
    throw new Error('Could not save research article.');
  }
}

export async function deleteResearchArticle(article: ResearchArticle): Promise<void> {
  const { error } = await supabase.from('research_articles').delete().eq('id', article.id);
  if (error) {
    console.error('Could not delete LUMERA research article:', error);
    throw new Error('Could not delete research article.');
  }

  const marker = `/storage/v1/object/public/${COVER_BUCKET}/`;
  const markerIndex = article.coverUrl.indexOf(marker);
  if (markerIndex < 0) return;
  const path = decodeURIComponent(article.coverUrl.slice(markerIndex + marker.length));
  const { error: storageError } = await supabase.storage.from(COVER_BUCKET).remove([path]);
  if (storageError) console.error('Could not remove deleted research cover:', storageError);
}
