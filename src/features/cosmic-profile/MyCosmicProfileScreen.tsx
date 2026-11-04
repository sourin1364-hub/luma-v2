import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SubscriptionScreen } from '../subscription/SubscriptionScreen';
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
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscription } from '../../hooks/useSubscription';
import { getBirthProfile, getProfile } from '../profile/profileService';
import type { BirthProfile } from '../profile/types';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { jalaaliToGregorian } from '../../engines/calendar/jalaali';
import { toPersianDigits, formatJalaaliDate } from '../../engines/calendar/format';
import { getZodiacFromBirthDate, getBirthstoneFromBirthDate } from '../../engines/zodiac';
import { calculateAbjad, calculateLifePath, getNumberMeaning } from '../../engines/numerology';
import { MAJOR_ARCANA, ALL_TAROT_CARDS } from '../../engines/tarot';
import { COMPREHENSIVE_DREAMS, ELDER_FUTHARK_RUNES } from '../../engines/dreamsAndRunes';
import { getAssetUrl } from '../../utils/assetPath';
import type { TabId } from '../../components/layout/BottomNav';

interface MyCosmicProfileScreenProps {
  onNavigate?: (tab: TabId) => void;
}

const SIGN_NAMES_FA: Record<string, string> = {
  aries: 'فروردین (حمل)',
  taurus: 'اردیبهشت (ثور)',
  gemini: 'خرداد (جوزا)',
  cancer: 'تیر (سرطان)',
  leo: 'مرداد (اسد)',
  virgo: 'شهریور (سنبله)',
  libra: 'مهر (میزان)',
  scorpio: 'آبان (عقرب)',
  sagittarius: 'آذر (قوس)',
  capricorn: 'دی (جدی)',
  aquarius: 'بهمن (دلو)',
  pisces: 'اسفند (حوت)',
};

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

const SIGN_ELEMENT_FA: Record<string, string> = {
  fire: 'آتش',
  earth: 'خاک',
  air: 'باد (هوا)',
  water: 'آب',
};

const RULING_PLANETS_FA: Record<string, string> = {
  aries: 'بهرام (مریخ)',
  taurus: 'ناهید (زهره)',
  gemini: 'تیر (عطارد)',
  cancer: 'ماه',
  leo: 'خورشید',
  virgo: 'تیر (عطارد)',
  libra: 'ناهید (زهره)',
  scorpio: 'پلوتو و بهرام',
  sagittarius: 'هرمز (مشتری)',
  capricorn: 'کیوان (زحل)',
  aquarius: 'اورانوس و کیوان',
  pisces: 'نپتون و هرمز',
};

const SUN_SIGN_DETAILS: Record<string, { identity: string; strengths: string; challenges: string; career: string }> = {
  aries: { identity: 'خورشید در حمل به شما روحیه‌ای پیشگام، شجاع و مستقل می‌بخشد. شما آغازگر طبیعی مسیرهای تازه هستید.', strengths: 'شجاعت بالا، تصمیم‌گیری سریع، صداقت مستقیم و انرژی رهبری.', challenges: 'بی‌صبری در کارهای طولانی و تصمیم‌گیری‌های آنی.', career: 'مدیریت پروژه، کارآفرینی، ورزش‌های حرفه‌ای و حوزه‌های نوآورانه.' },
  taurus: { identity: 'خورشید در ثور نماد ثبات، زیبایی‌شناسی، وفاداری و اراده استوار برای ساختن امنیت مادی و معنوی است.', strengths: 'پشتکار بی‌نظیر، قابل اعتماد بودن، درک عمیق هنر و مدیریت مالی.', challenges: 'مقاومت در برابر تغییرات ناگهانی و پافشاری بیش از حد بر عقیده.', career: 'بانکداری، معماری، هنر، جواهرسازی و مدیریت سرمایه.' },
  gemini: { identity: 'خورشید در جوزا ذهن شما را بسیار تیزهوش، کنجکاو، چندبعدی و استاد ارتباطات کلامی و نوشتاری می‌سازد.', strengths: 'انعطاف‌پذیری ذهنی، یادگیری سریع، سخنوری و شبکه‌سازی قوی.', challenges: 'پراکندگی تمرکز به دلیل علاقه‌مندی به چند موضوع هم‌زمان.', career: 'نویسندگی، رسانه، آموزش، بازاریابی، فناوری و مذاکره.' },
  cancer: { identity: 'خورشید در سرطان به شما شهود عمیق، حس حمایتگری، وفاداری خانوادگی و هوش هیجانی کم‌نظیری می‌دهد.', strengths: 'همدلی بالا، حافظه قوی، وفاداری و قدرت خلق فضای امن.', challenges: 'حساسیت عاطفی بالا و تاثیرپذیری از فضای پیرامون.', career: 'روانشناسی، مشاوره، طراحی داخلی، آموزش و حوزه‌های مراقبتی.' },
  leo: { identity: 'خورشید در اسد به شما کاریزما، سخاوت، خلاقیت درخشان و اعتمادبه‌نفس طبیعی می‌بخشد.', strengths: 'بزرگ‌منشی، وفاداری، قدرت الهام‌بخشی به دیگران و خلاقیت هنری.', challenges: 'غرور شخصی و نیاز به دیده شدن و قدردانی مستمر.', career: 'مدیریت ارشد، هنر و سینما، سخنرانی، طراحی طلا و رهبری تیم.' },
  virgo: { identity: 'خورشید در سنبله شما را فردی دقیق، تحلیل‌گر، کمال‌گرا و استاد نظم‌بخشی به سیستم‌های پیچیده می‌سازد.', strengths: 'دقت در جزئیات، تفکر منطقی، مسئولیت‌پذیری و حل مسئله.', challenges: 'نقد درونی بیش از حد و سخت‌گیری نسبت به خود و دیگران.', career: 'تحلیل داده، پزشکی و سلامت، مهندسی، ویراستاری و برنامه‌ریزی.' },
  libra: { identity: 'خورشید در میزان نماد تعادل، عدالت‌خواهی، دیپلماسی و درک لطیف از زیبایی و روابط انسانی است.', strengths: 'صلح‌جویی، مذاکره حرفه‌ای، خوش‌فکری و جذابیت اجتماعی.', challenges: 'تردید در تصمیم‌گیری‌های دوگانه و پرهیز از رویارویی مستقیم.', career: 'حقوق و وکالت، دیپلماسی، طراحی مد، هنر و روابط عمومی.' },
  scorpio: { identity: 'خورشید در عقرب به شما اراده‌ای آهنین، نگاهی نافذ، عمق روان‌شناختی و قدرت تولد دوباره از بحران‌ها می‌دهد.', strengths: 'وفاداری مطلق، تمرکز عمیق، کشف رازها و شجاعت در شرایط سخت.', challenges: 'توجه زیاد به کنترل شرایط و دشواری در فراموش کردن خطاها.', career: 'پژوهش‌های استراتژیک، روانکاوی، بازارهای مالی و مدیریت بحران.' },
  sagittarius: { identity: 'خورشید در قوس روح شما را جویای حقیقت، فلسفه، سفر، آزادی و افق‌های بزرگ فکری می‌سازد.', strengths: 'خوش‌بینی، صداقت، دیدگاه کلان و اشتیاق به یادگیری فرهنگ‌ها.', challenges: 'بی‌توجهی به جزئیات ریز اجرایی و رک‌گویی بیش از حد.', career: 'آموزش عالی، تجارت بین‌الملل، نشر، گردشگری و فلسفه.' },
  capricorn: { identity: 'خورشید در جدی نماد جاه‌طلبی هدفمند، انضباط شخصی، خرد مدیریتی و صعود گام‌به‌گام به قله موفقیت است.', strengths: 'مسئولیت‌پذیری، استراتژی بلندمدت، صبر و اعتبار حرفه‌ای.', challenges: 'جدی گرفتن بیش از حد کار و نادیده گرفتن نیاز به استراحت.', career: 'مدیریت کلان، مهندسی، اقتصاد، سیاست‌گذاری و ساخت‌وساز.' },
  aquarius: { identity: 'خورشید در دلو به شما ذهنی آینده‌نگر، مستقل، نوآور و دغدغه‌مند برای پیشرفت جامعه انسانی می‌بخشد.', strengths: 'تفکر خارج از چارچوب، استقلال فکری، انسان‌دوستی و خلاقیت علمی.', challenges: 'فاصله گرفتن عاطفی در مواقع غرق شدن در ایده‌های فکری.', career: 'فناوری‌های نوین، هوش مصنوعی، نجوم، علوم اجتماعی و اختراعات.' },
  pisces: { identity: 'خورشید در حوت شما را دارای شهود معنوی، تخیل هنری بی‌مرز، شفقت عمیق و درک رموز نادیدنی هستی می‌سازد.', strengths: 'الهام‌پذیری، همدلی عمیق، خلاقیت هنری و انعطاف روحی.', challenges: 'غرق شدن در رویاها و نیاز به مرزبندی مشخص در روابط.', career: 'موسیقی، هنرهای تجسمی، عرفان و خودشناسی، درمانگری و ادبیات.' },
};

