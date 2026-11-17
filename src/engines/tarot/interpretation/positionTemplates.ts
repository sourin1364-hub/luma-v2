// src/engines/tarot/interpretation/positionTemplates.ts

export interface PositionTemplate {
  prefix: string;
  connector: string;
  suffix: string;
  hint: string;
}

export type SupportedTarotLang = 'fa' | 'en' | 'ar' | 'ckb';
export type MultiLangTemplate = Record<SupportedTarotLang, Record<number, PositionTemplate>>;

export const PAST_PRESENT_FUTURE_TEMPLATES: MultiLangTemplate = {
  fa: {
    0: { prefix: 'در گذشته،', connector: 'شما با این انرژی مواجه بودید:', suffix: 'این تجربه، پایه وضعیت فعلی شماست.', hint: 'این کارت نشان می‌دهد چه چیزی در گذشته شکل گرفته و امروز اثر دارد.' },
    1: { prefix: 'در حال حاضر،', connector: 'انرژی حاکم بر زندگی شما این است:', suffix: 'این انرژی، واقعیت فعلی شما را می‌سازد.', hint: 'این کارت وضعیت فعلی و انرژی حاکم بر زمان حال را نشان می‌دهد.' },
    2: { prefix: 'در آینده نزدیک،', connector: 'این انرژی در انتظار شماست:', suffix: 'این مسیر، نتیجه احتمالی اقدامات فعلی شماست.', hint: 'این کارت جهت‌گیری و نتیجه احتمالی در آینده نزدیک را نشان می‌دهد.' },
  },
  en: {
    0: { prefix: 'In the past,', connector: 'you were facing this energy:', suffix: 'This experience forms the basis of your current situation.', hint: 'Shows what formed in the past affecting today.' },
    1: { prefix: 'Currently,', connector: 'the dominant energy in your life is:', suffix: 'This energy creates your current reality.', hint: 'Shows the current situation and dominant energy.' },
    2: { prefix: 'In the near future,', connector: 'this energy awaits you:', suffix: 'This path is the likely outcome of your current actions.', hint: 'Shows the direction and likely outcome in the near future.' },
  },
  ar: {
    0: { prefix: 'في الماضي،', connector: 'كنت تواجه هذه الطاقة:', suffix: 'هذه التجربة تشكل أساس وضعك الحالي.', hint: 'تُظهر ما تشكل في الماضي ويؤثر في الحاضر.' },
    1: { prefix: 'حالياً،', connector: 'الطاقة السائدة في حياتك هي:', suffix: 'هذه الطاقة تصنع واقعك الحالي.', hint: 'تُظهر الوضع الحالي والطاقة السائدة.' },
    2: { prefix: 'في المستقبل القريب،', connector: 'هذه الطاقة تنتظرك:', suffix: 'هذا المسار هو النتيجة المحتملة لأفعالك الحالية.', hint: 'تُظهر الاتجاه والنتيجة المحتملة في المستقبل القريب.' },
  },
  ckb: {
    0: { prefix: 'لە ڕابردوودا،', connector: 'تۆ ڕووبەڕووی ئەم وزەیە بوویتەوە:', suffix: 'ئەم ئەزموونە بنەمای دۆخی ئێستای تۆیە.', hint: 'ئەم کارتە نیشان دەدات چی لە ڕابردوودا دروست بووە و کاریگەری لەسەر ئێستایە.' },
    1: { prefix: 'لە ئێستادا،', connector: 'وزەی زاڵ لە ژیانت:', suffix: 'ئەم وزەیە واقیعی ئێستای تۆ دروست دەکات.', hint: 'ئەم کارتە دۆخی ئێستا و وزەی زاڵ نیشان دەدات.' },
    2: { prefix: 'لە داهاتووی نزیکدا،', connector: 'ئەم وزەیە چاوەڕوانی تۆیە:', suffix: 'ئەم ڕێڕەوە ئەنجامی ئەگەری کردارەکانی ئێستای تۆیە.', hint: 'ئەم کارتە ئاراستە و ئەنجامی ئەگەری لە داهاتووی نزیکدا نیشان دەدات.' },
  },
};

