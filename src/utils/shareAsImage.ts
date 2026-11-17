/**
 * رندر پوستر استوری استاندارد و لوکس لوما (۱۰۸۰×۱۹۲۰) — چندزبانه
 */
import type { AppLanguage } from '../i18n/useLanguageStore';

function loadCardImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => {
      resolve(null);
    };
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export interface CardItem {
  cardId: string;
  /** نام کارت — باید توسط کالر با استفاده از tarotI18nResolver ترجمه شده باشد */
  name: string;
  imageUrl: string;
  isReversed: boolean;
}

export interface SharePosterOptions {
  /** زبان جاری — برای ترجمهٔ متن‌های ثابت Canvas و تعیین جهت */
  lang: AppLanguage;
  title: string;
  subtitle: string;
  cardNames: string[];
  summaryText: string;
  adviceText?: string;
  drawnCards?: CardItem[];
  cardImageUrl?: string;
  isReversed?: boolean;
}

/** متن‌های ثابت روی Canvas — چندزبانه */
const CANVAS_I18N: Record<
  AppLanguage,
  {
    brand: string;
    reversedLabel: string;
    cta: string;
    footer: string;
    shareText: string;
  }
> = {
  fa: {
    brand: '✦ LUMA | لومِرا ✦',
    reversedLabel: '(معکوس)',
    cta: '✨ برای کشیدن کارت اختصاصی خودت وارد شو:',
    footer: 'تاروت و طالع‌بینی هوشمند لوما',
    shareText: 'طالع روزانه لوما — lumeraworld.ir',
  },
  en: {
    brand: '✦ LUMA ✦',
    reversedLabel: '(Reversed)',
    cta: '✨ Draw your own personal card here:',
    footer: 'LUMA — Smart Tarot & Astrology',
    shareText: 'LUMA Daily Reading — lumeraworld.ir',
  },
  ar: {
    brand: '✦ LUMA | لوميرا ✦',
    reversedLabel: '(مقلوبة)',
    cta: '✨ اسحب بطاقتك الخاصة من هنا:',
    footer: 'لوميرا — التاروت والأبراج الذكية',
    shareText: 'قراءة لوما اليومية — lumeraworld.ir',
  },
  ckb: {
    brand: '✦ LUMA | لۆمیرا ✦',
    reversedLabel: '(پێچەوانە)',
    cta: '✨ بۆ کێشانی کارتە تایبەتەکەت بچۆ ژوورەوە:',
    footer: 'لۆمیرا — تارۆت و ئەستێرەناسی زیرەک',
    shareText: 'خوێندنەوەی ڕۆژانەی لۆمیرا — lumeraworld.ir',
  },
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function makeStorySummary(text: string, maxLength = 420): string {
  const clean = text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;

  const excerpt = clean.slice(0, maxLength);
  const sentenceEnd = Math.max(
    excerpt.lastIndexOf('. '),
    excerpt.lastIndexOf('! '),
    excerpt.lastIndexOf('? '),
    excerpt.lastIndexOf('؟ '),
    excerpt.lastIndexOf('۔ ')
  );
  if (sentenceEnd > maxLength * 0.55) return `${excerpt.slice(0, sentenceEnd + 1)}…`;

  const wordEnd = excerpt.lastIndexOf(' ');
  return `${excerpt.slice(0, wordEnd > 0 ? wordEnd : maxLength).trimEnd()}…`;
}

function fitTextSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  family: string,
  initialSize: number,
  minimumSize: number,
  weight = '400'
): number {
  for (let size = initialSize; size > minimumSize; size -= 2) {
    ctx.font = `${weight} ${size}px "${family}", Tahoma`;
    if (ctx.measureText(text).width <= maxWidth) return size;
  }
  ctx.font = `${weight} ${minimumSize}px "${family}", Tahoma`;
  return minimumSize;
}

async function ensureFontsLoaded() {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  const fonts = [
    new FontFace('BTitrBold', `url(${cleanBase}fonts/BTitrBold/BTitrBold.woff2)`, { weight: '700' }),
    new FontFace('Majallat', `url(${cleanBase}fonts/Majallat/Majallat.woff2)`, { weight: '400' }),
    new FontFace('Vazirmatn', `url(${cleanBase}fonts/vazirmatn/Vazirmatn-Regular.woff2)`, { weight: '400' }),
    new FontFace('Vazirmatn', `url(${cleanBase}fonts/vazirmatn/Vazirmatn-Bold.woff2)`, { weight: '700' }),
  ];

  for (const f of fonts) {
    try {
      const loaded = await f.load();
      document.fonts.add(loaded);
    } catch {}
  }
}