const MOON_SIGN_DETAILS: Record<string, { emotions: string; attachment: string; comfort: string }> = {
  aries: { emotions: 'احساسات شما پرشور، صادقانه و لحظه‌ای است. واکنش‌های عاطفی شما سریع و بدون پرده‌پوشی بروز می‌کند.', attachment: 'در رابطه عاطفی نیازمند استقلال، هیجان و صداقت روراست هستید.', comfort: 'فعالیت بدنی، ورزش و شروع یک چالش تازه ذهن شما را آرام می‌کند.' },
  taurus: { emotions: 'ماه در ثور در اوج (شرف) قرار دارد؛ احساسات شما عمیق، پایدار، آرام و وفادارانه است.', attachment: 'نیازمند امنیت، ثبات، تماس عاطفی گرم و اطمینان از تداوم رابطه هستید.', comfort: 'طبیعت‌گردی، موسیقی ملایم، غذای باکیفیت و محیط آرام خانه.' },
  gemini: { emotions: 'احساسات شما از مسیر ذهن و گفتگو پردازش می‌شود و کنجکاوی عاطفی بالایی دارید.', attachment: 'گفتگوی فکری صمیمانه و تبادل ایده‌ها برای شما معادل ابراز عشق است.', comfort: 'مطالعه، نوشتن یادداشت‌های روزانه و گفتگو با یک دوست هم‌فکر.' },
  cancer: { emotions: 'ماه در خانه اصلی خود قرار دارد؛ شما دارای عمیق‌ترین شهود عاطفی، حس حمایتگری و پیوند قلبی هستید.', attachment: 'نیازمند صمیمیت عمیق، درک بدون کلام و امنیت عاطفی کامل در خانواده هستید.', comfort: 'نزدیکی به آب، مرور خاطرات شیرین و خلوت امن در فضای خانه.' },
  leo: { emotions: 'قلب شما گرم، سخاوتمند و سرشار از شور زندگی است و با تمام وجود عشق می‌ورزید.', attachment: 'در رابطه نیازمند تحسین متقابل، وفاداری، گرما و احترام به عزت‌نفس هستید.', comfort: 'بیان خلاقانه، هنر، هدیه دادن و حضور در جمع‌های صمیمی.' },
  virgo: { emotions: 'محبت خود را نه با شعارهای پرزرق‌وبرق، بلکه با عمل، توجه به جزئیات و کمک واقعی نشان می‌دهید.', attachment: 'نیازمند نظم فکری، صداقت رفتاری و شریکی قابل اتکا در روزمرگی هستید.', comfort: 'مرتب‌سازی محیط، برنامه‌ریزی و رسیدگی به سلامت جسم و ذهن.' },
  libra: { emotions: 'آرامش درونی شما به هماهنگی، زیبایی و نبود تنش در روابط پیرامونتان گره خورده است.', attachment: 'شراکت عاطفی، احترام متقابل و ظرافت در رفتار برای قلب شما حیاتی است.', comfort: 'فضاهای هنری، موسیقی هارمونیک و گفتگوی آرام و متعادل.' },
  scorpio: { emotions: 'احساسات شما بسیار عمیق، رازآلود و دگرگون‌کننده است؛ شما سطحی‌نگری در عشق را نمی‌پذیرید.', attachment: 'نیازمند پیوند روحی عمیق، وفاداری بی‌قیدوشرط و اعتماد متقابل هستید.', comfort: 'خلوت عمیق، مراقبه، کشف لایه‌های پنهان درون و رهاسازی.' },
  sagittarius: { emotions: 'قلب شما شاداب، امیدوار و نیازمند افق‌های باز و تجربه‌های معنوی تازه است.', attachment: 'در عشق به دنبال هم‌سفری هستید که به آزادی رشد شما احترام بگذارد.', comfort: 'سفر، طبیعت باز، مطالعه فلسفه و هدف‌گذاری‌های الهام‌بخش.' },
  capricorn: { emotions: 'در ابراز احساسات خویشتن‌دار، اصیل و بسیار متعهد هستید و عشقتان در گذر زمان ثابت می‌شود.', attachment: 'نیازمند احترام، ثبات، اهداف مشترک و تکیه‌گاهی مطمئن هستید.', comfort: 'تکمیل یک هدف مهم، کوهنوردی و خلوت باوقار.' },
  aquarius: { emotions: 'احساسات شما با درک انسانی، رفاقت عمیق و احترام به فردیت هر انسان همراه است.', attachment: 'رفاقت صمیمانه و تفاهم فکری زیربنای اصلی عشق برای شماست.', comfort: 'پرداختن به ایده‌های نو، کمک به دیگران و آزادی عمل.' },
  pisces: { emotions: 'قلب شما آیینه تمام‌نمای همدلی، لطافت، شهود و عشق بی‌مرز معنوی است.', attachment: 'نیازمند پیوندی شاعرانه، روحانی و سرشار از مهربانی و درک متقابل هستید.', comfort: 'مراقبه، گوش دادن به موسیقی کیهانی، خواب آرام و رویاپردازی خلاق.' },
};

