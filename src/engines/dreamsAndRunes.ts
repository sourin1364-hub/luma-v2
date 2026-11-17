import type { AppLanguage } from '../i18n/useLanguageStore';

/* ============================================================
 *  DREAMS
 * ============================================================ */

export type DreamCategoryKey = 'nature' | 'animals' | 'flight' | 'objects' | 'human' | 'colors';

export const DREAM_CATEGORY_LABELS: Record<DreamCategoryKey, Record<AppLanguage, string>> = {
  nature: {
    fa: 'طبیعت و عناصر',
    en: 'Nature & Elements',
    ar: 'الطبيعة والعناصر',
    ckb: 'سروشت و توخمەکان',
  },
  animals: {
    fa: 'حیوانات',
    en: 'Animals',
    ar: 'الحيوانات',
    ckb: 'ئاژەڵەکان',
  },
  flight: {
    fa: 'پرواز و حرکت',
    en: 'Flight & Movement',
    ar: 'الطيران والحركة',
    ckb: 'فڕین و جووڵە',
  },
  objects: {
    fa: 'اشیاء و مکان‌ها',
    en: 'Objects & Places',
    ar: 'الأشياء والأماكن',
    ckb: 'شت و شوێنەکان',
  },
  human: {
    fa: 'انسان و حالات',
    en: 'Humans & Emotions',
    ar: 'الإنسان والحالات',
    ckb: 'مرۆڤ و بارودۆخەکان',
  },
  colors: {
    fa: 'رنگ و اعداد',
    en: 'Colors & Numbers',
    ar: 'الألوان والأرقام',
    ckb: 'ڕەنگ و ژمارەکان',
  },
};

export interface DreamEntry {
  symbol: Record<AppLanguage, string>;
  category: DreamCategoryKey;
  meaning: Record<AppLanguage, string>;
  advice: Record<AppLanguage, string>;
}