export async function exportAndShareReadingImage(opts: SharePosterOptions): Promise<void> {
  await ensureFontsLoaded();

  const lang = opts.lang;
  const i18n = CANVAS_I18N[lang];
  const dir: CanvasDirection = lang === 'en' ? 'ltr' : 'rtl';

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // ۱. بارگذاری تصویر پس‌زمینه
  const bgCandidates = [
    `${cleanBase}images/story-bg.webp`,
    `${cleanBase}images/story-bg_2.webp`,
    '/images/story-bg.webp',
    '/images/story-bg_2.webp',
  ];

  let bgImage: HTMLImageElement | null = null;
  for (const p of bgCandidates) {
    bgImage = await loadCardImage(p);
    if (bgImage) break;
  }

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#0c0424';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.direction = dir;
  ctx.textAlign = 'center';

  // ۲. هدر برند
  ctx.fillStyle = '#FCE77D';
  ctx.font = 'bold 50px "BTitrBold", Tahoma';
  ctx.fillText(i18n.brand, canvas.width / 2, 210);

  ctx.fillStyle = '#E5C158';
  fitTextSize(ctx, opts.title, 940, 'Vazirmatn', 32, 20, '700');
  ctx.fillText(opts.title, canvas.width / 2, 275, 940);

  // ۳. چیدمان کارت‌ها
  const cards: CardItem[] =
    opts.drawnCards && opts.drawnCards.length > 0
      ? opts.drawnCards
      : opts.cardImageUrl
      ? [
          {
            cardId: '1',
            name: opts.cardNames[0] || '',
            imageUrl: opts.cardImageUrl,
            isReversed: !!opts.isReversed,
          },
        ]
      : [];

  const cardW = 320;
  const cardH = 530;
  const centerY = 595;

  if (cards.length === 1) {
    const c = cards[0];
    const img = await loadCardImage(c.imageUrl);
    if (img) {
      const cx = (canvas.width - cardW) / 2;
      const cy = centerY - cardH / 2;

      ctx.save();
      ctx.shadowColor = 'rgba(245, 206, 90, 0.45)';
      ctx.shadowBlur = 35;
      drawRoundedRect(ctx, cx, cy, cardW, cardH, 20);
      ctx.fillStyle = '#0B0520';
      ctx.fill();
      ctx.restore();

      ctx.save();
      drawRoundedRect(ctx, cx, cy, cardW, cardH, 20);
      ctx.clip();
      if (c.isReversed) {
        ctx.translate(cx + cardW / 2, cy + cardH / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);
      } else {
        ctx.drawImage(img, cx, cy, cardW, cardH);
      }
      ctx.restore();

      ctx.strokeStyle = '#E5C158';
      ctx.lineWidth = 3;
      drawRoundedRect(ctx, cx, cy, cardW, cardH, 20);
      ctx.stroke();
    }
  } else if (cards.length > 1) {
    const total = cards.length;
    const spacing = Math.min(180, 500 / total);
    const startX = (canvas.width - (cardW + (total - 1) * spacing)) / 2;

    for (let i = 0; i < total; i++) {
      const c = cards[i];
      const img = await loadCardImage(c.imageUrl);
      if (!img) continue;

      const posX = startX + i * spacing;
      const posY = centerY - cardH / 2 + (i - (total - 1) / 2) * 12;
      const angle = (i - (total - 1) / 2) * 0.08;

      ctx.save();
      ctx.translate(posX + cardW / 2, posY + cardH / 2);
      ctx.rotate(angle);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = -6;
      ctx.shadowOffsetY = 10;

      drawRoundedRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 18);
      ctx.fillStyle = '#0B0520';
      ctx.fill();

      ctx.save();
      drawRoundedRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 18);
      ctx.clip();
      if (c.isReversed) {
        ctx.rotate(Math.PI);
      }
      ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);
      ctx.restore();

      ctx.strokeStyle = 'rgba(229, 193, 88, 0.85)';
      ctx.lineWidth = 2.5;
      drawRoundedRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 18);
      ctx.stroke();

      ctx.restore();
    }
  }

  // ۴. نام کارت‌ها
  const nameY = 930;
  const titleText = cards
    .map((c) => `${c.name}${c.isReversed ? ` ${i18n.reversedLabel}` : ''}`)
    .join('  ✦  ');
  ctx.fillStyle = '#FCE77D';
  fitTextSize(ctx, `« ${titleText} »`, 940, 'BTitrBold', 36, 20, '700');
  ctx.fillText(`« ${titleText} »`, canvas.width / 2, nameY, 940);

  // ۵. کادر شیشه‌ای تیره
  const boxW = 860;
  const boxH = 520;
  const boxX = (canvas.width - boxW) / 2;
  const boxY = 985;

  ctx.fillStyle = 'rgba(12, 6, 32, 0.78)';
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(229, 193, 88, 0.35)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 24);
  ctx.stroke();

  const cleanSummary = makeStorySummary(opts.summaryText);
  const fontSize = cleanSummary.length > 320 ? 21 : cleanSummary.length > 200 ? 23 : 25;
  const lineHeight = fontSize + 16;

  ctx.fillStyle = '#F8FAFC';
  ctx.font = `400 ${fontSize}px "Vazirmatn", Tahoma`;

  const summaryLines = wrapText(ctx, cleanSummary, boxW - 80);
  let textY = boxY + 55;

  for (const line of summaryLines) {
    ctx.fillText(line, canvas.width / 2, textY, boxW - 80);
    textY += lineHeight;
  }

  // بخش دعوت به اقدام
  const ctaBaseY = Math.min(Math.max(textY + 18, boxY + boxH - 95), boxY + boxH - 72);
  ctx.fillStyle = '#FDE68A';
  fitTextSize(ctx, i18n.cta, boxW - 60, 'Vazirmatn', 22, 16, '700');
  ctx.fillText(i18n.cta, canvas.width / 2, ctaBaseY, boxW - 60);

  ctx.fillStyle = '#6EE7B7';
  ctx.font = 'bold 28px "Vazirmatn", Tahoma';
  ctx.fillText('lumeraworld.ir', canvas.width / 2, ctaBaseY + 40);

  // ۶. پاورقی
  ctx.fillStyle = 'rgba(229, 193, 88, 0.9)';
  ctx.font = '500 24px "Vazirmatn", Tahoma';
  ctx.fillText(i18n.footer, canvas.width / 2, 1770);

  // ۷. خروجی و دانلود
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('Could not render the story image.'));
    }, 'image/png');
  });
  const file = new File([blob], `luma-story-${Date.now()}.png`, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title: opts.title, text: i18n.shareText, files: [file] });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Native story sharing failed; downloading image instead:', error);
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `luma-story-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}