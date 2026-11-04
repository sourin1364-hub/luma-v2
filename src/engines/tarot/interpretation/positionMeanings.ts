import { getCardById } from '../index';
import { getSpreadById } from '../spreads';

export interface PositionMeaningMap {
  [spreadId: string]: {
    [positionIndex: number]: {
      [cardId: string]: string;
    };
  };
}

/**
 * چارچوب‌های معنایی اختصاصی برای تک‌تک جایگاه‌های ۱۱ چیدمان تاروت
 * تا هر کارت در هر جایگاه، تفسیری منحصربه‌فرد، عمیق و غیرتکراری داشته باشد.
 */
const POSITION_CONTEXT_FRAMES: Record<string, Record<number, (cardName: string, baseMeaning: string) => string>> = {
  'daily-card': {
    0: (name, meaning) => `انرژی شاخص امروز شما با کارت «${name}» هم‌ارتعاش است: ${meaning} امروز زمان مناسبی است تا این پیام را در تصمیمات روزمره خود به کار ببندید.`,
  },
  'single-card': {
    0: (name, meaning) => `پاسخ مستقیم کارت «${name}» به نیت و پرسش شما: ${meaning}`,
  },
  'yes-no': {
    0: (name, meaning) => `در پاسخ به پرسش بله یا خیر شما، حضور کارت «${name}» نشان می‌دهد: ${meaning}`,
  },
  'past-present-future': {
    0: (name, meaning) => `ریشه‌ها در گذشته («${name}»): عواملی که زمینه‌ساز شرایط امروز شما شده‌اند نشان می‌دهند که در گذشته ${meaning}`,
    1: (name, meaning) => `وضعیت زمان حال («${name}»): در نقطه کنونی، انرژی غالب زندگی شما بر این محور استوار است: ${meaning}`,
    2: (name, meaning) => `چشم‌انداز آینده («${name}»): در صورت تداوم مسیر فعلی، جریان پیش رو به این سمت حرکت می‌کند: ${meaning}`,
  },
  'situation-obstacle-advice': {
    0: (name, meaning) => `ماهیت وضعیت کنونی («${name}»): هسته اصلی موضوعی که با آن روبرو هستید این پیام را دارد: ${meaning}`,
    1: (name, meaning) => `مانع و چالش پیش رو («${name}»): عاملی که انرژی شما را مسدود کرده یا نیازمند هوشیاری است: ${meaning}`,
    2: (name, meaning) => `راهکار و کلید عبور («${name}»): بهترین رویکرد عملی برای بازگشایی مسیر شما این است: ${meaning}`,
  },
  'mind-heart-action': {
    0: (name, meaning) => `فضای ذهنی و منطق شما («${name}»): افکار و تحلیل‌های درونی شما حول این محور می‌چرخد: ${meaning}`,
    1: (name, meaning) => `ندای قلب و احساسات («${name}»): در لایه‌های عاطفی و ناخودآگاه، قلب شما این گونه گواهی می‌دهد: ${meaning}`,
    2: (name, meaning) => `اقدام بیرونی و گام عملی («${name}»): برای ایجاد تعادل میان عقل و دل، این رفتار توصیه می‌شود: ${meaning}`,
  },
  'relationship': {
    0: (name, meaning) => `سهم و انرژی شما در رابطه («${name}»): نگرش و احساسی که شما به این پیوند می‌آورید: ${meaning}`,
    1: (name, meaning) => `انرژی و نگاه طرف مقابل («${name}»): آنچه در ذهن و قلب شریک عاطفی شما جریان دارد: ${meaning}`,
    2: (name, meaning) => `اتمسفر کنونی رابطه («${name}»): پیوند مشترک شما در این مقطع زمانی چنین کیفیتی دارد: ${meaning}`,
    3: (name, meaning) => `چالش یا گره عاطفی («${name}»): موضوعی که نیازمند گفتگوی صادقانه و درک متقابل است: ${meaning}`,
    4: (name, meaning) => `مسیر و آینده پیوند («${name}»): افق پیش روی این رابطه عاطفی نشان می‌دهد: ${meaning}`,
  },
  'career': {
    0: (name, meaning) => `جایگاه حرفه‌ای کنونی («${name}»): شرایط فعلی کار و مالی شما این پیام را منعکس می‌کند: ${meaning}`,
    1: (name, meaning) => `استعدادها و نقاط قوت («${name}»): سرمایه درونی و مهارتی که به شما برتری می‌بخشد: ${meaning}`,
    2: (name, meaning) => `مانع رشد شغلی («${name}»): چالشی که در محیط کار یا تصمیم‌گیری حرفه‌ای باید مدیریت کنید: ${meaning}`,
    3: (name, meaning) => `فرصت پنهان و پتانسیل («${name}»): دریچه‌ای که می‌تواند به پیشرفت و گشایش مالی بینجامد: ${meaning}`,
    4: (name, meaning) => `ثمره و دستاورد مسیر («${name}»): نتیجه نهایی تلاش‌های حرفه‌ای شما در این دوره: ${meaning}`,
  },
  'horseshoe': {
    0: (name, meaning) => `تاثیرات گذشته («${name}»): تجربیات پیشینی که بر موضوع فعلی سایه انداخته‌اند: ${meaning}`,
    1: (name, meaning) => `شرایط کنونی («${name}»): آنچه هم‌اکنون در مرکز توجه و زندگی شما جریان دارد: ${meaning}`,
    2: (name, meaning) => `تحولات غیرمنتظره یا موانع («${name}»): عواملی که به زودی نیازمند انعطاف‌پذیری شما خواهند بود: ${meaning}`,
    3: (name, meaning) => `بهترین استراتژی («${name}»): هوشمندانه‌ترین مسیری که اکنون می‌توانید انتخاب کنید: ${meaning}`,
    4: (name, meaning) => `نگرش اطرافیان و محیط («${name}»): تاثیر افراد و شرایط پیرامون بر تصمیم شما: ${meaning}`,
    5: (name, meaning) => `آینده نزدیک («${name}»): گام بعدی که به زودی در مسیرتان آشکار می‌شود: ${meaning}`,
    6: (name, meaning) => `فرجام و نتیجه نهایی («${name}»): جمع‌بندی و سرانجام این چرخه برای شما: ${meaning}`,
  },
  'celtic-cross': {
    0: (name, meaning) => `۱. قلب موقعیت فعلی («${name}»): انرژی محوری که اکنون پیرامون نیت شما جریان دارد: ${meaning}`,
    1: (name, meaning) => `۲. چالش متقاطع («${name}»): نیرویی که به صورت مستقیم با خواسته شما تلاقی می‌کند: ${meaning}`,
    2: (name, meaning) => `۳. ریشه‌های ناخودآگاه و گذشته دور («${name}»): بنیان پنهان این موضوع در اعماق وجود شما: ${meaning}`,
    3: (name, meaning) => `۴. گذشته نزدیک («${name}»): رویدادی که به تازگی از آن عبور کرده‌اید و هنوز اثرش باقی است: ${meaning}`,
    4: (name, meaning) => `۵. آرمان و هدف آگاهانه («${name}»): بالاترین پتانسیلی که ذهن شما در پی دستیابی به آن است: ${meaning}`,
    5: (name, meaning) => `۶. آینده پیش رو («${name}»): انرژی جدیدی که در روزها و هفته‌های آینده وارد میدان می‌شود: ${meaning}`,
    6: (name, meaning) => `۷. جایگاه و نگرش درونی شما («${name}»): نقشی که خودتان در شکل‌گیری این شرایط ایفا می‌کنید: ${meaning}`,
    7: (name, meaning) => `۸. محیط و تاثیرات بیرونی («${name}»): بازتاب رفتار دیگران و فضای اطراف بر موضوع شما: ${meaning}`,
    8: (name, meaning) => `۹. امیدها و ترس‌های پنهان («${name}»): راز درونی که هم مشتاق آن هستید و هم از آن واهمه دارید: ${meaning}`,
    9: (name, meaning) => `۱۰. نقطه اوج و سرانجام («${name}»): برآیند نهایی تمام نیروهای صلیب سلتیک نشان می‌دهد: ${meaning}`,
  },
};

export const POSITION_MEANINGS: PositionMeaningMap = {};

export function getPositionSpecificMeaning(
  spreadId: string,
  positionIndex: number,
  cardId: string,
  isReversed: boolean = false
): string | null {
  const card = getCardById(cardId);
  if (!card) return null;

  const baseMeaning = isReversed ? card.reversed.meaning : card.upright.meaning;
  const spreadFrames = POSITION_CONTEXT_FRAMES[spreadId];

  if (spreadFrames && spreadFrames[positionIndex]) {
    return spreadFrames[positionIndex](card.nameFa, baseMeaning);
  }

  // برای چیدمان سالانه (۱۲ ماه سال) یا هر چیدمان دیگر
  const spread = getSpreadById(spreadId);
  const pos = spread?.positions[positionIndex];
  if (pos) {
    return `در جایگاه «${pos.nameFa}» (${pos.description})، حضور کارت «${card.nameFa}» نشان می‌دهد: ${baseMeaning}`;
  }

  return baseMeaning;
}