const ASCENDANT_DETAILS: Record<string, { persona: string; approach: string; energy: string }> = {
  aries: { persona: 'در برخورد اول فردی پرانرژی، مصمم، رک و با اعتمادبه‌نفس بالا دیده می‌شوید.', approach: 'بدون تردید و با شجاعت وارد موقعیت‌های جدید می‌شوید و عمل‌گرا هستید.', energy: 'حضور شما در هر جمعی تحرک، انگیزه و پویایی ایجاد می‌کند.' },
  taurus: { persona: 'تصویر بیرونی شما آرام، باوقار، خوش‌سلیقه و بسیار قابل اعتماد است.', approach: 'با گام‌های شمرده، سنجیده و مطمئن وارد هر مسیر تازه می‌شوید.', energy: 'حضور شما به اطرافیان حس امنیت، ثبات و آرامش منتقل می‌کند.' },
  gemini: { persona: 'در نگاه اول فردی خوش‌صحبت، باهوش، شاداب و اجتماعی به نظر می‌رسید.', approach: 'با پرسشگری، جمع‌آوری اطلاعات و ایجاد ارتباط سریع با محیط هماهنگ می‌شوید.', energy: 'انرژی شما جوان، پویا و تسهیل‌کننده ارتباط میان انسان‌هاست.' },
  cancer: { persona: 'در برخورد اول فردی مهربان، صمیمی، دلسوز و قابل اعتماد دیده می‌شوید.', approach: 'ابتدا امنیت عاطفی محیط را می‌سنجید و سپس با گرمی کامل ارتباط می‌گیرید.', energy: 'حضور شما حس همدلی، آرامش و صمیمیت خانوادگی ایجاد می‌کند.' },
  leo: { persona: 'دارای حضوری درخشان، باوقار، گرم و کاریزماتیک هستید که به‌راحتی توجه را جلب می‌کند.', approach: 'با اعتمادبه‌نفس، دست‌ودلبازی و دیدگاهی مثبت وارد میدان می‌شوید.', energy: 'انرژی شما گرمابخش، الهام‌بخش و شادی‌آفرین است.' },
  virgo: { persona: 'در نگاه اول فردی آراسته، متفکر، دقیق، مودب و توانمند به نظر می‌رسید.', approach: 'پیش از هر اقدامی جزئیات را تحلیل کرده و با برنامه‌ریزی دقیق جلو می‌روید.', energy: 'حضور شما نظم، شفافیت و کارآمدی به محیط می‌بخشد.' },
  libra: { persona: 'دارای ظاهری دلنشین، لبخندی آرام، رفتاری دیپلماتیک و بسیار موقر هستید.', approach: 'همواره به دنبال ایجاد تفاهم، زیبایی و تعادل در آغاز هر رابطه یا کاری هستید.', energy: 'انرژی شما لطیف، صلح‌آمیز و هماهنگ‌کننده جمع است.' },
  scorpio: { persona: 'دارای نگاهی عمیق، حضوری مقتدر، کاریزمای رازآلود و شخصیتی تاثیرگذار هستید.', approach: 'با هوشیاری کامل به عمق نیت افراد و موقعیت‌ها پی می‌برید و سطحی عمل نمی‌کنید.', energy: 'انرژی شما متمرکز، نافذ و تحول‌آفرین است.' },
  sagittarius: { persona: 'در برخورد اول فردی خوش‌رو، پرشور، آزاداندیش و الهام‌بخش دیده می‌شوید.', approach: 'با دیدگاهی خوش‌بینانه و نگاهی به افق‌های بزرگ به استقبال تجربه‌ها می‌روید.', energy: 'حضور شما امید، انگیزه و وسعت دید به دیگران می‌بخشد.' },
  capricorn: { persona: 'تصویر بیرونی شما پخته، حرفه‌ای، باانضباط و دارای اقتدار طبیعی است.', approach: 'با هدف‌گذاری مشخص، واقع‌بینی و برنامه‌ریزی بلندمدت گام برمی‌دارید.', energy: 'انرژی شما ساختارمند، جدی و اطمینان‌بخش است.' },
  aquarius: { persona: 'در نگاه اول فردی متفاوت، مستقل، روشنفکر و صمیمی به نظر می‌رسید.', approach: 'با روشی نوآورانه و خارج از کلیشه‌های مرسوم با مسائل روبرو می‌شوید.', energy: 'حضور شما الهام‌بخش آزادی فکری، اصالت و نوآوری است.' },
  pisces: { persona: 'دارای چهره‌ای آرام، نگاهی رویایی، رفتاری منعطف و سرشار از مهربانی هستید.', approach: 'با شهود قلبی و حس کردن انرژی محیط، مسیر خود را به نرمی پیدا می‌کنید.', energy: 'انرژی شما التیام‌بخش، شاعرانه و آرامش‌دهنده است.' },
};