export const COMPREHENSIVE_DREAMS: DreamEntry[] = [
  // ── طبیعت و عناصر ──────────────────────────────────────────
  {
    symbol: {
      fa: 'دریا و اقیانوس آرام',
      en: 'Calm sea and ocean',
      ar: 'البحر والمحيط الهادئ',
      ckb: 'دەریا و زەریای هێمن',
    },
    category: 'nature',
    meaning: {
      fa: 'نشانه آرامش عمیق ناخودآگاه، گشایش در امور مالی و عاطفی، و هماهنگی با جریان بزرگ زندگی است.',
      en: 'A sign of deep subconscious peace, financial and emotional opening, and harmony with the greater flow of life.',
      ar: 'علامة على سلام داخلي عميق، انفتاح في الأمور المالية والعاطفية، وتناغم مع تدفق الحياة الأكبر.',
      ckb: 'نیشانەی ئارامی قووڵی ناخۆشی، کردنەوە لە کاروباری دارایی و سۆزداری، و هاوتەریبی لەگەڵ ڕەوتی گەورەی ژیان.',
    },
    advice: {
      fa: 'به شهود درونی خود اعتماد کنید و با آرامش تصمیم بگیرید.',
      en: 'Trust your inner intuition and make decisions calmly.',
      ar: 'ثق بحدسك الداخلي واتخذ قراراتك بهدوء.',
      ckb: 'باوەڕ بە ھەستی ناوەکی خۆت بکە و بە ئارامی بڕیار بدە.',
    },
  },
  {
    symbol: {
      fa: 'دریای طوفانی و امواج بلند',
      en: 'Stormy sea and high waves',
      ar: 'بحر عاصف وأمواج عالية',
      ckb: 'دەریای ڕەشەباوی و شەپۆلی بەرز',
    },
    category: 'nature',
    meaning: {
      fa: 'بازتاب هیجانات سرکوب‌شده، تردید در یک تصمیم مهم یا تغییرات پرشتاب در محیط پیرامون است.',
      en: 'A reflection of suppressed emotions, hesitation over an important decision, or rapid changes in your surroundings.',
      ar: 'انعكاس للعواطف المكبوتة، أو التردد في قرار مهم، أو تغييرات متسارعة في محيطك.',
      ckb: 'ڕەنگدانەوەی ھەستیارییەکانی سەرکوتکراو، گومان لە بڕیارێکی گرنگ یان گۆڕانکاری خێرا لە ژینگەدا.',
    },
    advice: {
      fa: 'پیش از هر واکنش عاطفی، صبر پیشه کنید تا طوفان ذهنی فروکش کند.',
      en: 'Before any emotional reaction, be patient until the mental storm subsides.',
      ar: 'قبل أي رد فعل عاطفي، تحلَّ بالصبر حتى تهدأ العاصفة الذهنية.',
      ckb: 'پێش ھەر کاردانەوەیەکی سۆزداری، ئارام بە تا ڕەشەبای دەروونی کەم ببێتەوە.',
    },
  },
  {
    symbol: {
      fa: 'آب زلال و چشمه روان',
      en: 'Clear water and flowing spring',
      ar: 'ماء صافٍ ونبع جارٍ',
      ckb: 'ئاوی ڕوون و کانیاوی ڕەوان',
    },
    category: 'nature',
    meaning: {
      fa: 'نماد پاکی نیت، شفای روحی، برکت حلال و آغاز دوره‌ای سرشار از روشنایی و نشاط.',
      en: 'A symbol of pure intention, spiritual healing, lawful blessings, and the start of a bright, joyful period.',
      ar: 'رمز نقاء النية، والشفاء الروحي، والبركة الحلال، وبداية فترة مليئة بالنور والحيوية.',
      ckb: 'نیشانەی پاکی نیەت، چاکبوونەوەی ڕۆحی، بەرەکەتی حەڵاڵ و دەستپێکی ماوەیەکی پڕ لە ڕووناکی و ژیان.',
    },
    advice: {
      fa: 'فرصت‌های تازه‌ای که به زودی پیش رویتان قرار می‌گیرد را با آغوش باز بپذیرید.',
      en: 'Embrace the new opportunities that will soon come your way with open arms.',
      ar: 'استقبل الفرص الجديدة التي ستأتيك قريبًا بذراعين مفتوحتين.',
      ckb: 'دەرفەتە نوێیەکان کە بەم زووانە ڕووت دەکەن بە باوەشی کراوە پێشوازی لێ بکە.',
    },
  },
  {
    symbol: {
      fa: 'باران رحمت',
      en: 'Rain of mercy',
      ar: 'مطر الرحمة',
      ckb: 'بارانی بەزەیی',
    },
    category: 'nature',
    meaning: {
      fa: 'شسته‌شدن غم‌های گذشته، پایان دوره رکود و فرود آمدن برکت و آرامش در زندگی شخصی.',
      en: 'Washing away past sorrows, the end of a stagnant period, and the descent of blessings and peace into your personal life.',
      ar: 'غسل أحزان الماضي، ونهاية فترة الركود، ونزول البركة والطمأنينة في حياتك الشخصية.',
      ckb: 'شۆردنی خەمەکانی ڕابردوو، کۆتایی ماوەی وەستان و دابەزینی بەرەکەت و ئارامی بۆ ژیانی کەسیت.',
    },
    advice: {
      fa: 'کینه‌ها یا دلخوری‌های قدیمی را ببخشید و رها کنید.',
      en: 'Forgive and release old grudges or resentments.',
      ar: 'سامح وأطلق الأحقاد أو المرارات القديمة.',
      ckb: 'لە خۆت ببورە و ڕق و ناڕەحەتییە کۆنەکان ئازاد بکە.',
    },
  },
  {
    symbol: {
      fa: 'برف سفید',
      en: 'White snow',
      ar: 'الثلج الأبيض',
      ckb: 'بەفری سپی',
    },
    category: 'nature',
    meaning: {
      fa: 'صفای باطن، ورق خوردن صفحه‌ای نو و آرامش پس از یک دوره پرتنش.',
      en: 'Inner purity, a new page turning, and calm after a tense period.',
      ar: 'صفاء الباطن، وقلب صفحة جديدة، والهدوء بعد فترة متوترة.',
      ckb: 'پاکی ناوەکی، هەڵگەڕانەوەی لاپەڕەیەکی نوێ و ئارامی دوای ماوەیەکی گوشار.',
    },
    advice: {
      fa: 'زمان مناسبی برای برنامه‌ریزی آرام و بدون عجله است.',
      en: 'It is a good time for calm, unhurried planning.',
      ar: 'إنه وقت مناسب للتخطيط الهادئ دون تسرع.',
      ckb: 'کاتی گونجاوە بۆ پلاندانانی ئارام و بێ پەلە.',
    },
  },
  {
    symbol: {
      fa: 'آتش روشن و گرمابخش',
      en: 'Bright, warming fire',
      ar: 'نار مشتعلة ودافئة',
      ckb: 'ئاگرێکی ڕووناک و گەرم',
    },
    category: 'nature',
    meaning: {
      fa: 'بیداری عشق، شور خلاقیت، راهنمایی معنوی و دستیابی به مقام یا موفقیت.',
      en: 'Awakening of love, creative passion, spiritual guidance, and attainment of status or success.',
      ar: 'استيقاظ الحب، وشغف الإبداع، والإرشاد الروحي، وتحقيق المكانة أو النجاح.',
      ckb: 'خەبەربوونەوەی خۆشەویستی، گەرمی داهێنان، ڕێنمایی ڕۆحی و گەیشتن بە پلە یان سەرکەوتن.',
    },
    advice: {
      fa: 'انرژی و اشتیاق خود را در مسیر یک هدف مشخص متمرکز کنید.',
      en: 'Focus your energy and passion toward one clear goal.',
      ar: 'ركّز طاقتك وشغفك نحو هدف واحد واضح.',
      ckb: 'وزە و گەرمیت لە یەک ئامانجی دیاریکراودا کۆبکەرەوە.',
    },
  },
  {
    symbol: {
      fa: 'آتش‌سوزی و دود غلیظ',
      en: 'Wildfire and thick smoke',
      ar: 'حريق ودخان كثيف',
      ckb: 'ئاگرسووتان و دووکەڵی چڕ',
    },
    category: 'nature',
    meaning: {
      fa: 'هشداری درباره خشم ناگهانی، بحث‌های بی‌فایده یا اتلاف انرژی در موضوعات حاشیه‌ای.',
      en: 'A warning about sudden anger, futile arguments, or wasting energy on trivial matters.',
      ar: 'تحذير من الغضب المفاجئ، أو الجدالات العقيمة، أو إهدار الطاقة في أمور هامشية.',
      ckb: 'ئاگادارکردنەوە لە تووڕەیی لەناکاو، مشتومڕی بێسوود یان بەفیڕۆدانی وزە لە بابەتی لاوەکی.',
    },
    advice: {
      fa: 'در گفتگوهای حساس، آرامش کلامی خود را حفظ نمایید.',
      en: 'Maintain verbal calm in sensitive conversations.',
      ar: 'حافظ على هدوئك اللفظي في المحادثات الحساسة.',
      ckb: 'لە گفتوگۆ ھەستیارەکاندا ئارامی قسەت بپارێزە.',
    },
  },
  {
    symbol: {
      fa: 'درخت سبز و پرثمر',
      en: 'Green, fruitful tree',
      ar: 'شجرة خضراء مثمرة',
      ckb: 'درەختێکی سەوز و بەردار',
    },
    category: 'nature',
    meaning: {
      fa: 'استحکام بنیان خانواده، رشد مالی پایدار، سلامتی و به ثمر نشستن تلاش‌های طولانی‌مدت.',
      en: 'A strong family foundation, sustainable financial growth, health, and long-term efforts bearing fruit.',
      ar: 'قوة أساس الأسرة، ونمو مالي مستدام، وصحة، وثمار الجهود طويلة الأمد.',
      ckb: 'بەهێزی بناغەی خێزان، گەشەی دارایی بەردەوام، تەندروستی و بەرھەمھێنانی ھەوڵە درێژخایەنەکان.',
    },
    advice: {
      fa: 'قدردان ریشه‌ها و حمایت‌های اطرافیان خود باشید.',
      en: 'Be grateful for your roots and the support of those around you.',
      ar: 'كن ممتنًا لجذورك ودعم من حولك.',
      ckb: 'سوپاسگوزار بە بۆ ڕەگ و پشتیوانی دەوروبەرت.',
    },
  },
  {
    symbol: {
      fa: 'باغ پر از گل و شکوفه',
      en: 'Garden full of flowers and blossoms',
      ar: 'حديقة مليئة بالزهور والأزهار',
      ckb: 'باخێک پڕ لە گوڵ و شکۆفە',
    },
    category: 'nature',
    meaning: {
      fa: 'شادی قلبی، شنیدن خبر خوش، شکوفایی یک رابطه عاطفی و کامیابی.',
      en: 'Heartfelt joy, hearing good news, the blossoming of a romantic relationship, and success.',
      ar: 'فرح قلبي، وسماع خبر سار، وازدهار علاقة عاطفية، والنجاح.',
      ckb: 'خۆشی دڵ، بیستنی ھەواڵی خۆش، شکاندنی پەیوەندییەکی سۆزداری و سەرکەوتن.',
    },
    advice: {
      fa: 'زیبایی‌های لحظه حال را جشن بگیرید.',
      en: 'Celebrate the beauties of the present moment.',
      ar: 'احتفل بجمال اللحظة الحاضرة.',
      ckb: 'جەژن بۆ جوانییەکانی ساتە ئێستاکە بگێڕە.',
    },
  },
  {
    symbol: {
      fa: 'کوه بلند و صعود به قله',
      en: 'Tall mountain and climbing to the summit',
      ar: 'جبل شاهق والصعود إلى القمة',
      ckb: 'شاخێکی بەرز و سەرکەوتن بۆ لووتکە',
    },
    category: 'nature',
    meaning: {
      fa: 'غلبه بر موانع بزرگ، رسیدن به جایگاه رفیع شغلی یا اجتماعی و اراده استوار.',
      en: 'Overcoming major obstacles, reaching a high professional or social position, and firm willpower.',
      ar: 'التغلب على العقبات الكبرى، والوصول إلى مكانة مهنية أو اجتماعية رفيعة، وإرادة راسخة.',
      ckb: 'زاڵبوون بەسەر بەربەستە گەورەکان، گەیشتن بە پلەی بەرزی پیشەیی یان کۆمەڵایەتی و ئیرادەی بەھێز.',
    },
    advice: {
      fa: 'پشتکار خود را حفظ کنید؛ قله بسیار نزدیک است.',
      en: 'Keep up your perseverance; the summit is very close.',
      ar: 'حافظ على مثابرتك؛ القمة قريبة جدًا.',
      ckb: 'بەردەوام بە لە کۆششەکەت؛ لووتکە زۆر نزیکە.',
    },
  },
  {
    symbol: {
      fa: 'خورشید درخشان',
      en: 'Radiant sun',
      ar: 'شمس مشرقة',
      ckb: 'خۆری درەوشاوە',
    },
    category: 'nature',
    meaning: {
      fa: 'آگاهی کامل، پیروزی، حمایت از سوی افراد صاحب‌نفوذ و روشن شدن حقیقت.',
      en: 'Full awareness, victory, support from influential people, and the truth coming to light.',
      ar: 'وعي كامل، وانتصار، ودعم من أصحاب النفوذ، وظهور الحقيقة.',
      ckb: 'ئاگایی تەواو، سەرکەوتن، پشتیوانی لە لایەن کەسانی دەسەڵاتدار و ئاشکرابوونی ڕاستی.',
    },
    advice: {
      fa: 'با اعتمادبه‌نفس کامل ایده‌های خود را مطرح کنید.',
      en: 'Present your ideas with full confidence.',
      ar: 'اطرح أفكارك بثقة تامة.',
      ckb: 'بیرۆکەکانت بە متمانەی تەواو بخەرە ڕوو.',
    },
  },
  {
    symbol: {
      fa: 'ماه کامل (بدر) در آسمان شب',
      en: 'Full moon in the night sky',
      ar: 'البدر في سماء الليل',
      ckb: 'مانگی تەواو لە ئاسمانی شەودا',
    },
    category: 'nature',
    meaning: {
      fa: 'اوج شهود، وصال عاطفی، تکمیل یک چرخه مهم و دریافت الهامات قلبی.',
      en: 'Peak intuition, emotional union, completion of an important cycle, and receiving heart inspirations.',
      ar: 'ذروة الحدس، والوصال العاطفي، واكتمال دورة مهمة، وتلقي إلهامات القلب.',
      ckb: 'لوتکەی ھەستیاری، یەکگەیشتنی سۆزداری، تەواوبوونی چرخەیەکی گرنگ و وەرگرتنی ئیلھامی دڵ.',
    },
    advice: {
      fa: 'به ندای قلب و خواب‌های این دوره توجه ویژه داشته باشید.',
      en: 'Pay special attention to your heart’s call and the dreams of this period.',
      ar: 'أولِ اهتمامًا خاصًا لنداء قلبك وأحلام هذه الفترة.',
      ckb: 'سەرنجی تایبەت بدە بە بانگی دڵت و خەونەکانی ئەم ماوەیە.',
    },
  },
  {
    symbol: {
      fa: 'ستارگان درخشان',
      en: 'Bright stars',
      ar: 'نجوم ساطعة',
      ckb: 'ئەستێرە درەوشاوەکان',
    },
    category: 'nature',
    meaning: {
      fa: 'امید، هدایت کیهانی، بخت بلند و تحقق آرزوهای دور.',
      en: 'Hope, cosmic guidance, high fortune, and the fulfillment of distant wishes.',
      ar: 'أمل، وإرشاد كوني، وحظ سعيد، وتحقق الأمنيات البعيدة.',
      ckb: 'ئومێد، ڕێنمایی گەردوونی، بەختێکی بەرز و بەدیھاتنی ئاواتە دوورەکان.',
    },
    advice: {
      fa: 'اهداف بزرگ خود را فراموش نکنید.',
      en: 'Do not forget your big goals.',
      ar: 'لا تنسَ أهدافك الكبيرة.',
      ckb: 'ئامانجە گەورەکانت لەبیر مەکە.',
    },
  },
  {
    symbol: {
      fa: 'رنگین‌کمان',
      en: 'Rainbow',
      ar: 'قوس قزح',
      ckb: 'پەلکەزێڕینە',
    },
    category: 'nature',
    meaning: {
      fa: 'پیمان صلح، پایان سختی‌ها، امید تازه و رخدادی معجزه‌آسا و شادی‌بخش.',
      en: 'A covenant of peace, the end of hardships, fresh hope, and a miraculous, joyful event.',
      ar: 'عهد سلام، ونهاية المشقات، وأمل جديد، وحدث معجز ومبهج.',
      ckb: 'پەیمانی ئاشتی، کۆتایی سەختییەکان، ئومێدی نوێ و ڕووداوێکی موعجیزەئاسا و خۆشحاڵ.',
    },
    advice: {
      fa: 'منتظر خبری خوشایند باشید.',
      en: 'Expect pleasant news.',
      ar: 'انتظر خبرًا سارًا.',
      ckb: 'چاوەڕوانی ھەواڵێکی خۆش بە.',
    },
  },

  // ── پرواز و حرکت ───────────────────────────────────────────
  {
    symbol: {
      fa: 'پرواز در آسمان',
      en: 'Flying in the sky',
      ar: 'الطيران في السماء',
      ckb: 'فڕین لە ئاسماندا',
    },
    category: 'flight',
    meaning: {
      fa: 'رهایی از محدودیت‌ها، رشد معنوی، بلندپروازی موفق و دیدن مسائل از افق بالاتر.',
      en: 'Freedom from limitations, spiritual growth, successful ambition, and seeing issues from a higher horizon.',
      ar: 'التحرر من القيود، والنمو الروحي، والطموح الناجح، ورؤية الأمور من أفق أعلى.',
      ckb: 'ئازادبوون لە سنوورەکان، گەشەی ڕۆحی، ئامانجی بەرزی سەرکەوتوو و بینینی کارەکان لە ئاسۆیەکی بەرزتر.',
    },
    advice: {
      fa: 'از چارچوب‌های محدودکننده قدیمی فراتر بروید.',
      en: 'Move beyond old limiting frameworks.',
      ar: 'تجاوز الأطر المقيدة القديمة.',
      ckb: 'لە چوارچێوە کۆنە سنووردەرەکان تێپەڕە.',
    },
  },
  {
    symbol: {
      fa: 'سقوط از بلندی',
      en: 'Falling from a height',
      ar: 'السقوط من علٍ',
      ckb: 'کەوتن لە بەرزییەوە',
    },
    category: 'flight',
    meaning: {
      fa: 'احساس عدم کنترل موقت، ترس از شکست یا نیاز به واقع‌بینی بیشتر در یک تصمیم.',
      en: 'A temporary sense of losing control, fear of failure, or the need for more realism in a decision.',
      ar: 'إحساس مؤقت بفقدان السيطرة، أو الخوف من الفشل، أو الحاجة إلى مزيد من الواقعية في قرار ما.',
      ckb: 'ھەستی کاتێکی کۆنترۆڵنەکردن، ترس لە شکست یان پێویستی بە واقیعبینی زیاتر لە بڕیارێکدا.',
    },
    advice: {
      fa: 'پایه‌های مالی و کاری خود را محکم‌تر بررسی کنید.',
      en: 'Re-examine your financial and professional foundations more firmly.',
      ar: 'راجع أساساتك المالية والمهنية بقوة أكبر.',
      ckb: 'بناغەکانی دارایی و پیشەیی خۆت بە توندی پێداچوونەوە بکە.',
    },
  },
  {
    symbol: {
      fa: 'دویدن سریع به سوی هدف',
      en: 'Running fast toward a goal',
      ar: 'الركض السريع نحو الهدف',
      ckb: 'ڕاکردنی خێرا بەرەو ئامانج',
    },
    category: 'flight',
    meaning: {
      fa: 'انگیزه بالا، تلاش برای رسیدن به موقعیت بهتر و شتاب در تحقق خواسته.',
      en: 'High motivation, striving for a better position, and urgency in fulfilling a desire.',
      ar: 'دافع قوي، والسعي للوصول إلى وضع أفضل، والتعجيل في تحقيق الرغبة.',
      ckb: 'پاڵنەری بەرز، کۆشش بۆ گەیشتن بە پلەیەکی باشتر و خێرایی لە بەدیھێنانی داواکاری.',
    },
    advice: {
      fa: 'در کنار سرعت، دقت را نیز فراموش نکنید.',
      en: 'Along with speed, do not forget accuracy.',
      ar: 'إلى جانب السرعة، لا تنسَ الدقة.',
      ckb: 'لەگەڵ خێراییدا وردییش لەبیر مەکە.',
    },
  },
  {
    symbol: {
      fa: 'عبور از پل',
      en: 'Crossing a bridge',
      ar: 'عبور الجسر',
      ckb: 'تێپەڕبوون لە پرد',
    },
    category: 'flight',
    meaning: {
      fa: 'گذر موفقیت‌آمیز از یک مرحله زندگی به مرحله‌ای نوین و پشت سر گذاشتن تردیدها.',
      en: 'A successful transition from one life stage to a new one, leaving hesitations behind.',
      ar: 'انتقال ناجح من مرحلة حياتية إلى أخرى جديدة، وترك الترددات خلفك.',
      ckb: 'تێپەڕبوونی سەرکەوتوو لە قۆناغێکی ژیان بۆ قۆناغێکی نوێ و بەجێھێشتنی گومانەکان.',
    },
    advice: {
      fa: 'به گذشته برنگردید و به مسیر جدید متعهد بمانید.',
      en: 'Do not look back and stay committed to the new path.',
      ar: 'لا تنظر إلى الوراء والتزم بالمسار الجديد.',
      ckb: 'بەرەو دواوە مەگەڕێوە و بەرەو ڕێگای نوێ پابەند بە.',
    },
  },
  {
    symbol: {
      fa: 'سفر با کشتی یا قایق',
      en: 'Traveling by ship or boat',
      ar: 'السفر بالسفينة أو القارب',
      ckb: 'سەفەرکردن بە کەشتی یان بەلەم',
    },
    category: 'flight',
    meaning: {
      fa: 'حرکت در بستر احساسات و ناخودآگاه و آغاز یک ماجراجویی تازه در زندگی.',
      en: 'Moving through the realm of emotions and the subconscious, and beginning a new adventure in life.',
      ar: 'التحرك في مجال العواطف واللاوعي، وبدء مغامرة جديدة في الحياة.',
      ckb: 'جووڵە لە ناو جیھانی ھەستیاری و ناخۆشی و دەستپێکردنی سەرکێشییەکی نوێ لە ژیاندا.',
    },
    advice: {
      fa: 'سکان تصمیم‌گیری زندگی خود را با آرامش در دست بگیرید.',
      en: 'Take the helm of your life’s decisions calmly.',
      ar: 'أمسك بدفة قرارات حياتك بهدوء.',
      ckb: 'بە ئارامی سەرکەشتی بڕیاردان لە ژیانت بگرە دەست.',
    },
  },
  {
    symbol: {
      fa: 'بالا رفتن از پله‌ها',
      en: 'Climbing stairs',
      ar: 'صعود الدرج',
      ckb: 'سەرکەوتن لە پەلەکان',
    },
    category: 'flight',
    meaning: {
      fa: 'ترقی گام‌به‌گام، افزایش آگاهی و ارتقای مرتبه شغلی یا علمی.',
      en: 'Step-by-step progress, increased awareness, and promotion in career or academics.',
      ar: 'تقدم خطوة بخطوة، وزيادة الوعي، والترقي المهني أو العلمي.',
      ckb: 'پێشکەوتنی ھەنگاو بە ھەنگاو، زیادبوونی ئاگایی و بەرزبوونەوەی پلەی پیشەیی یان زانستی.',
    },
    advice: {
      fa: 'به رشد تدریجی و مستمر خود ادامه دهید.',
      en: 'Continue your gradual and steady growth.',
      ar: 'واصل نموك التدريجي والمستمر.',
      ckb: 'بەردەوام بە لە گەشەی ھەنگاو بە ھەنگاو و بەردەوامی خۆت.',
    },
  },

  // ── حیوانات ────────────────────────────────────────────────
  {
    symbol: {
      fa: 'اسب اصیل و نجیب',
      en: 'Noble, purebred horse',
      ar: 'حصان أصيل ونبيل',
      ckb: 'ئەسپێکی ڕەگەز و بەڕێز',
    },
    category: 'animals',
    meaning: {
      fa: 'شرافت، قدرت، آزادی، پیروزی و همراهی یک دوست یا شریک وفادار.',
      en: 'Honor, power, freedom, victory, and the companionship of a loyal friend or partner.',
      ar: 'الشرف، والقوة، والحرية، والانتصار، ورفقة صديق أو شريك مخلص.',
      ckb: 'شەرەف، ھێز، ئازادی، سەرکەوتن و یاوەری ھاوڕێ یان ھاوبەشێکی دڵسۆز.',
    },
    advice: {
      fa: 'نیروی درونی خود را با خرد هدایت کنید.',
      en: 'Guide your inner strength with wisdom.',
      ar: 'وجّه قوتك الداخلية بالحكمة.',
      ckb: 'ھێزی ناوەکی خۆت بە دانایی بەڕێوە ببە.',
    },
  },
  {
    symbol: {
      fa: 'پرنده سفید یا کبوتر',
      en: 'White bird or dove',
      ar: 'طائر أبيض أو حمامة',
      ckb: 'باڵندەیەکی سپی یان کۆتر',
    },
    category: 'animals',
    meaning: {
      fa: 'پیام‌آور صلح، خبر خوش از راه دور، آزادی روح و آرامش در خانه.',
      en: 'A messenger of peace, good news from afar, freedom of spirit, and peace at home.',
      ar: 'رسول السلام، وخبر سار من بعيد، وحرية الروح، والسلام في البيت.',
      ckb: 'پەیامبەری ئاشتی، ھەواڵی خۆش لە دوورەوە، ئازادی ڕۆح و ئارامی لە ماڵەوە.',
    },
    advice: {
      fa: 'آماده دریافت پیامی محبت‌آمیز باشید.',
      en: 'Be ready to receive a loving message.',
      ar: 'كن مستعدًا لتلقي رسالة محبة.',
      ckb: 'ئامادە بە بۆ وەرگرتنی پەیامێکی خۆشەویستی.',
    },
  },
  {
    symbol: {
      fa: 'عقاب در حال پرواز',
      en: 'Eagle in flight',
      ar: 'نسر في طيرانه',
      ckb: 'ھەڵۆیەک لە فڕیندا',
    },
    category: 'animals',
    meaning: {
      fa: 'بصیرت تیزبین، اقتدار، موفقیت کلان و دستیابی به اهداف بزرگ.',
      en: 'Sharp insight, authority, major success, and achieving big goals.',
      ar: 'بصيرة ثاقبة، وسلطة، ونجاح كبير، وتحقيق أهداف عظيمة.',
      ckb: 'بینینی تیژ، دەسەڵات، سەرکەوتنی گەورە و گەیشتن بە ئامانجە گەورەکان.',
    },
    advice: {
      fa: 'تمرکز خود را بر هدف اصلی حفظ کنید.',
      en: 'Keep your focus on the main goal.',
      ar: 'حافظ على تركيزك على الهدف الرئيسي.',
      ckb: 'سەرنجت لەسەر ئامانجی سەرەکی بپارێزە.',
    },
  },
  {
    symbol: {
      fa: 'ماهی در آب زلال',
      en: 'Fish in clear water',
      ar: 'سمكة في ماء صافٍ',
      ckb: 'ماسی لە ئاوی ڕووندا',
    },
    category: 'animals',
    meaning: {
      fa: 'رزق و روزی فراوان، برکت مالی، باروری ایده‌ها و شانس نیک.',
      en: 'Abundant provision, financial blessing, fertile ideas, and good luck.',
      ar: 'رزق وفير، وبركة مالية، وخصوبة الأفكار، وحظ سعيد.',
      ckb: 'ڕزق و ڕۆزیی زۆر، بەرەکەتی دارایی، بەپیتی بیرۆکەکان و بەختێکی باش.',
    },
    advice: {
      fa: 'از فرصت‌های اقتصادی پیش رو به خوبی بهره ببرید.',
      en: 'Make good use of upcoming economic opportunities.',
      ar: 'استفد جيدًا من الفرص الاقتصادية القادمة.',
      ckb: 'بە باشی سوود لە دەرفەتە ئابوورییەکانی پێشەوە ببینە.',
    },
  },
  {
    symbol: {
      fa: 'مار (بدون آسیب)',
      en: 'Snake (without harm)',
      ar: 'ثعبان (دون أذى)',
      ckb: 'مار (بێ زیان)',
    },
    category: 'animals',
    meaning: {
      fa: 'در نمادشناسی کهن نشانه دگرگونی، پوست‌اندازی روحی، شفا و بیداری انرژی حیات است؛ و در سنت عامه هشدار به هوشیاری در برابر رقیب.',
      en: 'In ancient symbolism it signifies transformation, spiritual shedding, healing, and awakening of life energy; in folk tradition it warns to stay alert against a rival.',
      ar: 'في الرمزية القديمة تدل على التحول، والتخلص الروحي، والشفاء، واستيقاظ طاقة الحياة؛ وفي التقاليد الشعبية تحذر من اليقظة تجاه منافس.',
      ckb: 'لە ھێمازانینی کۆندا نیشانەی گۆڕانکاری، پێستھەڵوەشاندنەوەی ڕۆحی، چاکبوونەوە و خەبەربوونەوەی وزەی ژیانە؛ لە دابونەریتی گشتیدا ئاگادارکردنەوەیە بۆ وریایی لە بەرامبەر ڕکابەرێک.',
    },
    advice: {
      fa: 'در عین خوش‌بینی، اسرار مهم خود را نزد هر کسی فاش نکنید.',
      en: 'While staying optimistic, do not reveal your important secrets to just anyone.',
      ar: 'مع تفاؤلك، لا تفشِ أسرارك المهمة لأي أحد.',
      ckb: 'لەگەڵ گەشبینیدا، نهێنییە گرنگەکانت بۆ ھەموو کەسێک ئاشکرا مەکە.',
    },
  },
  {
    symbol: {
      fa: 'شیر مقتدر',
      en: 'Powerful lion',
      ar: 'أسد قوي',
      ckb: 'شێرێکی بەھێز',
    },
    category: 'animals',
    meaning: {
      fa: 'شجاعت، رهبری، غلبه بر ترس‌ها و حمایت از سوی فردی قدرتمند.',
      en: 'Courage, leadership, overcoming fears, and support from a powerful person.',
      ar: 'الشجاعة، والقيادة، والتغلب على المخاوف، والدعم من شخص قوي.',
      ckb: 'ئازایەتی، سەرکردایەتی، زاڵبوون بەسەر ترسەکان و پشتیوانی لە لایەن کەسێکی بەھێزەوە.',
    },
    advice: {
      fa: 'با شجاعت از حق و جایگاه خود دفاع کنید.',
      en: 'Defend your rights and position with courage.',
      ar: 'دافع عن حقك ومكانتك بشجاعة.',
      ckb: 'بە ئازایەتی بەرگری لە ماف و پلەکەت بکە.',
    },
  },
  {
    symbol: {
      fa: 'پروانه رنگارنگ',
      en: 'Colorful butterfly',
      ar: 'فراشة ملونة',
      ckb: 'پەپوولەیەکی ڕەنگاوڕەنگ',
    },
    category: 'animals',
    meaning: {
      fa: 'تحول زیبای درونی، رهایی از پیله غم و آغاز فصلی لطیف و عاشقانه.',
      en: 'Beautiful inner transformation, freedom from the cocoon of sorrow, and the start of a tender, romantic season.',
      ar: 'تحول داخلي جميل، والتحرر من شرنقة الحزن، وبداية موسم رقيق وعاشق.',
      ckb: 'گۆڕانکارییەکی جوانی ناوەکی، ئازادبوون لە قۆناغی خەم و دەستپێکی وەرزێکی نەرم و ئاشقانە.',
    },
    advice: {
      fa: 'تغییرات مثبت زندگی را با شادی بپذیرید.',
      en: 'Welcome positive life changes with joy.',
      ar: 'استقبل تغييرات الحياة الإيجابية بفرح.',
      ckb: 'گۆڕانکارییە ئەرێنییەکانی ژیان بە خۆشی پێشوازی لێ بکە.',
    },
  },
  {
    symbol: {
      fa: 'گربه آرام',
      en: 'Calm cat',
      ar: 'قطة هادئة',
      ckb: 'پشیلەیەکی ھێمن',
    },
    category: 'animals',
    meaning: {
      fa: 'شهود زنانه، استقلال، رازآلودگی و نیاز به توجه به حس ششم.',
      en: 'Feminine intuition, independence, mystery, and the need to heed the sixth sense.',
      ar: 'حدس أنثوي، واستقلالية، وغموض، والحاجة إلى الانتباه للحاسة السادسة.',
      ckb: 'ھەستیاریی مێینە، سەربەخۆیی، نهێنی و پێویستی بە سەرنجدان بە ھەستی شەشەم.',
    },
    advice: {
      fa: 'به ندای شهود و حس درونی خود اعتماد کنید.',
      en: 'Trust the call of your intuition and inner sense.',
      ar: 'ثق بنداء حدسك وإحساسك الداخلي.',
      ckb: 'باوەڕ بە بانگی ھەستیاری و ھەستی ناوەکی خۆت بکە.',
    },
  },
  {
    symbol: {
      fa: 'سگ وفادار',
      en: 'Loyal dog',
      ar: 'كلب مخلص',
      ckb: 'سەگێکی دڵسۆز',
    },
    category: 'animals',
    meaning: {
      fa: 'دوستی صادقانه، محافظت، وفاداری در رابطه و امنیت.',
      en: 'Sincere friendship, protection, loyalty in relationships, and security.',
      ar: 'صداقة صادقة، وحماية، ووفاء في العلاقة، وأمان.',
      ckb: 'دۆستی ڕاستگۆ، پاراستن، دڵسۆزی لە پەیوەندیدا و ئاسایش.',
    },
    advice: {
      fa: 'قدر دوستان صمیمی و وفادار خود را بدانید.',
      en: 'Appreciate your close, loyal friends.',
      ar: 'قدّر أصدقاءك المقربين المخلصين.',
      ckb: 'نرخی ھاوڕێ نزیک و دڵسۆزەکانت بزانە.',
    },
  },
  {
    symbol: {
      fa: 'زنبور عسل',
      en: 'Honeybee',
      ar: 'نحلة العسل',
      ckb: 'ھەنگوینی ھەنگ',
    },
    category: 'animals',
    meaning: {
      fa: 'تلاش جمعی پرثمر، شیرینی حاصل از کار و برکت مالی.',
      en: 'Fruitful collective effort, the sweetness of work, and financial blessing.',
      ar: 'جهد جماعي مثمر، وحلاوة العمل، وبركة مالية.',
      ckb: 'کۆششی کۆمەڵایەتی بەرھەمدار، شیرینی کاری و بەرەکەتی دارایی.',
    },
    advice: {
      fa: 'ثمره شیرین تلاش‌هایتان به زودی آشکار می‌شود.',
      en: 'The sweet fruit of your efforts will soon appear.',
      ar: 'ثمرة جهودك الحلوة ستظهر قريبًا.',
      ckb: 'بەرھەمی شیرینی کۆششەکانت بەم زووانە دەردەکەوێت.',
    },
  },

  // ── اشیاء و مکان‌ها ─────────────────────────────────────────
  {
    symbol: {
      fa: 'کلید طلایی یا باز کردن قفل',
      en: 'Golden key or unlocking a lock',
      ar: 'مفتاح ذهبي أو فتح قفل',
      ckb: 'کلیلی زێڕین یان کردنەوەی قفڵ',
    },
    category: 'objects',
    meaning: {
      fa: 'گشایش کارهای بسته، یافتن راه‌حل قطعی برای یک معما و ورود به موقعیت جدید.',
      en: 'Opening closed matters, finding a definitive solution to a puzzle, and entering a new situation.',
      ar: 'انفتاح الأمور المغلقة، وإيجاد حل قاطع للغز، ودخول وضع جديد.',
      ckb: 'کردنەوەی کارە داخراوەکان، دۆزینەوەی چارەسەرییەکی قەتعی بۆ مەتەڵێک و چوونە ناو بارودۆخێکی نوێ.',
    },
    advice: {
      fa: 'اقدام عملی را آغاز کنید؛ راه باز شده است.',
      en: 'Take practical action; the way is open.',
      ar: 'ابدأ بالعمل العملي؛ فالطريق مفتوح.',
      ckb: 'دەست بە کرداری کردەیی بکە؛ ڕێگا کراوەتەوە.',
    },
  },
  {
    symbol: {
      fa: 'آینه شفاف',
      en: 'Clear mirror',
      ar: 'مرآة صافية',
      ckb: 'ئاوێنەیەکی ڕوون',
    },
    category: 'objects',
    meaning: {
      fa: 'خودشناسی، روبرو شدن با حقیقت درون، صداقت و روشن شدن نیت‌ها.',
      en: 'Self-knowledge, facing inner truth, honesty, and intentions becoming clear.',
      ar: 'معرفة الذات، ومواجهة الحقيقة الداخلية، والصدق، ووضوح النوايا.',
      ckb: 'ناسینی خۆ، ڕووبەڕووبوونەوەی ڕاستی ناوەکی، ڕاستگۆیی و ئاشکرابوونی نیەتەکان.',
    },
    advice: {
      fa: 'با خودتان کاملاً صادق و روراست باشید.',
      en: 'Be completely honest and straightforward with yourself.',
      ar: 'كن صادقًا ومباشرًا تمامًا مع نفسك.',
      ckb: 'بە تەواوی ڕاستگۆ و ڕوون بە لەگەڵ خۆتدا.',
    },
  },
  {
    symbol: {
      fa: 'خانه نو و روشن',
      en: 'New, bright home',
      ar: 'بيت جديد ومشرق',
      ckb: 'ماڵێکی نوێ و ڕووناک',
    },
    category: 'objects',
    meaning: {
      fa: 'امنیت خاطر، ارتقای سطح زندگی، ازدواج یا آرامش در کانون خانواده.',
      en: 'Peace of mind, an upgrade in living standards, marriage, or harmony in the family.',
      ar: 'راحة البال، والارتقاء بمستوى المعيشة، أو الزواج، أو الهدوء في كنف الأسرة.',
      ckb: 'ئارامی دڵ، بەرزبوونەوەی ئاستی ژیان، ھاوسەرگیری یان ئارامی لە ناو خێزاندا.',
    },
    advice: {
      fa: 'فضای زندگی و ذهن خود را سرشار از نور و نظم کنید.',
      en: 'Fill your living space and mind with light and order.',
      ar: 'املأ مساحة معيشتك وعقلك بالنور والنظام.',
      ckb: 'شوێنی ژیان و مێشکی خۆت پڕ بکە لە ڕووناکی و ڕێکخستن.',
    },
  },
  {
    symbol: {
      fa: 'اتاق پنهان در خانه',
      en: 'Hidden room in the house',
      ar: 'غرفة خفية في المنزل',
      ckb: 'ژوورێکی نەھێنی لە ماڵەوە',
    },
    category: 'objects',
    meaning: {
      fa: 'کشف استعدادی ناشناخته در درون خود که تاکنون از آن بهره نبرده‌اید.',
      en: 'Discovering an unknown talent within yourself that you have not yet used.',
      ar: 'اكتشاف موهبة مجهولة بداخلك لم تستفد منها بعد.',
      ckb: 'دۆزینەوەی بەھرەیەکی نەناسراو لە ناخی خۆت کە تا ئێستا سوودت لێ نەبینێوە.',
    },
    advice: {
      fa: 'به توانایی‌های خلاقانه جدید خود میدان بدهید.',
      en: 'Give space to your new creative abilities.',
      ar: 'أفسح المجال لقدراتك الإبداعية الجديدة.',
      ckb: 'شوێن بدە بە تواناکانی داهێنەرانەی نوێی خۆت.',
    },
  },
  {
    symbol: {
      fa: 'انگشتر یا حلقه جواهر',
      en: 'Ring or jeweled band',
      ar: 'خاتم أو حلقة مرصعة',
      ckb: 'ئەنگوستیلە یان بازنەی گەوھەر',
    },
    category: 'objects',
    meaning: {
      fa: 'پیمان، تعهد عاطفی، ازدواج، یا امضای یک قرارداد مهم و ماندگار.',
      en: 'A covenant, emotional commitment, marriage, or signing an important, lasting contract.',
      ar: 'عهد، أو التزام عاطفي، أو زواج، أو توقيع عقد مهم ودائم.',
      ckb: 'پەیمان، پابەندبوونی سۆزداری، ھاوسەرگیری یان واژووکردنی گرێبەستێکی گرنگ و بەردەوام.',
    },
    advice: {
      fa: 'به تعهدات و پیمان‌های قلبی خود وفادار بمانید.',
      en: 'Stay loyal to your heart’s commitments and covenants.',
      ar: 'ابقَ وفيًا لالتزاماتك وعهودك القلبية.',
      ckb: 'دڵسۆز بە لە پابەندبوون و پەیمانەکانی دڵت.',
    },
  },
  {
    symbol: {
      fa: 'کتاب و مطالعه',
      en: 'Book and studying',
      ar: 'كتاب ودراسة',
      ckb: 'کتێب و خوێندنەوە',
    },
    category: 'objects',
    meaning: {
      fa: 'افزایش خرد، یادگیری درس مهم از تجربیات و دریافت راهنمایی.',
      en: 'Increased wisdom, learning an important lesson from experience, and receiving guidance.',
      ar: 'زيادة الحكمة، وتعلم درس مهم من التجارب، وتلقي الإرشاد.',
      ckb: 'زیادبوونی دانایی، فێربوونی وانەیەکی گرنگ لە ئەزموونەکان و وەرگرتنی ڕێنمایی.',
    },
    advice: {
      fa: 'پیش از تصمیم‌گیری، دانش و آگاهی خود را کامل کنید.',
      en: 'Before deciding, complete your knowledge and awareness.',
      ar: 'قبل اتخاذ القرار، أكمل معرفتك ووعيك.',
      ckb: 'پێش بڕیاردان، زانیاری و ئاگایی خۆت تەواو بکە.',
    },
  },
  {
    symbol: {
      fa: 'ساعت و زمان',
      en: 'Clock and time',
      ar: 'ساعة ووقت',
      ckb: 'کاتژمێر و کات',
    },
    category: 'objects',
    meaning: {
      fa: 'یادآوری اهمیت زمان‌بندی، پایان انتظار و فرارسیدن موعد یک رویداد.',
      en: 'A reminder of the importance of timing, the end of waiting, and the arrival of an event’s due time.',
      ar: 'تذكير بأهمية التوقيت، ونهاية الانتظار، وحلول موعد حدث ما.',
      ckb: 'یادخستنەوەی گرنگی کات، کۆتایی چاوەڕوانی و گەیشتنی کاتی ڕووداوێک.',
    },
    advice: {
      fa: 'فرصت زمان حال را به تعویق نیندازید.',
      en: 'Do not postpone the opportunity of the present moment.',
      ar: 'لا تؤجل فرصة اللحظة الحاضرة.',
      ckb: 'دەرفەتی کاتی ئێستا دوا مەخە.',
    },
  },
  {
    symbol: {
      fa: 'شمع روشن',
      en: 'Lit candle',
      ar: 'شمعة مضاءة',
      ckb: 'مۆمێکی ھەڵگیرساو',
    },
    category: 'objects',
    meaning: {
      fa: 'امید در دل تاریکی، اجابت دعا، آرامش معنوی و هدایت.',
      en: 'Hope in the heart of darkness, answered prayers, spiritual peace, and guidance.',
      ar: 'أمل في قلب الظلام، واستجابة الدعاء، وسلام روحي، وهداية.',
      ckb: 'ئومێد لە ناخی تاریکیدا، وەڵامدانەوەی نوێژ، ئارامی ڕۆحی و ڕێنمایی.',
    },
    advice: {
      fa: 'نیت قلبی خود را با ایمان دنبال کنید.',
      en: 'Pursue your heart’s intention with faith.',
      ar: 'اتبع نية قلبك بإيمان.',
      ckb: 'بە باوەڕ شوێن نیەتی دڵت بکەوە.',
    },
  },
  {
    symbol: {
      fa: 'سکه و طلا',
      en: 'Coins and gold',
      ar: 'عملات وذهب',
      ckb: 'سکە و زێڕ',
    },
    category: 'objects',
    meaning: {
      fa: 'ارزش درونی، کشف فرصت مالی یا یادآوری تعادل میان مادیات و معنویات.',
      en: 'Inner value, discovering a financial opportunity, or a reminder of balance between materialism and spirituality.',
      ar: 'قيمة داخلية، أو اكتشاف فرصة مالية، أو تذكير بالتوازن بين المادية والروحانية.',
      ckb: 'نرخی ناوەکی، دۆزینەوەی دەرفەتێکی دارایی یان یادخستنەوەی ھاوسەنگی لە نێوان ماددی و ڕۆحیدا.',
    },
    advice: {
      fa: 'ارزش واقعی زمان و استعداد خود را بشناسید.',
      en: 'Recognize the true value of your time and talent.',
      ar: 'اعرف القيمة الحقيقية لوقتك وموهبتك.',
      ckb: 'نرخی ڕاستەقینەی کات و بەھرەی خۆت بناسە.',
    },
  },
  {
    symbol: {
      fa: 'لباس نو و آراسته',
      en: 'New, elegant clothes',
      ar: 'ملابس جديدة وأنيقة',
      ckb: 'جلوبەرگی نوێ و ڕازاوە',
    },
    category: 'objects',
    meaning: {
      fa: 'تجدید روحیه، تغییر جایگاه اجتماعی به سمت بهتر و آغاز فصلی شاد.',
      en: 'Renewed spirit, a rise in social status, and the start of a joyful season.',
      ar: 'تجديد الروح، وتغيير المكانة الاجتماعية نحو الأفضل، وبداية موسم مبهج.',
      ckb: 'نوێبوونەوەی ڕۆح، گۆڕانی پلەی کۆمەڵایەتی بەرەو باشتر و دەستپێکی وەرزێکی خۆش.',
    },
    advice: {
      fa: 'تصویر ذهنی خود را نو و شاداب سازید.',
      en: 'Refresh and renew your self-image.',
      ar: 'جدّد صورتك الذهنية واجعلها نضرة.',
      ckb: 'وێنەی دەروونی خۆت نوێ و تازە بکەرەوە.',
    },
  },

  // ── انسان و حالات ──────────────────────────────────────────
  {
    symbol: {
      fa: 'لبخند و خنده از ته دل',
      en: 'Genuine smile and laughter',
      ar: 'ابتسامة وضحك من القلب',
      ckb: 'زەردەخەنە و پێکەنینی لە دڵەوە',
    },
    category: 'human',
    meaning: {
      fa: 'رهایی از فشار روانی، بشارت شادی و هماهنگی در روابط.',
      en: 'Release from psychological pressure, a glad tiding of joy, and harmony in relationships.',
      ar: 'التحرر من الضغط النفسي، وبشرى بالفرح، والتناغم في العلاقات.',
      ckb: 'ئازادبوون لە گوشاری دەروونی، مژدەی خۆشی و ھاوتەریبی لە پەیوەندییەکاندا.',
    },
    advice: {
      fa: 'انرژی مثبت را در محیط خود جاری کنید.',
      en: 'Let positive energy flow in your environment.',
      ar: 'أفِض الطاقة الإيجابية في محيطك.',
      ckb: 'وزەی ئەرێنی بڵاو بکەرەوە لە ژینگەتدا.',
    },
  },
  {
    symbol: {
      fa: 'اشک شوق یا گریه آرام',
      en: 'Tears of joy or quiet weeping',
      ar: 'دموع الفرح أو بكاء هادئ',
      ckb: ' فرمێسکی خۆشی یان گریانێکی ھێمن',
    },
    category: 'human',
    meaning: {
      fa: 'در تعبیر کهن، گریه آرام در خواب نشانه شادی، سبک شدن روح و فرج در بیداری است.',
      en: 'In classical interpretation, quiet weeping in a dream signifies joy, a lighter spirit, and relief in waking life.',
      ar: 'في التعبير القديم، البكاء الهادئ في المنام علامة على الفرح، وخفة الروح، والفرج في اليقظة.',
      ckb: 'لە تعبیرکردنی کۆندا، گریانی ھێمن لە خەودا نیشانەی خۆشی، سووکبوونەوەی ڕۆح و ئاسوودەیی لە بیداریدایە.',
    },
    advice: {
      fa: 'غم‌ها در حال رخت بربستن هستند؛ امیدوار باشید.',
      en: 'Sorrows are departing; stay hopeful.',
      ar: 'الأحزان ترحل؛ ابقَ متفائلًا.',
      ckb: 'خەمەکان بەرەو کۆتایی دەچن؛ ئومێدوار بە.',
    },
  },
  {
    symbol: {
      fa: 'تولد نوزاد',
      en: 'Birth of a baby',
      ar: 'ولادة طفل',
      ckb: 'لەدایکبوونی منداڵ',
    },
    category: 'human',
    meaning: {
      fa: 'تولد یک ایده نو، پروژه‌ای پربرکت، شروعی معصومانه و امید تازه.',
      en: 'The birth of a new idea, a blessed project, an innocent beginning, and fresh hope.',
      ar: 'ولادة فكرة جديدة، ومشروع مبارك، وبداية بريئة، وأمل جديد.',
      ckb: 'لەدایکبوونی بیرۆکەیەکی نوێ، پرۆژەیەکی بەرەکەتدار، دەستپێکی پاک و ئومێدی نوێ.',
    },
    advice: {
      fa: 'از ایده یا مسیر جدید خود با دقت مراقبت کنید.',
      en: 'Care for your new idea or path with care.',
      ar: 'اعتنِ بفكرتك أو مسارك الجديد بعناية.',
      ckb: 'بە وردی ئاگاداری بیرۆکە یان ڕێگای نوێی خۆت بە.',
    },
  },
  {
    symbol: {
      fa: 'دیدار با بزرگِ خردمند یا استاد',
      en: 'Meeting a wise elder or teacher',
      ar: 'لقاء شيخ حكيم أو معلم',
      ckb: 'دیدار لەگەڵ پیرێکی دانا یان مامۆستا',
    },
    category: 'human',
    meaning: {
      fa: 'ارتباط با «خرد برتر» درون، دریافت راهنمایی درست و محافظت معنوی.',
      en: 'Connection with the “higher wisdom” within, receiving right guidance, and spiritual protection.',
      ar: 'الاتصال بالحكمة العليا الداخلية، وتلقي الإرشاد الصحيح، والحماية الروحية.',
      ckb: 'پەیوەندی لەگەڵ «دانایی بەرزتر»ی ناوەکی، وەرگرتنی ڕێنمایی دروست و پاراستنی ڕۆحی.',
    },
    advice: {
      fa: 'به پیام یا سخنی که در خواب شنیده‌اید عمیقاً بیندیشید.',
      en: 'Reflect deeply on the message or words you heard in the dream.',
      ar: 'تأمل بعمق في الرسالة أو الكلمات التي سمعتها في الحلم.',
      ckb: 'بە قووڵی بیر لە پەیام یان قسەکان بکەرەوە کە لە خەودا بیستووتە.',
    },
  },
  {
    symbol: {
      fa: 'ریزش دندان (بدون درد)',
      en: 'Teeth falling out (painless)',
      ar: 'سقوط الأسنان (دون ألم)',
      ckb: 'ڕژانی ددان (بێ ئازار)',
    },
    category: 'human',
    meaning: {
      fa: 'در روانشناسی خواب نشانه گذار از یک دوره سنی به دوره پختگی و رها کردن نگرانی‌های کهنه است.',
      en: 'In dream psychology it signifies a transition from one life stage to maturity and letting go of old worries.',
      ar: 'في علم نفس الأحلام يدل على الانتقال من مرحلة عمرية إلى مرحلة النضج، والتخلي عن الهموم القديمة.',
      ckb: 'لە دەروونناسی خەودا نیشانەی تێپەڕبوونە لە قۆناغێکی تەمەن بۆ قۆناغی پێگەیشتن و ئازادکردنی نیگەرانییە کۆنەکان.',
    },
    advice: {
      fa: 'از تغییرات طبیعی زندگی هراس نداشته باشید.',
      en: 'Do not fear life’s natural changes.',
      ar: 'لا تخف من تغيرات الحياة الطبيعية.',
      ckb: 'لە گۆڕانکارییە سروشتییەکانی ژیان مەترسە.',
    },
  },
  {
    symbol: {
      fa: 'مرگ و تولد دوباره',
      en: 'Death and rebirth',
      ar: 'الموت والولادة من جديد',
      ckb: 'مردن و لەدایکبوونەوە',
    },
    category: 'human',
    meaning: {
      fa: 'پایان یک عادت یا دوره قدیمی و آغاز فصلی کاملاً نوین (طول عمر و تحول).',
      en: 'The end of an old habit or period and the start of a completely new season (longevity and transformation).',
      ar: 'نهاية عادة أو فترة قديمة، وبداية موسم جديد تمامًا (طول العمر والتحول).',
      ckb: 'کۆتایی خوویەک یان ماوەیەکی کۆن و دەستپێکی وەرزێکی تەواو نوێ (درێژەژیان و گۆڕانکاری).',
    },
    advice: {
      fa: 'گذشته تمام‌شده را رها کنید تا فصل جدید آغاز شود.',
      en: 'Release the finished past so the new season can begin.',
      ar: 'أطلق الماضي المنتهي ليبدأ الفصل الجديد.',
      ckb: 'ڕابردووی تەواوبوو ئازاد بکە تا وەرزی نوێ دەست پێ بکات.',
    },
  },

  // ── رنگ و اعداد ────────────────────────────────────────────
  {
    symbol: {
      fa: 'نور سفید یا طلایی درخشان',
      en: 'Radiant white or golden light',
      ar: 'نور أبيض أو ذهبي مشرق',
      ckb: 'ڕووناکی سپی یان زێڕینی درەوشاوە',
    },
    category: 'colors',
    meaning: {
      fa: 'حفاظت الهی، بیداری معنوی، خیر و برکت خالص و گشایش بزرگ.',
      en: 'Divine protection, spiritual awakening, pure goodness and blessing, and a great opening.',
      ar: 'حماية إلهية، وصحوة روحية، وخير وبركة خالصة، وانفتاح كبير.',
      ckb: 'پاراستنی خودایی، خەبەربوونەوەی ڕۆحی، خێر و بەرەکەتی پاک و کردنەوەیەکی گەورە.',
    },
    advice: {
      fa: 'در مسیر درستی گام برمی‌دارید؛ مطمئن باشید.',
      en: 'You are on the right path; be assured.',
      ar: 'أنت على الطريق الصحيح؛ كن مطمئنًا.',
      ckb: 'لە ڕێگای دروستدا دەگەڕێیت؛ دڵنیا بە.',
    },
  },
  {
    symbol: {
      fa: 'رنگ سبز زمردی',
      en: 'Emerald green',
      ar: 'الأخضر الزمردي',
      ckb: 'سەوزی زمورد',
    },
    category: 'colors',
    meaning: {
      fa: 'شفا، سرسبزی، آرامش قلبی، برکت و پیوند با طبیعت.',
      en: 'Healing, verdancy, heart’s peace, blessing, and connection with nature.',
      ar: 'الشفاء، والخضرة، وسلام القلب، والبركة، والاتصال بالطبيعة.',
      ckb: 'چاکبوونەوە، سەوزایی، ئارامی دڵ، بەرەکەت و پەیوەندی لەگەڵ سروشت.',
    },
    advice: {
      fa: 'سلامت جسم و آرامش قلب خود را در اولویت قرار دهید.',
      en: 'Prioritize your physical health and heart’s peace.',
      ar: 'اجعل صحة جسدك وسلام قلبك أولوية.',
      ckb: 'تەندروستی لەش و ئارامی دڵت بخەرە پێشینە.',
    },
  },
  {
    symbol: {
      fa: 'رنگ آبی آسمانی',
      en: 'Sky blue',
      ar: 'الأزرق السماوي',
      ckb: 'شینی ئاسمانی',
    },
    category: 'colors',
    meaning: {
      fa: 'صداقت، آرامش فکری، الهام معنوی و ارتباط شفاف.',
      en: 'Honesty, mental calm, spiritual inspiration, and clear communication.',
      ar: 'الصدق، والهدوء الذهني، والإلهام الروحي، والتواصل الواضح.',
      ckb: 'ڕاستگۆیی، ئارامی فکری، ئیلھامی ڕۆحی و پەیوەندی ڕوون.',
    },
    advice: {
      fa: 'حقیقت درون خود را با آرامش بیان کنید.',
      en: 'Express your inner truth calmly.',
      ar: 'عبّر عن حقيقتك الداخلية بهدوء.',
      ckb: 'ڕاستی ناوەکی خۆت بە ئارامی دەرببڕە.',
    },
  },
  {
    symbol: {
      fa: 'دیدن عدد ۳ یا ۷ در خواب',
      en: 'Seeing the number 3 or 7 in a dream',
      ar: 'رؤية الرقم 3 أو 7 في المنام',
      ckb: 'بینینی ژمارە ٣ یان ٧ لە خەودا',
    },
    category: 'colors',
    meaning: {
      fa: 'نشانه تکمیل چرخه، هماهنگی ذهن و روح، و فرارسیدن زمان نتیجه.',
      en: 'A sign of cycle completion, harmony of mind and spirit, and the time of results arriving.',
      ar: 'علامة على اكتمال الدورة، وتناغم العقل والروح، وحلول وقت النتائج.',
      ckb: 'نیشانەی تەواوبوونی چرخە، ھاوتەریبی مێشک و ڕۆح و گەیشتنی کاتی ئەنجام.',
    },
    advice: {
      fa: 'به نشانه‌های هم‌زمانی در بیداری دقت کنید.',
      en: 'Pay attention to synchronicity signs in waking life.',
      ar: 'انتبه لعلامات التزامن في اليقظة.',
      ckb: 'سەرنج بدە بە نیشانەکانی ھاوکاتبوون لە بیداریدا.',
    },
  },
];