export const SITUATION_OBSTACLE_ADVICE_TEMPLATES: MultiLangTemplate = {
  fa: {
    0: { prefix: 'وضعیت فعلی شما:', connector: 'شما در این انرژی قرار دارید:', suffix: 'این وضعیت، نقطه شروع شماست.', hint: 'این کارت وضعیت فعلی و انرژی حاکم را نشان می‌دهد.' },
    1: { prefix: 'مانع شما:', connector: 'این انرژی شما را متوقف کرده است:', suffix: 'برای پیشرفت، باید این مانع را برطرف کنید.', hint: 'این کارت مانع یا چالشی که باید برطرف شود را نشان می‌دهد.' },
    2: { prefix: 'راهکار شما:', connector: 'این انرژی می‌تواند به شما کمک کند:', suffix: 'این اقدام پیشنهادی، شما را به جلو می‌برد.', hint: 'این کارت راه پیشنهادی و اقدام مناسب را نشان می‌دهد.' },
  },
  en: {
    0: { prefix: 'Your current situation:', connector: 'you are in this energy:', suffix: 'This situation is your starting point.', hint: 'Shows current situation and energy.' },
    1: { prefix: 'Your obstacle:', connector: 'this energy has stopped you:', suffix: 'To progress, you must overcome this obstacle.', hint: 'Shows the obstacle or challenge to be resolved.' },
    2: { prefix: 'Your advice:', connector: 'this energy can help you:', suffix: 'This suggested action moves you forward.', hint: 'Shows the suggested path and action.' },
  },
  ar: {
    0: { prefix: 'وضعك الحالي:', connector: 'أنت في هذه الطاقة:', suffix: 'هذا الوضع هو نقطة انطلاقك.', hint: 'تُظهر الوضع الحالي والطاقة السائدة.' },
    1: { prefix: 'العقبة أمامك:', connector: 'هذه الطاقة أوقفتك:', suffix: 'للتقدم، يجب التغلب على هذه العقبة.', hint: 'تُظهر العقبة أو التحدي الذي يجب حله.' },
    2: { prefix: 'نصيحتك:', connector: 'هذه الطاقة يمكن أن تساعدك:', suffix: 'هذا الإجراء المقترح يدفعك إلى الأمام.', hint: 'تُظهر المسار المقترح والإجراء المناسب.' },
  },
  ckb: {
    0: { prefix: 'دۆخی ئێستای تۆ:', connector: 'تۆ لەم وزەیەدایت:', suffix: 'ئەم دۆخە خاڵی دەستپێکی تۆیە.', hint: 'ئەم کارتە دۆخی ئێستا و وزەی زاڵ نیشان دەدات.' },
    1: { prefix: 'بەربەستی تۆ:', connector: 'ئەم وزەیە تۆی ڕاگرتووە:', suffix: 'بۆ پێشکەوتن، دەبێت ئەم بەربەستە تێپەڕێنی.', hint: 'ئەم کارتە بەربەست یان ئاستەنگ نیشان دەدات کە دەبێت چارەسەر بکرێت.' },
    2: { prefix: 'ڕێگەچارەی تۆ:', connector: 'ئەم وزەیە دەتوانێت یارمەتیت بدات:', suffix: 'ئەم کردارە پێشنیارکراوە تۆ بەرەو پێش دەبات.', hint: 'ئەم کارتە ڕێگە و کرداری گونجاو نیشان دەدات.' },
  },
};

export const MIND_HEART_ACTION_TEMPLATES: MultiLangTemplate = {
  fa: {
    0: { prefix: 'ذهن شما:', connector: 'افکار و منطق شما تحت تأثیر این انرژی است:', suffix: 'این طرز فکر، تصمیم‌های شما را هدایت می‌کند.', hint: 'این کارت آنچه در ذهن می‌گذرد و منطق موقعیت را نشان می‌دهد.' },
    1: { prefix: 'احساس شما:', connector: 'قلب شما این انرژی را تجربه می‌کند:', suffix: 'این احساس، نیاز عاطفی شما را نشان می‌دهد.', hint: 'این کارت احساسات و وضعیت عاطفی را نشان می‌دهد.' },
    2: { prefix: 'عمل شما:', connector: 'این انرژی، اقدام پیشنهادی شماست:', suffix: 'این رفتار، شما را به تعادل می‌رساند.', hint: 'این کارت اقدام پیشنهادی و رفتار مناسب را نشان می‌دهد.' },
  },
  en: {
    0: { prefix: 'Your mind:', connector: 'your thoughts and logic are affected by this energy:', suffix: 'This mindset guides your decisions.', hint: 'Shows what is on your mind and the logic of the situation.' },
    1: { prefix: 'Your heart:', connector: 'your heart is experiencing this energy:', suffix: 'This feeling shows your emotional need.', hint: 'Shows emotions and emotional state.' },
    2: { prefix: 'Your action:', connector: 'this energy is your suggested action:', suffix: 'This behavior brings you balance.', hint: 'Shows the suggested action and appropriate behavior.' },
  },
  ar: {
    0: { prefix: 'عقلك:', connector: 'أفكارك ومنطقك يتأثران بهذه الطاقة:', suffix: 'هذه العقلية توجه قراراتك.', hint: 'تُظهر ما يدور في ذهنك ومنطق الموقف.' },
    1: { prefix: 'قلبك:', connector: 'قلبك يعيش هذه الطاقة:', suffix: 'هذا الشعور يُظهر حاجتك العاطفية.', hint: 'تُظهر المشاعر والحالة العاطفية.' },
    2: { prefix: 'فعلك:', connector: 'هذه الطاقة هي إجراؤك المقترح:', suffix: 'هذا السلوك يجعلك متوازناً.', hint: 'تُظهر الإجراء المقترح والسلوك المناسب.' },
  },
  ckb: {
    0: { prefix: 'زهینت:', connector: 'بیر و لۆژیکی تۆ لەژێر کاریگەری ئەم وزەیەدایە:', suffix: 'ئەم بیرکردنەوەیە بڕیارەکانت بەڕێوە دەبات.', hint: 'ئەم کارتە نیشان دەدات چی لە زهیندایە و لۆژیکی دۆخەکە.' },
    1: { prefix: 'هەستت:', connector: 'دڵت ئەم وزەیە ئەزموون دەکات:', suffix: 'ئەم هەستە پێویستی سۆزداری تۆ نیشان دەدات.', hint: 'ئەم کارتە هەستەکان و دۆخی سۆزداری نیشان دەدات.' },
    2: { prefix: 'کردارت:', connector: 'ئەم وزەیە کرداری پێشنیارکراوی تۆیە:', suffix: 'ئەم ڕەفتارە تۆ دەگەیەنێتە هاوسەنگی.', hint: 'ئەم کارتە کرداری پێشنیارکراو و ڕەفتاری گونجاو نیشان دەدات.' },
  },
};