const CHAKRAS_DATA = [
  { name: 'چاکرای ریشه (Muladhara)', color: '#EF4444', element: 'خاک', stone: 'گارنت و جاسپر سرخ', focus: 'امنیت، ثبات مادی و ریشه‌دار بودن در لحظه اکنون.' },
  { name: 'چاکرای خاجی (Svadhisthana)', color: '#F97316', element: 'آب', stone: 'کارنلین و سنگ ماه', focus: 'خلاقیت، شور زندگی و جریان سالم احساسات.' },
  { name: 'چاکرای شبکه خورشیدی (Manipura)', color: '#EAB308', element: 'آتش', stone: 'سیترین و چشم ببر', focus: 'اراده شخصی، اعتمادبه‌نفس و قدرت اقدام.' },
  { name: 'چاکرای قلب (Anahata)', color: '#10B981', element: 'باد', stone: 'زمرد و کوارتز صورتی', focus: 'عشق بی‌قیدوشرط، بخشش، همدلی و آرامش قلبی.' },
  { name: 'چاکرای گلو (Vishuddha)', color: '#0EA5E9', element: 'اتر', stone: 'آکوامارین و فیروزه', focus: 'بیان صادقانه، ارتباط شفاف و ابراز حقیقت درون.' },
  { name: 'چاکرای چشم سوم (Ajna)', color: '#6366F1', element: 'نور', stone: 'لاجورد و یاقوت کبود', focus: 'شهود، بصیرت درونی و درک الگوهای کلان زندگی.' },
  { name: 'چاکرای تاج (Sahasrara)', color: '#A855F7', element: 'آگاهی', stone: 'آمتیست و کوارتز شفاف', focus: 'اتصال معنوی، خرد ناب و یگانگی با هستی.' },
];