/* ============================================================
 *  RUNES
 * ============================================================ */

export type RuneElementKey = 'fire' | 'earth' | 'air' | 'water';

export const RUNE_ELEMENT_LABELS: Record<RuneElementKey, Record<AppLanguage, string>> = {
  fire: { fa: 'آتش', en: 'Fire', ar: 'النار', ckb: 'ئاگر' },
  earth: { fa: 'خاک', en: 'Earth', ar: 'التراب', ckb: 'خاک' },
  air: { fa: 'باد', en: 'Air', ar: 'الهواء', ckb: 'با' },
  water: { fa: 'آب', en: 'Water', ar: 'الماء', ckb: 'ئاو' },
};

export interface RuneEntry {
  index: number;
  glyph: string;
  nameEn: string;
  name: Record<AppLanguage, string>;
  element: RuneElementKey;
  keywords: Record<AppLanguage, string[]>;
  meaning: Record<AppLanguage, string>;
  advice: Record<AppLanguage, string>;
}

export const ELDER_FUTHARK_RUNES: RuneEntry[] = [
  {
    index: 0,
    glyph: 'ᚠ',
    nameEn: 'Fehu',
    name: {
      fa: 'فهو (فراوانی و ثروت)',
      en: 'Fehu (Abundance & Wealth)',
      ar: 'فيهو (الوفرة والثروة)',
      ckb: 'فیھو (زۆری و دەوڵەمەندی)',
    },
    element: 'fire',
    keywords: {
      fa: ['ثروت', 'برکت', 'کامیابی'],
      en: ['Wealth', 'Blessing', 'Success'],
      ar: ['ثروة', 'بركة', 'نجاح'],
      ckb: ['دەوڵەمەندی', 'بەرەکەت', 'سەرکەوتن'],
    },
    meaning: {
      fa: 'نماد گشایش مالی، به ثمر نشستن تلاش‌ها و ورود جریان فراوانی به زندگی شماست.',
      en: 'A symbol of financial opening, efforts bearing fruit, and the flow of abundance entering your life.',
      ar: 'رمز الانفتاح المالي، وإثمار الجهود، ودخول تدفق الوفرة إلى حياتك.',
      ckb: 'نیشانەی کردنەوەی دارایی، بەرھەمھێنانی کۆششەکان و چوونەژوورەوەی ڕەوتی زۆری بۆ ژیانت.',
    },
    advice: {
      fa: 'قدردان دارایی‌های خود باشید و با سخاوت بخشی از برکت را به گردش درآورید.',
      en: 'Be grateful for your assets and generously circulate part of the blessing.',
      ar: 'كن ممتنًا لأصولك، وأدِر جزءًا من البركة بسخاء.',
      ckb: 'سوپاسگوزار بە بۆ سەروەتەکانت و بە دەستبەرداری بەشێک لە بەرەکەت بەکار بێنە.',
    },
  },
  {
    index: 1,
    glyph: 'ᚢ',
    nameEn: 'Uruz',
    name: {
      fa: 'اوروز (نیروی حیات)',
      en: 'Uruz (Life Force)',
      ar: 'أوروز (قوة الحياة)',
      ckb: 'ئوروز (ھێزی ژیان)',
    },
    element: 'earth',
    keywords: {
      fa: ['قدرت', 'سلامتی', 'اراده'],
      en: ['Power', 'Health', 'Will'],
      ar: ['قوة', 'صحة', 'إرادة'],
      ckb: ['ھێز', 'تەندروستی', 'ئیرادە'],
    },
    meaning: {
      fa: 'نشانه استقامت بدنی و روحی، شفا، شجاعت درونی و عبور استوار از چالش‌هاست.',
      en: 'A sign of physical and spiritual endurance, healing, inner courage, and steadfast passage through challenges.',
      ar: 'علامة على التحمل الجسدي والروحي، والشفاء، والشجاعة الداخلية، والعبور الثابت عبر التحديات.',
      ckb: 'نیشانەی خۆڕاگری لەش و ڕۆح، چاکبوونەوە، ئازایەتی ناوەکی و تێپەڕبوونی دامەزراو بەسەر تەحەددیەکاندا.',
    },
    advice: {
      fa: 'به قدرت درونی خود تکیه کنید؛ شما بسیار قوی‌تر از موانع هستید.',
      en: 'Rely on your inner power; you are far stronger than the obstacles.',
      ar: 'اعتمد على قوتك الداخلية؛ أنت أقوى بكثير من العقبات.',
      ckb: 'پشت بە ھێزی ناوەکی خۆت ببەستە؛ تۆ زۆر بەھێزتریت لە بەربەستەکان.',
    },
  },
  {
    index: 2,
    glyph: 'ᚦ',
    nameEn: 'Thurisaz',
    name: {
      fa: 'توریساز (حفاظت و مرز)',
      en: 'Thurisaz (Protection & Boundaries)',
      ar: 'ثوريساز (الحماية والحدود)',
      ckb: 'ثوریساز (پاراستن و سنوور)',
    },
    element: 'fire',
    keywords: {
      fa: ['محافظت', 'مرزبندی', 'تامل'],
      en: ['Protection', 'Boundaries', 'Reflection'],
      ar: ['حماية', 'حدود', 'تأمل'],
      ckb: ['پاراستن', 'سنووردانان', 'بیرکردنەوە'],
    },
    meaning: {
      fa: 'نماد سپر دفاعی، هوشیاری در برابر تصمیمات عجولانه و تعیین مرزهای سالم است.',
      en: 'A symbol of defensive shield, alertness against hasty decisions, and setting healthy boundaries.',
      ar: 'رمز الدرع الدفاعي، واليقظة تجاه القرارات المتسرعة، ووضع حدود صحية.',
      ckb: 'نیشانەی قەڵغانی بەرگری، وریایی لە بڕیارە پەلەپەلەکان و دانانی سنووری تەندروست.',
    },
    advice: {
      fa: 'پیش از اقدام، شرایط را بسنجید و مرزهای شخصی خود را حفظ کنید.',
      en: 'Before acting, assess the situation and maintain your personal boundaries.',
      ar: 'قبل التصرف، قيّم الموقف وحافظ على حدودك الشخصية.',
      ckb: 'پێش کردار، بارودۆخ بسەنگێنە و سنوورە کەسییەکانت بپارێزە.',
    },
  },
  {
    index: 3,
    glyph: 'ᚨ',
    nameEn: 'Ansuz',
    name: {
      fa: 'آنسوز (پیام و خرد)',
      en: 'Ansuz (Message & Wisdom)',
      ar: 'أنسوز (الرسالة والحكمة)',
      ckb: 'ئانسوز (پەیام و دانایی)',
    },
    element: 'air',
    keywords: {
      fa: ['الهام', 'کلام', 'خرد'],
      en: ['Inspiration', 'Speech', 'Wisdom'],
      ar: ['إلهام', 'كلام', 'حكمة'],
      ckb: ['ئیلھام', 'قسە', 'دانایی'],
    },
    meaning: {
      fa: 'نشانه دریافت یک پیام مهم، موفقیت در مذاکره یا آزمون، و بیداری خرد درونی است.',
      en: 'A sign of receiving an important message, success in negotiation or exams, and awakening of inner wisdom.',
      ar: 'علامة على تلقي رسالة مهمة، والنجاح في التفاوض أو الاختبار، واستيقاظ الحكمة الداخلية.',
      ckb: 'نیشانەی وەرگرتنی پەیامێکی گرنگ، سەرکەوتن لە گفتوگۆ یان تاقیکردنەوە و خەبەربوونەوەی دانایی ناوەکی.',
    },
    advice: {
      fa: 'به نشانه‌ها و گفتگوهای امروز با دقت گوش فرا دهید.',
      en: 'Listen carefully to today’s signs and conversations.',
      ar: 'استمع بعناية لعلامات ومحادثات اليوم.',
      ckb: 'بە وردی گوێ بۆ نیشانەکان و گفتوگۆکانی ئەمڕۆ بگرە.',
    },
  },
  {
    index: 4,
    glyph: 'ᚱ',
    nameEn: 'Raidho',
    name: {
      fa: 'رایدو (سفر و مسیر)',
      en: 'Raidho (Journey & Path)',
      ar: 'رايدو (السفر والمسار)',
      ckb: 'ڕایدۆ (سەفەر و ڕێگا)',
    },
    element: 'air',
    keywords: {
      fa: ['حرکت', 'سفر', 'ریتم درست'],
      en: ['Movement', 'Travel', 'Right Rhythm'],
      ar: ['حركة', 'سفر', 'إيقاع صحيح'],
      ckb: ['جووڵە', 'سەفەر', 'ڕیتمی دروست'],
    },
    meaning: {
      fa: 'نماد حرکت در مسیر صحیح، سفر پیش رو و هماهنگی با چرخه طبیعی زمان است.',
      en: 'A symbol of moving on the right path, an upcoming journey, and harmony with the natural cycle of time.',
      ar: 'رمز التحرك في المسار الصحيح، والسفر القادم، والتناغم مع الدورة الطبيعية للزمن.',
      ckb: 'نیشانەی جووڵە لە ڕێگای دروستدا، سەفەری پێشەوە و ھاوتەریبی لەگەڵ چرخەی سروشتی کات.',
    },
    advice: {
      fa: 'به مسیر حرکت خود ادامه دهید و از توقف بی‌مورد بپرهیزید.',
      en: 'Continue on your path and avoid unnecessary stops.',
      ar: 'واصل مسارك وتجنب التوقفات غير الضرورية.',
      ckb: 'بەردەوام بە لە ڕێگاکەت و لە وەستانە بێھۆکارەکان بەدوور بە.',
    },
  },
  {
    index: 5,
    glyph: 'ᚲ',
    nameEn: 'Kenaz',
    name: {
      fa: 'کناز (مشعل آگاهی)',
      en: 'Kenaz (Torch of Awareness)',
      ar: 'كيناز (مشعل الوعي)',
      ckb: 'کێناز (مەشخەڵی ئاگایی)',
    },
    element: 'fire',
    keywords: {
      fa: ['روشنایی', 'خلاقیت', 'بصیرت'],
      en: ['Light', 'Creativity', 'Insight'],
      ar: ['نور', 'إبداع', 'بصيرة'],
      ckb: ['ڕووناکی', 'داهێنان', 'بینین'],
    },
    meaning: {
      fa: 'مشعل نور در تاریکی؛ روشن شدن حقیقت یک موضوع و شکوفایی استعداد هنری یا فکری.',
      en: 'A torch of light in darkness; the truth of a matter coming to light and the blossoming of artistic or intellectual talent.',
      ar: 'مشعل نور في الظلام؛ ظهور حقيقة أمر ما، وازدهار موهبة فنية أو فكرية.',
      ckb: 'مەشخەڵی ڕووناکی لە تاریکیدا؛ ئاشکرابوونی ڕاستییەک و شکاندنی بەھرەی ھونەری یان فکری.',
    },
    advice: {
      fa: 'از خلاقیت خود برای حل مسئله استفاده کنید.',
      en: 'Use your creativity to solve the problem.',
      ar: 'استخدم إبداعك لحل المشكلة.',
      ckb: 'داهێنانی خۆت بەکار بێنە بۆ چارەسەرکردنی کێشەکە.',
    },
  },
  {
    index: 6,
    glyph: 'ᚷ',
    nameEn: 'Gebo',
    name: {
      fa: 'گبو (هدیه و پیوند)',
      en: 'Gebo (Gift & Union)',
      ar: 'غيبو (الهدية والاتحاد)',
      ckb: 'گێبۆ (دیاری و یەکگرتن)',
    },
    element: 'air',
    keywords: {
      fa: ['عشق', 'مشارکت', 'هدیه'],
      en: ['Love', 'Partnership', 'Gift'],
      ar: ['حب', 'شراكة', 'هدية'],
      ckb: ['خۆشەویستی', 'ھاوبەشی', 'دیاری'],
    },
    meaning: {
      fa: 'نماد پیوند عاطفی متعادل، همکاری برد-برد، بخشش متقابل و دریافت یک هدیه معنوی یا مادی.',
      en: 'A symbol of balanced emotional union, win-win cooperation, mutual giving, and receiving a spiritual or material gift.',
      ar: 'رمز اتحاد عاطفي متوازن، وتعاون مربح للطرفين، والعطاء المتبادل، وتلقي هدية روحية أو مادية.',
      ckb: 'نیشانەی یەکگرتنی سۆزداری ھاوسەنگ، ھاوکاری سوودبەخش بۆ ھەردوولا، بەخشینی یەکتری و وەرگرتنی دیارییەکی ڕۆحی یان ماددی.',
    },
    advice: {
      fa: 'تعادل میان دادن و گرفتن را در روابط خود پاس بدارید.',
      en: 'Honor the balance of giving and receiving in your relationships.',
      ar: 'احترم التوازن بين العطاء والأخذ في علاقاتك.',
      ckb: 'ھاوسەنگی لە نێوان دان و وەرگرتندا لە پەیوەندییەکانتدا بپارێزە.',
    },
  },
  {
    index: 7,
    glyph: 'ᚹ',
    nameEn: 'Wunjo',
    name: {
      fa: 'وونیو (شادی و هماهنگی)',
      en: 'Wunjo (Joy & Harmony)',
      ar: 'وونيو (الفرح والتناغم)',
      ckb: 'وونیۆ (خۆشی و ھاوتەریبی)',
    },
    element: 'earth',
    keywords: {
      fa: ['سرور', 'آرامش', 'وصال'],
      en: ['Joy', 'Peace', 'Union'],
      ar: ['سرور', 'سلام', 'وصال'],
      ckb: ['خۆشی', 'ئارامی', 'یەکگەیشتن'],
    },
    meaning: {
      fa: 'نشانه پایان اندوه، تحقق یک خواسته قلبی، شادی در خانواده و هماهنگی کامل.',
      en: 'A sign of the end of sorrow, the fulfillment of a heartfelt wish, joy in the family, and complete harmony.',
      ar: 'علامة على نهاية الحزن، وتحقق أمنية قلبية، والفرح في الأسرة، والتناغم الكامل.',
      ckb: 'نیشانەی کۆتایی خەم، بەدیھاتنی داواکارییەکی دڵ، خۆشی لە خێزان و ھاوتەریبی تەواو.',
    },
    advice: {
      fa: 'دل خود را به روی شادی و زیبایی‌های اکنون باز کنید.',
      en: 'Open your heart to the joy and beauties of now.',
      ar: 'افتح قلبك للفرح وجمال اللحظة الحاضرة.',
      ckb: 'دڵت بکەرەوە بۆ خۆشی و جوانییەکانی ئێستا.',
    },
  },
  {
    index: 8,
    glyph: 'ᚺ',
    nameEn: 'Hagalaz',
    name: {
      fa: 'هاگالاز (تحول ناگهانی)',
      en: 'Hagalaz (Sudden Transformation)',
      ar: 'هاكالاز (التحول المفاجئ)',
      ckb: 'ھاگالاز (گۆڕانی لەناکاو)',
    },
    element: 'water',
    keywords: {
      fa: ['پالایش', 'بیداری', 'تغییر'],
      en: ['Purification', 'Awakening', 'Change'],
      ar: ['تصفية', 'صحوة', 'تغيير'],
      ckb: ['پاڵاوتە', 'خەبەربوونەوە', 'گۆڕانکاری'],
    },
    meaning: {
      fa: 'تغییرات غیرمنتظره‌ای که ساختارهای کهنه را پاکسازی می‌کند تا فضایی نو شکل بگیرد.',
      en: 'Unexpected changes that purify old structures so that a new space can take shape.',
      ar: 'تغييرات غير متوقعة تطهر البنى القديمة لتتشكل مساحة جديدة.',
      ckb: 'گۆڕانکارییە چاوەڕواننەکراوەکان کە پێکھاتە کۆنەکان پاک دەکەنەوە بۆ دروستبوونی شوێنێکی نوێ.',
    },
    advice: {
      fa: 'در برابر تغییرات مقاومت نکنید؛ این رخداد به سود رشد نهایی شماست.',
      en: 'Do not resist change; this event serves your ultimate growth.',
      ar: 'لا تقاوم التغيير؛ هذا الحدث يخدم نموك النهائي.',
      ckb: 'بەرگری لە گۆڕانکاری مەکە؛ ئەم ڕووداوە بۆ گەشەی کۆتایی خۆتە.',
    },
  },
  {
    index: 9,
    glyph: 'ᚾ',
    nameEn: 'Nauthiz',
    name: {
      fa: 'نائوتیز (صبر و پختگی)',
      en: 'Nauthiz (Patience & Maturity)',
      ar: 'ناوتيز (الصبر والنضج)',
      ckb: 'ناوتیز (ئارام و پێگەیشتن)',
    },
    element: 'fire',
    keywords: {
      fa: ['استقامت', 'درس زندگی', 'خودسازی'],
      en: ['Endurance', 'Life Lesson', 'Self-Development'],
      ar: ['تحمل', 'درس الحياة', 'تطوير الذات'],
      ckb: ['خۆڕاگری', 'وانەی ژیان', 'خۆپەروەردەکردن'],
    },
    meaning: {
      fa: 'یادآوری ارزش صبر، شناخت نیازهای واقعی و تبدیل محدودیت به پله صعود.',
      en: 'A reminder of the value of patience, recognizing real needs, and turning limitation into a stepping stone.',
      ar: 'تذكير بقيمة الصبر، وإدراك الاحتياجات الحقيقية، وتحويل القيود إلى درجة للصعود.',
      ckb: 'یادخستنەوەی نرخی ئارام، ناسینی پێداویستییە ڕاستەقینەکان و گۆڕینی سنوورداری بۆ پەلەی سەرکەوتن.',
    },
    advice: {
      fa: 'با صبوری و تدبیر از این مرحله عبور کنید.',
      en: 'Pass through this stage with patience and wisdom.',
      ar: 'تجاوز هذه المرحلة بالصبر والتدبير.',
      ckb: 'بە ئارام و تدبیر لەم قۆناغە تێپەڕە.',
    },
  },
  {
    index: 10,
    glyph: 'ᛁ',
    nameEn: 'Isa',
    name: {
      fa: 'ایسا (سکوت و تمرکز)',
      en: 'Isa (Silence & Focus)',
      ar: 'إيسا (الصمت والتركيز)',
      ckb: 'ئیسا (بێدەنگی و سەرنج)',
    },
    element: 'water',
    keywords: {
      fa: ['توقف آگاهانه', 'تمرکز', 'آرامش'],
      en: ['Mindful Pause', 'Focus', 'Calm'],
      ar: ['توقف واعٍ', 'تركيز', 'هدوء'],
      ckb: ['وەستانی ئاگادارانە', 'سەرنج', 'ئارامی'],
    },
    meaning: {
      fa: 'زمان مکث کوتاه، درون‌نگری و پرهیز از شتاب‌زدگی تا زمانی که شرایط شفاف شود.',
      en: 'A time for a brief pause, introspection, and avoiding haste until conditions become clear.',
      ar: 'وقت توقف قصير، وتأمل داخلي، وتجنب التسرع حتى تتضح الظروف.',
      ckb: 'کاتی وەستانێکی کورت، ڕوانینە ناوەکی و دوورکەوتنەوە لە پەلە تا بارودۆخ ڕوون ببێتەوە.',
    },
    advice: {
      fa: 'فعلاً دست نگه دارید و انرژی خود را بازیابی کنید.',
      en: 'Hold off for now and restore your energy.',
      ar: 'توقف الآن واستعد طاقتك.',
      ckb: 'ئێستا دەست بگرە و وزەت بگەڕێنەوە.',
    },
  },
  {
    index: 11,
    glyph: 'ᛃ',
    nameEn: 'Jera',
    name: {
      fa: 'یِرا (فصل برداشت)',
      en: 'Jera (Harvest Season)',
      ar: 'يِرا (موسم الحصاد)',
      ckb: 'یێرا (وەرزی دروێنە)',
    },
    element: 'earth',
    keywords: {
      fa: ['پاداش', 'عدالت', 'ثمره'],
      en: ['Reward', 'Justice', 'Fruit'],
      ar: ['مكافأة', 'عدالة', 'ثمرة'],
      ckb: ['پاداشت', 'دادپەروەری', 'بەرھەم'],
    },
    meaning: {
      fa: 'فرارسیدن فصل درو کردن محصول تلاش‌های گذشته و دریافت پاداش عادلانه.',
      en: 'The arrival of the harvest season for past efforts and receiving a fair reward.',
      ar: 'حلول موسم حصاد ثمار الجهود الماضية وتلقي المكافأة العادلة.',
      ckb: 'گەیشتنی وەرزی دروێنەکردنی بەرھەمی کۆششەکانی ڕابردوو و وەرگرتنی پاداشتی دادپەروەرانە.',
    },
    advice: {
      fa: 'به چرخه زمان اعتماد کنید؛ تلاش شما بی‌نتیجه نمانده است.',
      en: 'Trust the cycle of time; your effort has not been in vain.',
      ar: 'ثق بدورة الزمن؛ جهدك لم يذهب سدى.',
      ckb: 'باوەڕ بە چرخەی کات بکە؛ کۆششت بێسوود نەبووە.',
    },
  },
  {
    index: 12,
    glyph: 'ᛇ',
    nameEn: 'Eihwaz',
    name: {
      fa: 'ایواز (درخت زندگی)',
      en: 'Eihwaz (Tree of Life)',
      ar: 'إيڤاز (شجرة الحياة)',
      ckb: 'ئیھواز (درەختی ژیان)',
    },
    element: 'earth',
    keywords: {
      fa: ['پایداری', 'طول عمر', 'اتصال'],
      en: ['Endurance', 'Longevity', 'Connection'],
      ar: ['ثبات', 'طول العمر', 'اتصال'],
      ckb: ['دامەزراوی', 'درێژەژیان', 'پەیوەندی'],
    },
    meaning: {
      fa: 'استقامت عمیق، غلبه بر ترس‌ها و اتصال میان خرد درونی و عمل بیرونی.',
      en: 'Deep endurance, overcoming fears, and the connection between inner wisdom and outer action.',
      ar: 'تحمل عميق، والتغلب على المخاوف، والاتصال بين الحكمة الداخلية والعمل الخارجي.',
      ckb: 'خۆڕاگری قووڵ، زاڵبوون بەسەر ترسەکان و پەیوەندی لە نێوان دانایی ناوەکی و کرداری دەرەکیدا.',
    },
    advice: {
      fa: 'بر هدف بلندمدت خود استوار بمانید.',
      en: 'Stay firm on your long-term goal.',
      ar: 'اثبت على هدفك طويل الأمد.',
      ckb: 'بەسەر ئامانجی درێژخایەنەکەت دامەزراو بە.',
    },
  },
  {
    index: 13,
    glyph: 'ᛈ',
    nameEn: 'Perthro',
    name: {
      fa: 'پرترو (راز و سرنوشت)',
      en: 'Perthro (Mystery & Fate)',
      ar: 'بيرثرو (السر والقدر)',
      ckb: 'پێرترۆ (نهێنی و چارەنووس)',
    },
    element: 'water',
    keywords: {
      fa: ['شهود', 'کشف راز', 'شانس'],
      en: ['Intuition', 'Unveiling Secrets', 'Luck'],
      ar: ['حدس', 'كشف السر', 'حظ'],
      ckb: ['ھەستیاری', 'ئاشکراکردنی نهێنی', 'بەخت'],
    },
    meaning: {
      fa: 'آشکار شدن یک حقیقت پنهان، هماهنگی‌های شگفت‌انگیز و فرصت غیرمنتظره.',
      en: 'The revelation of a hidden truth, amazing synchronicities, and an unexpected opportunity.',
      ar: 'انكشاف حقيقة خفية، وتزامنات مذهلة، وفرصة غير متوقعة.',
      ckb: 'ئاشکرابوونی ڕاستییەکی نەھێنی، ھاوکاتبوونی سەرسوڕھێنەر و دەرفەتێکی چاوەڕواننەکراو.',
    },
    advice: {
      fa: 'به حس ششم خود اعتماد کنید.',
      en: 'Trust your sixth sense.',
      ar: 'ثق بحاستك السادسة.',
      ckb: 'باوەڕ بە ھەستی شەشەمت بکە.',
    },
  },
  {
    index: 14,
    glyph: 'ᛉ',
    nameEn: 'Algiz',
    name: {
      fa: 'آلگیز (حفاظت کیهانی)',
      en: 'Algiz (Cosmic Protection)',
      ar: 'آلجيز (الحماية الكونية)',
      ckb: 'ئالگیز (پاراستنی گەردوونی)',
    },
    element: 'air',
    keywords: {
      fa: ['نگهبانی', 'ایمنی', 'شهود بیدار'],
      en: ['Guardianship', 'Safety', 'Awakened Intuition'],
      ar: ['حراسة', 'أمان', 'حدس يقظ'],
      ckb: ['پاسەوانی', 'ئاسایش', 'ھەستیاری خەبەر'],
    },
    meaning: {
      fa: 'قوی‌ترین رون محافظت معنوی، دفع انرژی‌های منفی و هدایت روشن.',
      en: 'The strongest rune of spiritual protection, repelling negative energies, and clear guidance.',
      ar: 'أقوى رون للحماية الروحية، وطرد الطاقات السلبية، والإرشاد الواضح.',
      ckb: 'بەھێزترین ڕوونی پاراستنی ڕۆحی، دەرکردنی وزە نەرێنییەکان و ڕێنمایی ڕوون.',
    },
    advice: {
      fa: 'شما در پناه نور و آگاهی هستید؛ با آرامش گام بردارید.',
      en: 'You are under the shelter of light and awareness; walk in peace.',
      ar: 'أنت في كنف النور والوعي؛ سِر بسلام.',
      ckb: 'تۆ لە پەنای ڕووناکی و ئاگاییدایت؛ بە ئارامی ھەنگاو بنێ.',
    },
  },
  {
    index: 15,
    glyph: 'ᛋ',
    nameEn: 'Sowilo',
    name: {
      fa: 'سویلو (خورشید پیروزی)',
      en: 'Sowilo (Sun of Victory)',
      ar: 'سوڤيلو (شمس الانتصار)',
      ckb: 'سۆویلۆ (خۆری سەرکەوتن)',
    },
    element: 'fire',
    keywords: {
      fa: ['موفقیت', 'درخشش', 'شفافیت'],
      en: ['Success', 'Radiance', 'Clarity'],
      ar: ['نجاح', 'تألق', 'وضوح'],
      ckb: ['سەرکەوتن', 'درەوشانەوە', 'ڕوونی'],
    },
    meaning: {
      fa: 'نور کامل خورشید؛ پیروزی قاطع، سلامت، افتخار و روشن شدن مسیر زندگی.',
      en: 'The full light of the sun; decisive victory, health, honor, and the illumination of your life path.',
      ar: 'نور الشمس الكامل؛ انتصار حاسم، وصحة، وشرف، وإضاءة مسار حياتك.',
      ckb: 'ڕووناکی تەواوی خۆر؛ سەرکەوتنی قەتعی، تەندروستی، شانازی و ڕوونبوونەوەی ڕێگای ژیان.',
    },
    advice: {
      fa: 'با اطمینان کامل بدرخشید و رهبری مسیر خود را بر عهده بگیرید.',
      en: 'Shine with full confidence and take the lead on your own path.',
      ar: 'تألق بثقة تامة وتولَّ قيادة مسارك.',
      ckb: 'بە متمانەی تەواو بدرەوشێوە و سەرکردایەتی ڕێگای خۆت بگرە دەست.',
    },
  },
  {
    index: 16,
    glyph: 'ᛏ',
    nameEn: 'Tiwaz',
    name: {
      fa: 'تیواز (عدالت و شجاعت)',
      en: 'Tiwaz (Justice & Courage)',
      ar: 'تيفاز (العدالة والشجاعة)',
      ckb: 'تیواز (دادپەروەری و ئازایەتی)',
    },
    element: 'air',
    keywords: {
      fa: ['صداقت', 'پیروزی قانونی', 'اراده'],
      en: ['Honesty', 'Legal Victory', 'Will'],
      ar: ['صدق', 'انتصار قانوني', 'إرادة'],
      ckb: ['ڕاستگۆیی', 'سەرکەوتنی یاسایی', 'ئیرادە'],
    },
    meaning: {
      fa: 'پیروزی حق، موفقیت در امور حقوقی یا تصمیمات اخلاقی و پایبندی به عهد.',
      en: 'Victory of truth, success in legal matters or moral decisions, and adherence to one’s covenant.',
      ar: 'انتصار الحق، والنجاح في الأمور القانونية أو القرارات الأخلاقية، والوفاء بالعهد.',
      ckb: 'سەرکەوتنی ماف، سەرکەوتن لە کاروباری یاسایی یان بڕیاری ئەخلاقی و پابەندبوون بە پەیمان.',
    },
    advice: {
      fa: 'بر مدار صداقت و عدالت حرکت کنید.',
      en: 'Move on the path of honesty and justice.',
      ar: 'سِر على مدار الصدق والعدالة.',
      ckb: 'لەسەر ڕێگای ڕاستگۆیی و دادپەروەری بگەڕێ.',
    },
  },
  {
    index: 17,
    glyph: 'ᛒ',
    nameEn: 'Berkano',
    name: {
      fa: 'برکانو (تولد و رویش)',
      en: 'Berkano (Birth & Growth)',
      ar: 'بركانو (الولادة والنمو)',
      ckb: 'بێرکانۆ (لەدایکبوون و گەشە)',
    },
    element: 'earth',
    keywords: {
      fa: ['آغاز نو', 'برکت خانواده', 'شفا'],
      en: ['New Beginning', 'Family Blessing', 'Healing'],
      ar: ['بداية جديدة', 'بركة الأسرة', 'شفاء'],
      ckb: ['دەستپێکی نوێ', 'بەرەکەتی خێزان', 'چاکبوونەوە'],
    },
    meaning: {
      fa: 'شکوفایی یک پروژه جدید، گرمای خانواده، زایش ایده‌های نو و رشد.',
      en: 'The blossoming of a new project, family warmth, the birth of new ideas, and growth.',
      ar: 'ازدهار مشروع جديد، ودفء الأسرة، وولادة أفكار جديدة، والنمو.',
      ckb: 'شکاندنی پرۆژەیەکی نوێ، گەرمی خێزان، لەدایکبوونی بیرۆکەی نوێ و گەشە.',
    },
    advice: {
      fa: 'گام اول برای پرورش ایده یا رابطه جدید را با مهر بردارید.',
      en: 'Take the first step to nurture a new idea or relationship with love.',
      ar: 'اتخذ الخطوة الأولى لرعاية فكرة أو علاقة جديدة بمحبة.',
      ckb: 'یەکەم ھەنگاو بۆ پەروەردەکردنی بیرۆکە یان پەیوەندییەکی نوێ بە خۆشەویستی ھەڵبنێ.',
    },
  },
  {
    index: 18,
    glyph: 'ᛖ',
    nameEn: 'Ehwaz',
    name: {
      fa: 'اهواز (همسفری و اعتماد)',
      en: 'Ehwaz (Companionship & Trust)',
      ar: 'إهواز (الرفقة والثقة)',
      ckb: 'ئێھواز (ھاوڕێیەتی و متمانە)',
    },
    element: 'earth',
    keywords: {
      fa: ['پیشرفت', 'همدلی', 'وفاداری'],
      en: ['Progress', 'Empathy', 'Loyalty'],
      ar: ['تقدم', 'تعاطف', 'وفاء'],
      ckb: ['پێشکەوتن', 'ھاوسۆزی', 'دڵسۆزی'],
    },
    meaning: {
      fa: 'حرکت هماهنگ با یک شریک کاری یا عاطفی قابل اعتماد و تغییر مثبت مکان یا وضعیت.',
      en: 'Moving in harmony with a trustworthy work or romantic partner, and a positive change of place or situation.',
      ar: 'التحرك بتناغم مع شريك عمل أو عاطفي موثوق، وتغيير إيجابي في المكان أو الوضع.',
      ckb: 'جووڵەی ھاوتەریب لەگەڵ ھاوبەشێکی کاری یان سۆزداری متمانەپێکراو و گۆڕانی ئەرێنی شوێن یان بارودۆخ.',
    },
    advice: {
      fa: 'همکاری و اعتماد متقابل، سرعت پیشرفت شما را دوچندان می‌کند.',
      en: 'Cooperation and mutual trust double the speed of your progress.',
      ar: 'التعاون والثقة المتبادلة يضاعفان سرعة تقدمك.',
      ckb: 'ھاوکاری و متمانەی یەکتری خێرایی پێشکەوتنت دوو ھێندە دەکەن.',
    },
  },
  {
    index: 19,
    glyph: 'ᛗ',
    nameEn: 'Mannaz',
    name: {
      fa: 'ماناز (خودشناسی و انسانیت)',
      en: 'Mannaz (Self-Knowledge & Humanity)',
      ar: 'ماناز (معرفة الذات والإنسانية)',
      ckb: 'ماناز (ناسینی خۆ و مرۆڤایەتی)',
    },
    element: 'air',
    keywords: {
      fa: ['آگاهی', 'فرهنگ', 'همیاری'],
      en: ['Awareness', 'Culture', 'Mutual Help'],
      ar: ['وعي', 'ثقافة', 'تعاون'],
      ckb: ['ئاگایی', 'کەلتور', 'یارمەتیدانی یەکتری'],
    },
    meaning: {
      fa: 'شناخت جایگاه واقعی خود، دریافت حمایت از جمع دوستان و رشد فکری.',
      en: 'Recognizing your true place, receiving support from a circle of friends, and intellectual growth.',
      ar: 'إدراك مكانتك الحقيقية، وتلقي الدعم من مجموعة الأصدقاء، والنمو الفكري.',
      ckb: 'ناسینی شوێنی ڕاستەقینەی خۆت، وەرگرتنی پشتیوانی لە کۆمەڵی ھاوڕێیان و گەشەی فکری.',
    },
    advice: {
      fa: 'ابتدا با خودتان در صلح باشید تا جهان با شما هماهنگ شود.',
      en: 'First be at peace with yourself so the world harmonizes with you.',
      ar: 'كن أولًا في سلام مع نفسك ليتناغم العالم معك.',
      ckb: 'سەرەتا لەگەڵ خۆتدا لە ئاشتیدا بە تا جیھان لەگەڵت ھاوتەریب بێت.',
    },
  },
  {
    index: 20,
    glyph: 'ᛚ',
    nameEn: 'Laguz',
    name: {
      fa: 'لاگوز (جریان آب و شهود)',
      en: 'Laguz (Water Flow & Intuition)',
      ar: 'لاغوز (تدفق الماء والحدس)',
      ckb: 'لاگوز (ڕەوتی ئاو و ھەستیاری)',
    },
    element: 'water',
    keywords: {
      fa: ['احساسات', 'انعطاف', 'رویا'],
      en: ['Emotions', 'Flexibility', 'Dream'],
      ar: ['عواطف', 'مرونة', 'حلم'],
      ckb: ['ھەستیاری', 'نەرمی', 'خەون'],
    },
    meaning: {
      fa: 'جریان نرم احساسات، پاکسازی عاطفی، قدرت تخیل و همسویی با جریان زندگی.',
      en: 'The gentle flow of emotions, emotional cleansing, the power of imagination, and alignment with the flow of life.',
      ar: 'التدفق اللطيف للعواطف، والتنقية العاطفية، وقوة الخيال، والانسجام مع تدفق الحياة.',
      ckb: 'ڕەوتی نەرمی ھەستیاری، پاککردنەوەی سۆزداری، ھێزی خەیاڵ و ھاوتەریبی لەگەڵ ڕەوتی ژیان.',
    },
    advice: {
      fa: 'مانند آب منعطف باشید و از سخت‌گیری ذهنی بپرهیزید.',
      en: 'Be flexible like water and avoid mental rigidity.',
      ar: 'كن مرنًا كالماء وتجنب الجمود الذهني.',
      ckb: 'وەک ئاو نەرم بە و لە سختی دەروونی بەدوور بە.',
    },
  },
  {
    index: 21,
    glyph: 'ᛜ',
    nameEn: 'Ingwaz',
    name: {
      fa: 'اینگواز (بذر پتانسیل)',
      en: 'Ingwaz (Seed of Potential)',
      ar: 'إنغواز (بذرة الإمكانات)',
      ckb: 'ئینگواز (تۆوی توانا)',
    },
    element: 'earth',
    keywords: {
      fa: ['تکمیل', 'آرامش', 'نقطه عطف'],
      en: ['Completion', 'Peace', 'Turning Point'],
      ar: ['اكتمال', 'سلام', 'نقطة تحول'],
      ckb: ['تەواوبوون', 'ئارامی', 'خاڵی وەرچەرخان'],
    },
    meaning: {
      fa: 'پایان موفقیت‌آمیز یک دوره و آماده شدن بذر درونی برای شکوفایی در فصل جدید.',
      en: 'The successful end of a period and the inner seed preparing to blossom in a new season.',
      ar: 'النهاية الناجحة لفترة ما، واستعداد البذرة الداخلية للتفتح في موسم جديد.',
      ckb: 'کۆتایی سەرکەوتووی ماوەیەک و ئامادەبوونی تۆوی ناوەکی بۆ شکاندن لە وەرزێکی نوێدا.',
    },
    advice: {
      fa: 'کارهای ناتمام را ببندید تا آماده جهش بعدی شوید.',
      en: 'Close unfinished tasks so you are ready for the next leap.',
      ar: 'أغلق المهام غير المكتملة لتكون مستعدًا للقفزة التالية.',
      ckb: 'کارە ناتەواوەکان ببەستەرەوە تا ئامادە بیت بۆ بازدانی داهاتوو.',
    },
  },
  {
    index: 22,
    glyph: 'ᛞ',
    nameEn: 'Dagaz',
    name: {
      fa: 'داگاز (سپیده‌دم و گشایش)',
      en: 'Dagaz (Dawn & Opening)',
      ar: 'داغاز (الفجر والانفتاح)',
      ckb: 'داگاز (بەیان و کردنەوە)',
    },
    element: 'fire',
    keywords: {
      fa: ['طلوع نو', 'تحول مثبت', 'امید'],
      en: ['New Dawn', 'Positive Transformation', 'Hope'],
      ar: ['فجر جديد', 'تحول إيجابي', 'أمل'],
      ckb: ['بەیانێکی نوێ', 'گۆڕانی ئەرێنی', 'ئومێد'],
    },
    meaning: {
      fa: 'پایان شب تاریک و طلوع سپیده‌دم؛ چرخش ۱۸۰ درجه‌ای شرایط به نفع شما.',
      en: 'The end of the dark night and the dawn; a 180-degree turn of circumstances in your favor.',
      ar: 'نهاية الليل المظلم وطلوع الفجر؛ تحول 180 درجة في الظروف لصالحك.',
      ckb: 'کۆتایی شەوی تاریک و ھەڵاتنی بەیان؛ گۆڕانی ١٨٠ پلەی بارودۆخ بە سوودی تۆ.',
    },
    advice: {
      fa: 'به استقبال روشنایی و گشایش بزرگ بروید.',
      en: 'Go forth to welcome the light and the great opening.',
      ar: 'تقدّم لاستقبال النور والانفتاح الكبير.',
      ckb: 'بەرەو پێشەوە بڕۆ بۆ پێشوازیکردن لە ڕووناکی و کردنەوەی گەورە.',
    },
  },
  {
    index: 23,
    glyph: 'ᛟ',
    nameEn: 'Othala',
    name: {
      fa: 'اوتالا (میراث و ریشه)',
      en: 'Othala (Heritage & Roots)',
      ar: 'أوتالا (الإرث والجذور)',
      ckb: 'ئۆتالا (میرات و ڕەگ)',
    },
    element: 'earth',
    keywords: {
      fa: ['ملک و خانه', 'اصالت', 'امنیت'],
      en: ['Property & Home', 'Authenticity', 'Security'],
      ar: ['ملك وبيت', 'أصالة', 'أمان'],
      ckb: ['موڵک و ماڵ', 'ڕەسەنایەتی', 'ئاسایش'],
    },
    meaning: {
      fa: 'برکت در امور ملکی و خانوادگی، بهره‌مندی از تجربیات نیاکان و امنیت پایدار.',
      en: 'Blessing in property and family matters, benefiting from ancestral experience, and lasting security.',
      ar: 'بركة في أمور الملك والعائلة، والاستفادة من تجارب الأجداد، والأمان الدائم.',
      ckb: 'بەرەکەت لە کاروباری موڵک و خێزان، سوودوەرگرتن لە ئەزموونی باوان و ئاسایشی بەردەوام.',
    },
    advice: {
      fa: 'بر ارزش‌های اصیل و بنیان خانواده تکیه کنید.',
      en: 'Rely on authentic values and the foundation of family.',
      ar: 'اعتمد على القيم الأصيلة وأساس الأسرة.',
      ckb: 'پشت بە بەها ڕەسەنەکان و بناغەی خێزان ببەستە.',
    },
  },
];