export const YES_NO_TEMPLATES: MultiLangTemplate = {
  fa: {
    0: { prefix: 'پاسخ شما:', connector: 'این انرژی پاسخ پرسش شما را نشان می‌دهد:', suffix: 'این پاسخ، راهنمای شماست.', hint: 'این کارت پاسخ کوتاه (بله، خیر یا شاید) را نشان می‌دهد.' },
  },
  en: {
    0: { prefix: 'Your answer:', connector: 'this energy shows the answer to your question:', suffix: 'This answer is your guide.', hint: 'Shows the short answer (Yes, No, or Maybe).' },
  },
  ar: {
    0: { prefix: 'إجابتك:', connector: 'هذه الطاقة تُظهر إجابة سؤالك:', suffix: 'هذه الإجابة هي دليلك.', hint: 'تُظهر الإجابة القصيرة (نعم، لا، أو ربما).' },
  },
  ckb: {
    0: { prefix: 'وەڵامی تۆ:', connector: 'ئەم وزەیە وەڵامی پرسیارەکەت نیشان دەدات:', suffix: 'ئەم وەڵامە ڕێنمایی تۆیە.', hint: 'ئەم کارتە وەڵامی کورت (بەڵێ، نەخێر، یان ڕەنگە) نیشان دەدات.' },
  },
};

export const SINGLE_CARD_TEMPLATES: MultiLangTemplate = {
  fa: {
    0: { prefix: 'پیام امروز شما:', connector: 'این انرژی، همراه شماست:', suffix: 'این پیام، راهنمای امروز شماست.', hint: 'این کارت پیام و انرژی اصلی امروز را نشان می‌دهد.' },
  },
  en: {
    0: { prefix: 'Your message today:', connector: 'this energy is with you:', suffix: 'This message is your guide for today.', hint: 'Shows the main message and energy of today.' },
  },
  ar: {
    0: { prefix: 'رسالتك اليوم:', connector: 'هذه الطاقة معك:', suffix: 'هذه الرسالة هي دليلك لهذا اليوم.', hint: 'تُظهر الرسالة والطاقة الرئيسية لليوم.' },
  },
  ckb: {
    0: { prefix: 'پەیامی ئەمڕۆی تۆ:', connector: 'ئەم وزەیە لەگەڵتدایە:', suffix: 'ئەم پەیامە ڕێنمایی ئەمڕۆی تۆیە.', hint: 'ئەم کارتە پەیام و وزەی سەرەکی ئەمڕۆ نیشان دەدات.' },
  },
};

export function getTemplatesForSpread(spreadId: string, lang: SupportedTarotLang): Record<number, PositionTemplate> {
  let templates: MultiLangTemplate;
  
  switch (spreadId) {
    case 'past-present-future': templates = PAST_PRESENT_FUTURE_TEMPLATES; break;
    case 'situation-obstacle-advice': templates = SITUATION_OBSTACLE_ADVICE_TEMPLATES; break;
    case 'mind-heart-action': templates = MIND_HEART_ACTION_TEMPLATES; break;
    case 'yes-no': templates = YES_NO_TEMPLATES; break;
    case 'daily-card':
    case 'single-card': 
    default: templates = SINGLE_CARD_TEMPLATES; break;
  }
  
  return templates[lang] || templates['fa'];
}