const DAILY_COLORS = [
  'طلایی کهربایی',
  'بنفش کیهانی',
  'آبی لاجوردی',
  'سبز زمردی',
  'سرخ یاقوتی',
  'نقره‌ای مهتابی',
  'فیروزه‌ای روشن',
];

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
  const user = useAuthStore((s) => s.user);
  const sub = useSubscription();

  const [birth, setBirth] = useState<BirthProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDailyCardDetailView, setShowDailyCardDetailView] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  const [dreamQuery, setDreamQuery] = useState('');
  const [dreamCategory, setDreamCategory] = useState<string>('همه');
  const [drawnRuneIndex, setDrawnRuneIndex] = useState<number>(0);

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
            year: 1368,
            month: 4,
            day: 15,
            birthTime: '14:30',
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
    const [hour, minute] = (birth.birthTime || '14:30').split(':').map(Number);
    const utc = birthToUtc(
      { year: birth.year, month: birth.month, day: birth.day },
      hour || 14,
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
    const nameAbjad = calculateAbjad(displayName || 'کاربر');

    const sumDigits = (n: number): number =>
      String(n)
        .split('')
        .reduce((acc, d) => acc + Number(d), 0);
    let tarotBirthNum = sumDigits(gBirth.year) + sumDigits(gBirth.month) + sumDigits(gBirth.day);
    while (tarotBirthNum > 21) {
      tarotBirthNum = sumDigits(tarotBirthNum);
    }
    const birthTarotCard = MAJOR_ARCANA[tarotBirthNum % MAJOR_ARCANA.length] || MAJOR_ARCANA[0];

    // کارت روزانه اختصاصی کاربر (هماهنگ با DailyCardSection با چرخه ۲۴ ساعته)
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const uniqueSeedString = `${user?.id || 'luma-guest'}-${user?.email || ''}-${todayKey}`;
    const hashVal = hashString(uniqueSeedString);
    const dailyTarotCard = ALL_TAROT_CARDS[hashVal % ALL_TAROT_CARDS.length] || MAJOR_ARCANA[0];

    const todayChart = calculateNatalChart(today, birth.latitude || 35.6892, birth.longitude || 51.389);
    const todayMoon = todayChart.planets.find((p) => p.planet === 'moon');

    const personalDayNumber = ((hashVal + lifePath.reduced) % 9) + 1;
    const dailyColor = DAILY_COLORS[hashVal % DAILY_COLORS.length];

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
      sunElement: SIGN_ELEMENT[sunKey] || 'fire',
      moonElement: SIGN_ELEMENT[moonKey] || 'water',
      ascElement: SIGN_ELEMENT[ascKey] || 'air',
      rulingPlanet: RULING_PLANETS_FA[sunKey] || 'خورشید',
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
  }, [birth, displayName, user?.id, user?.email]);

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

  const sunSignFa = SIGN_NAMES_FA[cosmicData.sunKey] || 'حمل';
  const moonSignFa = SIGN_NAMES_FA[cosmicData.moonKey] || 'سرطان';
  const ascSignFa = SIGN_NAMES_FA[cosmicData.ascKey] || sunSignFa;

  const sunDetail = SUN_SIGN_DETAILS[cosmicData.sunKey] || SUN_SIGN_DETAILS.aries;
  const moonDetail = MOON_SIGN_DETAILS[cosmicData.moonKey] || MOON_SIGN_DETAILS.cancer;
  const ascDetail = ASCENDANT_DETAILS[cosmicData.ascKey] || ASCENDANT_DETAILS.aries;

  const currentRune = ELDER_FUTHARK_RUNES[drawnRuneIndex] || ELDER_FUTHARK_RUNES[0];

  const GRID_ITEMS = [
    {
      id: 'daily-guidance',
      title: 'راهنمای امروز لوما',
      subtitle: `عدد روز: ${toPersianDigits(cosmicData.personalDayNumber)} • ${cosmicData.dailyColor}`,
      Icon: Sparkles,
      locked: false,
    },
    {
      id: 'weekly-forecast',
      title: 'چشم‌انداز هفتگی من',
      subtitle: 'روند انرژی ۷ روز آینده شما',
      Icon: Calendar,
      locked: !sub.isPremium,
      tierLabel: 'پریمیوم',
    },
    {
      id: 'monthly-forecast',
      title: 'تحلیل ماهانه من',
      subtitle: 'چرخه‌های اصلی ماه پیش رو',
      Icon: Star,
      locked: !sub.isPremium,
      tierLabel: 'پریمیوم',
    },
    {
      id: 'birthstone',
      title: 'سنگ ماه تولد و کریستال',
      subtitle: cosmicData.birthstone?.nameFa || 'سنگ تولد',
      Icon: Gem,
      locked: false,
    },
    {
      id: 'personal-numbers',
      title: 'اعداد من و اعداد شانس',
      subtitle: `مسیر زندگی: ${toPersianDigits(cosmicData.lifePath.reduced)}`,
      Icon: Hash,
      locked: false,
    },
    {
      id: 'birth-tarot',
      title: 'کارت تولد تاروت من',
      subtitle: cosmicData.birthTarotCard.nameFa,
      Icon: Star,
      locked: false,
    },
    {
      id: 'chakras',
      title: 'تعادل ۷ چاکرا و عنصر',
      subtitle: `عنصر غالب شما: ${SIGN_ELEMENT_FA[cosmicData.sunElement]}`,
      Icon: Activity,
      locked: false,
    },
    {
      id: 'dreams',
      title: 'فرهنگ‌نامه جامع تعبیر خواب',
      subtitle: `${toPersianDigits(COMPREHENSIVE_DREAMS.length)} نماد کامل رویا`,
      Icon: CloudMoon,
      locked: false,
    },
    {
      id: 'runes',
      title: 'فال ۲۴ رون باستانی',
      subtitle: 'تصاویر سنگ‌های Elder Futhark',
      Icon: Hexagon,
      locked: false,
    },
    {
      id: 'my-journal',
      title: 'دفترچه کیهانی من (Journal)',
      subtitle: `${toPersianDigits(notes.length)} یادداشت ثبت‌شده`,
      Icon: BookMarked,
      locked: false,
    },
  ];

  const modalTitles: Record<string, string> = {
    'sun-modal': `تحلیل جامع برج خورشیدی شما (${sunSignFa})`,
    'moon-modal': `تحلیل جامع برج ماه شما (${moonSignFa})`,
    'ascendant-modal': `تحلیل جامع طالع و رایزینگ شما (${ascSignFa})`,
  };

  return (
    <div className="space-y-5 pb-24">
      <PageHeader
        title="چارت شخصی من"
        subtitle={`${displayName} • ${formatJalaaliDate({ year: birth.year, month: birth.month, day: birth.day })} • ${birth.birthCity}`}
        action={
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={handleApplyMyElementTheme}>
              <ElementSvg element={cosmicData.sunElement} className="w-4 h-4" />
              تم {SIGN_ELEMENT_FA[cosmicData.sunElement]}
            </Button>
            {onNavigate && (
              <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
                ویرایش تولد
              </Button>
            )}
          </div>
        }
      />

      {/* سه کارت اصلی با تصاویر PNG سازگار با iOS/iPhone */}
      <div className="grid grid-cols-3 gap-2.5">
        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('sun-modal')}
        >
          <img src={getAssetUrl('icons/ui/sun.png')} alt="خورشید" className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">برج خورشیدی</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{sunSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">مشاهده تحلیل ذات</p>
        </Card>

        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('moon-modal')}
        >
          <img src={getAssetUrl('icons/ui/moon.png')} alt="ماه" className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">برج ماه</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{moonSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">تحلیل احساسات</p>
        </Card>

        <Card
          variant="gold-border"
          padding="sm"
          className="text-center cursor-pointer hover:scale-[1.03] transition-transform"
          onClick={() => setActiveModal('ascendant-modal')}
        >
          <img src={getAssetUrl('icons/ui/ascendant.png')} alt="طالع" className="w-9 h-9 mx-auto mb-1" />
          <p className="text-[10px] text-[var(--luma-text-muted)]">طالع (رایزینگ)</p>
          <p className="font-heading text-xs text-[var(--luma-text)] font-bold mt-0.5">{ascSignFa}</p>
          <p className="text-[9px] text-[var(--luma-gold)] mt-1">تصویر بیرونی</p>
        </Card>
      </div>

      {/* کارت راهنمای روزانه اختصاصی لوما به همراه تصویر کارت امروز */}
      <Card variant="elevated" padding="md" className="border-[var(--luma-gold)]/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="font-heading text-sm text-[var(--luma-gold)]">راهنمای روزانه اختصاصی لوما</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)] font-bold">
            کارت امروز: {cosmicData.dailyTarotCard.nameFa}
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
            title="کلیک برای مشاهده تفسیر اختصاصی کارت امروز"
          >
            <img
              src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
              alt={cosmicData.dailyTarotCard.nameFa}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
              }}
            />
          </button>

          <p className="text-xs text-[var(--luma-text)] leading-relaxed text-justify">
            با قرارگیری ماه در برج{' '}
            {cosmicData.todayMoon ? SIGN_NAMES_FA[cosmicData.todayMoon.sign.toLowerCase()] : moonSignFa} و
            ارتعاش کارت «{cosmicData.dailyTarotCard.nameFa}»، امروز برای شما روز تمرکز بر{' '}
            {cosmicData.dailyTarotCard.keywords.slice(0, 2).join(' و ')} است. رنگ هم‌ارتعاش امروز شما{' '}
            <span className="text-[var(--luma-gold)] font-bold">{cosmicData.dailyColor}</span> است.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => {
            setShowDailyCardDetailView(false);
            setActiveModal('daily-guidance');
          }}
        >
          مشاهده گزارش کامل روزانه (کارت، عشق، شغل و عدد روز)
        </Button>
      </Card>

      {/* شبکه ۱۰ بخشی ابزارها و اطلاعات شخصی */}
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

      {/* پنجره‌های جزئیات کاملاً اختصاصی */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md max-h-[88vh] overflow-y-auto bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--luma-border)] pb-3">
              <h3 className="font-heading text-base text-[var(--luma-gold)]">
                {modalTitles[activeModal] ||
                  GRID_ITEMS.find((g) => g.id === activeModal)?.title ||
                  'جزئیات چارت شخصی'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ۱. کادر کاملاً اختصاصی برج خورشیدی */}
            {activeModal === 'sun-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/sun.png')} alt="خورشید" className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">سیاره حاکم بر خورشید شما:</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{cosmicData.rulingPlanet}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">عنصر وجودی:</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{SIGN_ELEMENT_FA[cosmicData.sunElement]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">ذات، هویت و رسالت فردی:</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.identity}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">نقاط قوت و استعدادهای ذاتی:</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.strengths}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-amber-500 font-bold mb-1">چالش‌های رشد و خودآگاهی:</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.challenges}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-sky-500 font-bold mb-1">مسیرهای شغلی و حرفه‌ای هم‌سو:</p>
                  <p className="text-[var(--luma-text)]">{sunDetail.career}</p>
                </Card>
              </div>
            )}

            {/* ۲. کادر کاملاً اختصاصی برج ماه */}
            {activeModal === 'moon-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/moon.png')} alt="ماه" className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">جایگاه ماه در لحظه تولد:</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{moonSignFa}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">عنصر احساسی:</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{SIGN_ELEMENT_FA[cosmicData.moonElement]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">دنیای درون و واکنش‌های ناخودآگاه:</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.emotions}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-rose-500 font-bold mb-1">نیازهای عاطفی و سبک دلبستگی در عشق:</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.attachment}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">کلید آرامش و شارژ مجدد روحی شما:</p>
                  <p className="text-[var(--luma-text)]">{moonDetail.comfort}</p>
                </Card>
              </div>
            )}

            {/* ۳. کادر کاملاً اختصاصی طالع (رایزینگ) */}
            {activeModal === 'ascendant-modal' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img src={getAssetUrl('icons/ui/ascendant.png')} alt="طالع" className="w-10 h-10" />
                    <div>
                      <p className="text-[10px] text-[var(--luma-text-muted)]">برج طالع (افق شرقی تولد):</p>
                      <p className="font-bold text-sm text-[var(--luma-gold)]">{ascSignFa}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[var(--luma-text-muted)]">عنصر بیرونی:</p>
                    <p className="font-bold text-sm text-[var(--luma-text)]">{SIGN_ELEMENT_FA[cosmicData.ascElement]}</p>
                  </div>
                </div>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">تصویر بیرونی و برداشت اول دیگران:</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.persona}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-emerald-500 font-bold mb-1">سبک مواجهه شما با موقعیت‌های جدید:</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.approach}</p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-sky-500 font-bold mb-1">هاله انرژی و تاثیر حضور شما در جمع:</p>
                  <p className="text-[var(--luma-text)]">{ascDetail.energy}</p>
                </Card>
              </div>
            )}

            {/* ۴. کادر راهنمای امروز لوما (به همراه تصویر کارت و امکان ورود به صفحه تفسیر کارت و برگشت) */}
            {activeModal === 'daily-guidance' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                {showDailyCardDetailView ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-36 h-56 rounded-2xl overflow-hidden border-2 border-[var(--luma-gold)] shadow-2xl mb-3">
                        <img
                          src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
                          alt={cosmicData.dailyTarotCard.nameFa}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
                          }}
                        />
                      </div>
                      <h4 className="font-heading text-lg text-[var(--luma-gold)] font-bold">
                        {cosmicData.dailyTarotCard.nameFa} ({cosmicData.dailyTarotCard.nameEn})
                      </h4>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {cosmicData.dailyTarotCard.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)] font-bold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Card variant="elevated" padding="sm">
                      <p className="text-[var(--luma-gold)] font-bold mb-1">تفسیر اختصاصی این کارت برای امروز شما:</p>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                        حضور کارت «{cosmicData.dailyTarotCard.nameFa}» در کنار خورشید در {sunSignFa} و عدد روز شخصی{' '}
                        {toPersianDigits(cosmicData.personalDayNumber)} نشان می‌دهد: {cosmicData.dailyTarotCard.upright.meaning}
                      </p>
                    </Card>

                    <Card variant="elevated" padding="sm">
                      <p className="text-emerald-500 font-bold mb-1">توصیه عملی کارت برای امروز:</p>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                        امروز در تصمیمات خود انرژی «{cosmicData.dailyTarotCard.keywords[0] || 'آگاهی'}» را سرلوحه قرار دهید و از شتاب‌زدگی پرهیز نمایید.
                      </p>
                    </Card>

                    <Button
                      variant="gold"
                      fullWidth
                      onClick={() => setShowDailyCardDetailView(false)}
                    >
                      <ArrowRight className="w-4 h-4" />
                      بازگشت به پنجره راهنمای امروز
                    </Button>
                  </div>
                ) : (
                  <>
                    <Card variant="gold-border" padding="sm">
                      <div className="flex gap-3 items-start">
                        <img
                          src={getAssetUrl(`assets/tarot/cards/${cosmicData.dailyTarotCard.id}.webp`)}
                          alt={cosmicData.dailyTarotCard.nameFa}
                          onClick={() => setShowDailyCardDetailView(true)}
                          className="w-20 h-32 rounded-xl object-cover border border-[var(--luma-gold)] cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
                          }}
                        />
                        <div className="flex-1 space-y-2">
                          <p className="text-[var(--luma-gold)] font-bold">
                            پیام کارت امروز ({cosmicData.dailyTarotCard.nameFa}):
                          </p>
                          <p className="text-[var(--luma-text)] line-clamp-3">
                            {cosmicData.dailyTarotCard.upright.meaning}
                          </p>
                          <Button
                            variant="gold"
                            size="sm"
                            fullWidth
                            onClick={() => setShowDailyCardDetailView(true)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            مشاهده کارت و تفسیر کامل امروز
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card variant="elevated" padding="sm">
                      <div className="flex items-start gap-3">
                        <img
                          src={getAssetUrl('icons/ui/love.png')}
                          alt="عشق و روابط"
                          className="w-11 h-11 rounded-xl flex-shrink-0"
                        />
                        <div>
                          <p className="text-rose-500 font-bold mb-1">عشق و روابط امروز:</p>
                          <p className="text-[var(--luma-text)]">
                            هماهنگی برج ماه شما ({moonSignFa}) با آسمان امروز نشان می‌دهد گفتگوی صمیمانه و پرهیز از قضاوت عجولانه، پیوند عاطفی شما را تقویت می‌کند.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card variant="elevated" padding="sm">
                      <div className="flex items-start gap-3">
                        <img
                          src={getAssetUrl('icons/ui/career.png')}
                          alt="کار و امور مالی"
                          className="w-11 h-11 rounded-xl flex-shrink-0"
                        />
                        <div>
                          <p className="text-emerald-500 font-bold mb-1">کار و امور مالی امروز:</p>
                          <p className="text-[var(--luma-text)]">
                            با عدد روز شخصی {toPersianDigits(cosmicData.personalDayNumber)}، تمرکز روی اولویت‌های اصلی بیشترین بازدهی مالی را برایتان به همراه دارد.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            )}

            {/* ۵. کادر هفتگی */}
            {activeModal === 'weekly-forecast' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">نیمه اول هفته (شنبه تا دوشنبه):</p>
                  <p className="text-[var(--luma-text)]">
                    زمان مناسب برای آغاز گفتگوهای کاری، پیگیری برنامه‌های عقب‌افتاده و تنظیم بودجه هفتگی بر اساس عنصر {SIGN_ELEMENT_FA[cosmicData.sunElement]}.
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">میانه هفته (سه‌شنبه و چهارشنبه):</p>
                  <p className="text-[var(--luma-text)]">
                    اوج انرژی خلاقانه و تصمیم‌گیری. به شهود درونی برج ماه خود ({moonSignFa}) اعتماد کنید.
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">پایان هفته (پنج‌شنبه و جمعه):</p>
                  <p className="text-[var(--luma-text)]">
                    اختصاص زمان به استراحت، خانواده و بازیابی تعادل عاطفی.
                  </p>
                </Card>
              </div>
            )}

            {/* ۶. کادر ماهانه */}
            {activeModal === 'monthly-forecast' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">محور رشد شخصی و شغلی ماه جاری:</p>
                  <p className="text-[var(--luma-text)]">
                    با تاثیر سیاره حاکم شما ({cosmicData.rulingPlanet})، در این ماه فرصت‌هایی برای تثبیت جایگاه حرفه‌ای و بازنگری در اهداف بلندمدت پیش روی شما قرار می‌گیرد.
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">محور عاطفی و روابط ماهانه:</p>
                  <p className="text-[var(--luma-text)]">
                    شفافیت در بیان خواسته‌ها و درک متقابل، کلید آرامش پایدار شما در چهار هفته پیش روست.
                  </p>
                </Card>
              </div>
            )}

            {/* ۷. کادر سنگ ماه تولد */}
            {activeModal === 'birthstone' && cosmicData.birthstone && (
              <div className="space-y-3 text-xs leading-relaxed text-center">
                <img
                  src={getAssetUrl(`icons/birthstones/${cosmicData.birthstone.nameEn.toLowerCase()}.png`)}
                  alt={cosmicData.birthstone.nameFa}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[var(--luma-gold)]"
                />
                <h4 className="font-heading text-base text-[var(--luma-gold)]">
                  {cosmicData.birthstone.nameFa} ({cosmicData.birthstone.nameEn})
                </h4>
                <p className="text-[var(--luma-text)] text-justify">
                  سنگ ماه تولد شما نماد تعادل، تمرکز و هم‌سویی با عنصر {SIGN_ELEMENT_FA[cosmicData.sunElement]} است. همراه داشتن یا تمرکز بر رنگ این کریستال در مراقبه‌های روزانه به آرامش ذهنی کمک می‌کند.
                </p>
              </div>
            )}

            {/* ۸. کادر اعداد شخصی و شانس */}
            {activeModal === 'personal-numbers' && (
              <div className="space-y-3 text-xs leading-relaxed text-justify">
                <Card variant="elevated" padding="sm" className="text-center">
                  <p className="text-[var(--luma-text-muted)]">عدد مسیر زندگی (Life Path)</p>
                  <p className="text-3xl font-bold text-[var(--luma-gold)] my-1">
                    {toPersianDigits(cosmicData.lifePath.reduced)}
                  </p>
                  <p className="text-[var(--luma-text)] text-justify">
                    {cosmicData.lifePathMeaning?.meaning}
                  </p>
                </Card>
                <Card variant="elevated" padding="sm">
                  <p className="text-[var(--luma-gold)] font-bold mb-2">اعداد خوش‌شانسی و هم‌ارتعاش شما:</p>
                  <div className="flex justify-center gap-3">
                    {cosmicData.luckyNumbers.map((num, idx) => (
                      <span
                        key={idx}
                        className="w-9 h-9 rounded-full bg-[var(--luma-gold-glow)] border border-[var(--luma-gold)] flex items-center justify-center font-bold text-[var(--luma-gold)]"
                      >
                        {toPersianDigits(num)}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ۹. کادر کارت تولد تاروت */}
            {activeModal === 'birth-tarot' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="flex gap-4 items-center">
                  <img
                    src={getAssetUrl(`assets/tarot/cards/${cosmicData.birthTarotCard.id}.webp`)}
                    alt={cosmicData.birthTarotCard.nameFa}
                    className="w-24 h-36 rounded-xl object-cover border border-[var(--luma-gold)]/40"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
                    }}
                  />
                  <div>
                    <h4 className="font-heading text-base text-[var(--luma-gold)] mb-1">
                      {cosmicData.birthTarotCard.nameFa}
                    </h4>
                    <p className="text-[11px] text-[var(--luma-text-muted)] mb-2">
                      کارت تولد و کهن‌الگوی روح شما در آرکانای کبیر
                    </p>
                  </div>
                </div>
                <p className="text-[var(--luma-text)] text-justify">
                  {cosmicData.birthTarotCard.upright.meaning}
                </p>
              </div>
            )}

            {/* ۱۰. کادر ۷ چاکرا با تصویر PNG */}
            {activeModal === 'chakras' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[var(--luma-bg-subtle)]">
                  <img src={getAssetUrl('icons/ui/chakra.png')} alt="چاکرا" className="w-10 h-10" />
                  <p className="text-[var(--luma-text)]">
                    راهنمای تعادل ۷ مرکز انرژی بدن و سنگ‌های هم‌ارتعاش هر چاکرا:
                  </p>
                </div>
                {CHAKRAS_DATA.map((ch, i) => (
                  <Card key={i} variant="elevated" padding="sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold" style={{ color: ch.color }}>{ch.name}</span>
                      <span className="text-[10px] text-[var(--luma-text-muted)]">سنگ: {ch.stone}</span>
                    </div>
                    <p className="text-[var(--luma-text)] leading-relaxed text-justify">{ch.focus}</p>
                  </Card>
                ))}
              </div>
            )}

            {/* ۱۱. کادر فرهنگ‌نامه جامع تعبیر خواب (۵۰+ نماد دسته‌بندی‌شده) */}
            {activeModal === 'dreams' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <img src={getAssetUrl('icons/ui/dream.png')} alt="تعبیر خواب" className="w-9 h-9" />
                  <div className="relative flex-1">
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--luma-text-muted)]" />
                    <input
                      type="text"
                      value={dreamQuery}
                      onChange={(e) => setDreamQuery(e.target.value)}
                      placeholder="جستجوی نماد خواب (پرواز، دریا، مار، طلا، باران، کلید...)"
                      className="w-full pr-8 pl-3 py-2 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['همه', 'طبیعت و عناصر', 'حیوانات', 'پرواز و حرکت', 'اشیاء و مکان‌ها', 'انسان و حالات', 'رنگ و اعداد'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setDreamCategory(cat)}
                        className={
                          'px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap border ' +
                          (dreamCategory === cat
                            ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold'
                            : 'border-[var(--luma-border)] text-[var(--luma-text-muted)]')
                        }
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {COMPREHENSIVE_DREAMS.filter((d) => {
                    const matchCat = dreamCategory === 'همه' || d.category === dreamCategory;
                    const q = dreamQuery.trim();
                    const matchQ = !q || d.symbol.includes(q) || d.meaning.includes(q) || d.advice.includes(q);
                    return matchCat && matchQ;
                  }).map((d, i) => (
                    <Card key={i} variant="elevated" padding="sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--luma-gold)]">{d.symbol}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                          {d.category}
                        </span>
                      </div>
                      <p className="text-[var(--luma-text)] leading-relaxed text-justify mb-1.5">
                        {d.meaning}
                      </p>
                      <p className="text-[10px] text-emerald-500 text-justify">
                        راهنمایی: {d.advice}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ۱۲. کادر فال ۲۴ رون باستانی با تصاویر PNG واقعی */}
            {activeModal === 'runes' && (
              <div className="space-y-4 text-xs text-center">
                <div className="flex flex-col items-center">
                  <img
                    src={getAssetUrl(`icons/runes/rune-${currentRune.index}.png`)}
                    alt={currentRune.nameFa}
                    className="w-28 h-36 object-contain mx-auto mb-2 drop-shadow-xl"
                  />
                  <h4 className="font-heading text-base text-[var(--luma-gold)] font-bold">
                    {currentRune.nameFa} ({currentRune.nameEn})
                  </h4>
                  <span className="text-[10px] text-[var(--luma-text-muted)] mt-0.5">
                    عنصر: {currentRune.element}
                  </span>
                  <div className="flex gap-1.5 justify-center mt-2">
                    {currentRune.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <Card variant="elevated" padding="sm" className="text-right">
                  <p className="text-[var(--luma-gold)] font-bold mb-1">تفسیر سنگ رون شما:</p>
                  <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                    {currentRune.meaning}
                  </p>
                </Card>

                <Card variant="elevated" padding="sm" className="text-right">
                  <p className="text-emerald-500 font-bold mb-1">توصیه عملی:</p>
                  <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                    {currentRune.advice}
                  </p>
                </Card>

                <Button
                  variant="gold"
                  size="sm"
                  fullWidth
                  onClick={() => setDrawnRuneIndex(Math.floor(Math.random() * ELDER_FUTHARK_RUNES.length))}
                >
                  کشیدن یک سنگ رون جدید از کیسه
                </Button>

                <div className="pt-2 border-t border-[var(--luma-border)] text-right">
                  <p className="text-[10px] text-[var(--luma-text-muted)] mb-2">
                    یا از بین ۲۴ سنگ رون باستانی انتخاب کنید:
                  </p>
                  <div className="grid grid-cols-6 gap-1.5 max-h-40 overflow-y-auto p-1">
                    {ELDER_FUTHARK_RUNES.map((r) => (
                      <button
                        key={r.index}
                        type="button"
                        onClick={() => setDrawnRuneIndex(r.index)}
                        className={
                          'p-1 rounded-xl border flex flex-col items-center ' +
                          (drawnRuneIndex === r.index
                            ? 'border-[var(--luma-gold)] bg-[var(--luma-gold)]/15'
                            : 'border-[var(--luma-border)] bg-[var(--luma-bg-subtle)]')
                        }
                      >
                        <img
                          src={getAssetUrl(`icons/runes/rune-${r.index}.png`)}
                          alt={r.nameEn}
                          className="w-8 h-10 object-contain"
                        />
                        <span className="text-[8px] text-[var(--luma-text)] truncate w-full text-center">
                          {r.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ۱۳. کادر دفترچه کیهانی من */}
            {activeModal === 'my-journal' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2 p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="عنوان یادداشت، خواب یا تجربه شهودی..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <div className="flex gap-1.5">
                    {[
                      { id: 'daily', label: 'روزانه' },
                      { id: 'tarot', label: 'تاروت' },
                      { id: 'astrology', label: 'نجومی' },
                      { id: 'dream', label: 'تعبیر خواب' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNoteCategory(cat.id as any)}
                        className={
                          'px-2.5 py-1 rounded-full text-[10px] border ' +
                          (noteCategory === cat.id
                            ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold'
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
                    placeholder="یادداشت شخصی، نشانه یا خواب خود را بنویسید..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <Button variant="gold" size="sm" fullWidth onClick={handleAddNote}>
                    <Plus className="w-3.5 h-3.5" />
                    ثبت در دفترچه کیهانی
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-center text-[var(--luma-text-muted)] py-4">
                      هنوز یادداشتی در دفترچه شما ثبت نشده است.
                    </p>
                  ) : (
                    notes.map((n) => (
                      <Card key={n.id} variant="elevated" padding="sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[var(--luma-gold)]">{n.title}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(n.id)}
                            className="text-red-500 hover:opacity-80"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[var(--luma-text)] leading-relaxed text-justify">
                          {n.content}
                        </p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            <Button variant="secondary" fullWidth onClick={() => setActiveModal(null)}>
              بستن پنجره
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

