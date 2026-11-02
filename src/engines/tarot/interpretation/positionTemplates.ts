/**
 * قالب‌های روایی برای هر موقعیت در چیدمان‌های مختلف.
 * این قالب‌ها با معنی پایه کارت ترکیب می‌شوند تا معنی موقعیت‌محور یکتا بسازند.
 */

export interface PositionTemplate {
  /** پیشوند روایت (مثلاً "در گذشته،") */
  prefix: string;
  /** جمله‌بندی موقعیت (مثلاً "این کارت نشان می‌دهد که") */
  connector: string;
  /** پسوند روایت (مثلاً "که امروز شما را ساخته است.") */
  suffix: string;
  /** راهنمای تفسیر (برای LLM در آینده) */
  hint: string;
}

/**
 * قالب‌های موقعیت برای چیدمان «گذشته، حال، آینده»
 */
export const PAST_PRESENT_FUTURE_TEMPLATES: Record<number, PositionTemplate> = {
  0: {
    prefix: 'در گذشته،',
    connector: 'شما با این انرژی مواجه بودید:',
    suffix: 'این تجربه، پایه وضعیت فعلی شماست.',
    hint: 'این کارت نشان می‌دهد چه چیزی در گذشته شکل گرفته و امروز اثر دارد.'
  },
  1: {
    prefix: 'در حال حاضر،',
    connector: 'انرژی حاکم بر زندگی شما این است:',
    suffix: 'این انرژی، واقعیت فعلی شما را می‌سازد.',
    hint: 'این کارت وضعیت فعلی و انرژی حاکم بر زمان حال را نشان می‌دهد.'
  },
  2: {
    prefix: 'در آینده نزدیک،',
    connector: 'این انرژی در انتظار شماست:',
    suffix: 'این مسیر، نتیجه احتمالی اقدامات فعلی شماست.',
    hint: 'این کارت جهت‌گیری و نتیجه احتمالی در آینده نزدیک را نشان می‌دهد.'
  },
};

/**
 * قالب‌های موقعیت برای چیدمان «وضعیت، مانع، راهکار»
 */
export const SITUATION_OBSTACLE_ADVICE_TEMPLATES: Record<number, PositionTemplate> = {
  0: {
    prefix: 'وضعیت فعلی شما:',
    connector: 'شما در این انرژی قرار دارید:',
    suffix: 'این وضعیت، نقطه شروع شماست.',
    hint: 'این کارت وضعیت فعلی و انرژی حاکم را نشان می‌دهد.'
  },
  1: {
    prefix: 'مانع شما:',
    connector: 'این انرژی شما را متوقف کرده است:',
    suffix: 'برای پیشرفت، باید این مانع را برطرف کنید.',
    hint: 'این کارت مانع یا چالشی که باید برطرف شود را نشان می‌دهد.'
  },
  2: {
    prefix: 'راهکار شما:',
    connector: 'این انرژی می‌تواند به شما کمک کند:',
    suffix: 'این اقدام پیشنهادی، شما را به جلو می‌برد.',
    hint: 'این کارت راه پیشنهادی و اقدام مناسب را نشان می‌دهد.'
  },
};

/**
 * قالب‌های موقعیت برای چیدمان «ذهن، احساس، عمل»
 */
export const MIND_HEART_ACTION_TEMPLATES: Record<number, PositionTemplate> = {
  0: {
    prefix: 'ذهن شما:',
    connector: 'افکار و منطق شما تحت تأثیر این انرژی است:',
    suffix: 'این طرز فکر، تصمیم‌های شما را هدایت می‌کند.',
    hint: 'این کارت آنچه در ذهن می‌گذرد و منطق موقعیت را نشان می‌دهد.'
  },
  1: {
    prefix: 'احساس شما:',
    connector: 'قلب شما این انرژی را تجربه می‌کند:',
    suffix: 'این احساس، نیاز عاطفی شما را نشان می‌دهد.',
    hint: 'این کارت احساسات و وضعیت عاطفی را نشان می‌دهد.'
  },
  2: {
    prefix: 'عمل شما:',
    connector: 'این انرژی، اقدام پیشنهادی شماست:',
    suffix: 'این رفتار، شما را به تعادل می‌رساند.',
    hint: 'این کارت اقدام پیشنهادی و رفتار مناسب را نشان می‌دهد.'
  },
};

/**
 * قالب‌های موقعیت برای چیدمان «بله یا خیر»
 */
export const YES_NO_TEMPLATES: Record<number, PositionTemplate> = {
  0: {
    prefix: 'پاسخ شما:',
    connector: 'این انرژی پاسخ پرسش شما را نشان می‌دهد:',
    suffix: 'این پاسخ، راهنمای شماست.',
    hint: 'این کارت پاسخ کوتاه (بله، خیر یا شاید) را نشان می‌دهد.'
  },
};

/**
 * قالب‌های موقعیت برای چیدمان «کارت روزانه» و «تک‌کارتی»
 */
export const SINGLE_CARD_TEMPLATES: Record<number, PositionTemplate> = {
  0: {
    prefix: 'پیام امروز شما:',
    connector: 'این انرژی، همراه شماست:',
    suffix: 'این پیام، راهنمای امروز شماست.',
    hint: 'این کارت پیام و انرژی اصلی امروز را نشان می‌دهد.'
  },
};

/**
 * دریافت قالب‌های مناسب برای یک چیدمان
 */
export function getTemplatesForSpread(spreadId: string): Record<number, PositionTemplate> {
  switch (spreadId) {
    case 'past-present-future': return PAST_PRESENT_FUTURE_TEMPLATES;
    case 'situation-obstacle-advice': return SITUATION_OBSTACLE_ADVICE_TEMPLATES;
    case 'mind-heart-action': return MIND_HEART_ACTION_TEMPLATES;
    case 'yes-no': return YES_NO_TEMPLATES;
    case 'daily-card':
    case 'single-card': return SINGLE_CARD_TEMPLATES;
    default: return SINGLE_CARD_TEMPLATES;
  }
}