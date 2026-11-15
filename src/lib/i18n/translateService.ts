import { EventDesignData } from "@/types/invitation";
import { resolveSubtitle } from "@/lib/templates/categories";
import { LanguageCode, getLanguageMeta } from "./languages";

export { resolveSubtitle };
import {
  BLESSING_TRANSLATIONS,
  PHRASE_TRANSLATIONS,
  UI_TRANSLATIONS,
  TranslationKey,
} from "./translations";

const clientMemoryCache = new Map<string, string>();

function getStorageCacheKey(text: string, lang: string): string {
  return `invitovix_tr_${lang}_${text.trim().toLowerCase()}`;
}

const COMMON_NAME_MAP: Record<string, Partial<Record<LanguageCode, string>>> = {
  amina: { ur: "آمنہ", ar: "أمينة", hi: "अमीना", bn: "আমিনা" },
  zayan: { ur: "زیان", ar: "زيان", hi: "ज़यान", bn: "যায়ান" },
  fatima: { ur: "فاطمہ", ar: "فاطمة", hi: "फातिमा", bn: "ফাতিমা" },
  bilal: { ur: "بلال", ar: "بلال", hi: "बिलाल", bn: "বিলাল" },
  sarah: { ur: "سارہ", ar: "سارة", hi: "सारा", bn: "সারা" },
  sara: { ur: "سارہ", ar: "سارة", hi: "सारा", bn: "সারা" },
  ali: { ur: "علی", ar: "علي", hi: "अली", bn: "আলী" },
  aarav: { ur: "آرو", ar: "آراف", hi: "आरव", bn: "আরভ" },
  diya: { ur: "دیا", ar: "ديا", hi: "दीया", bn: "দিয়া" },
  zain: { ur: "زین", ar: "زين", hi: "ज़ैन", bn: "জাইন" },
  maya: { ur: "مایا", ar: "مايا", hi: "माया", bn: "মায়া" },
  hamza: { ur: "حمزہ", ar: "حمزة", hi: "हमज़ा", bn: "হামজা" },
  alina: { ur: "علینہ", ar: "ألينا", hi: "अलीना", bn: "আলিনা" },
  tariq: { ur: "طارق", ar: "طارق", hi: "तारिक", bn: "তারিক" },
  mansoor: { ur: "منصور", ar: "منصور", hi: "मंसूर", bn: "মনসুর" },
  khan: { ur: "خان", ar: "خان", hi: "खान", bn: "খান" },
  ahmed: { ur: "احمد", ar: "أحمد", hi: "अहमद", bn: "আহমেদ" },
  malik: { ur: "ملک", ar: "مالك", hi: "मलिक", bn: "মালিক" },
  hassan: { ur: "حسن", ar: "حسن", hi: "हसन", bn: "হাসান" },
  hussain: { ur: "حسین", ar: "حسين", hi: "हुसैन", bn: "হোসেন" },
  usman: { ur: "عثمان", ar: "عثمان", hi: "उस्मान", bn: "উসমান" },
  omar: { ur: "عمر", ar: "عمر", hi: "उमर", bn: "ওমর" },
  aisha: { ur: "عائشہ", ar: "عائشة", hi: "आयशा", bn: "আয়েশা" },
  maryam: { ur: "مریم", ar: "مريم", hi: "मरियम", bn: "মরিয়ম" },
  elena: { ur: "ایلینا", ar: "إيلينا", hi: "एलेना", bn: "এলেনা" },
  matteo: { ur: "میٹیو", ar: "ماتيو", hi: "माटेओ", bn: "মাতেও" },
  zara: { ur: "زارا", ar: "زارا", hi: "ज़ारा", bn: "জারা" },
  daniel: { ur: "ڈینیل", ar: "دانيال", hi: "डैनियल", bn: "ড্যানিয়েল" },
  ahmad: { ur: "احمد", ar: "أحمد", hi: "अहमद", bn: "আহমেদ" },
  hasan: { ur: "حسن", ar: "حسن", hi: "हसन", bn: "হাসান" },
  hussein: { ur: "حسین", ar: "حسين", hi: "हुसैन", bn: "হোসেন" },
  othman: { ur: "عثمان", ar: "عثمان", hi: "उस्मान", bn: "উসমান" },
  umar: { ur: "عمر", ar: "عمر", hi: "उमर", bn: "ওমর" },
  ayesha: { ur: "عائشہ", ar: "عائشة", hi: "आयशा", bn: "আয়েশা" },
  mariam: { ur: "مریم", ar: "مريم", hi: "मरियम", bn: "মরিয়ম" },
  noor: { ur: "نور", ar: "نور", hi: "नूर", bn: "নূর" },
  muhammad: { ur: "محمد", ar: "محمد", hi: "मुहम्मद", bn: "মুহাম্মদ" },
  mohammad: { ur: "محمد", ar: "محمد", hi: "मोहम्मद", bn: "মোহাম্মদ" },
  mohammed: { ur: "محمد", ar: "محمد", hi: "मोहम्मद", bn: "মোহাম্মদ" },
  syed: { ur: "سید", ar: "سيد", hi: "सैयद", bn: "সৈয়দ" },
  sayed: { ur: "سید", ar: "سيد", hi: "सैयद", bn: "সৈয়দ" },
  sheikh: { ur: "شیخ", ar: "شيخ", hi: "शेख", bn: "শেখ" },
  mirza: { ur: "مرزا", ar: "ميرزا", hi: "मिर्ज़ा", bn: "মির্জা" },
  chaudhry: { ur: "چوہدری", ar: "شودري", hi: "चौधरी", bn: "চৌধুরী" },
  choudhary: { ur: "چوہدری", ar: "شودري", hi: "चौधरी", bn: "চৌধুরী" },
  butt: { ur: "بٹ", ar: "بت", hi: "बट्ट", bn: "বাট" },
  qureshi: { ur: "قریشی", ar: "قريشي", hi: "कुरैशी", bn: "কুরেশী" },
  siddiqui: { ur: "صدیقی", ar: "صديقي", hi: "सिद्दीकी", bn: "সিদ্দিকী" },
  abbasi: { ur: "عباسی", ar: "عباسي", hi: "अब्बासी", bn: "আব্বاسى" },
  baig: { ur: "بیگ", ar: "بيك", hi: "बेग", bn: "বেগ" },
  mughal: { ur: "مغل", ar: "مغول", hi: "मुगल", bn: "মুঘল" },
  niazi: { ur: "نیازی", ar: "نيازي", hi: "नियाज़ी", bn: "নিয়াজী" },
  bukhari: { ur: "بخاری", ar: "بخاري", hi: "बुखारी", bn: "বুখারী" },
  shah: { ur: "شاہ", ar: "شاه", hi: "शाह", bn: "শাহ" },
  raja: { ur: "راجہ", ar: "راجا", hi: "राजा", bn: "রাজা" },
  rana: { ur: "رانا", ar: "رانا", hi: "राणा", bn: "রানা" },
  gill: { ur: "گل", ar: "جيل", hi: "गिल", bn: "গিল" },
  sethi: { ur: "سیٹھی", ar: "سيثي", hi: "सेठी", bn: "শেঠি" },
  vohra: { ur: "ووہرا", ar: "فوهرا", hi: "वोहरा", bn: "ভোহরা" },
  kapoor: { ur: "کپور", ar: "كابور", hi: "कपूर", bn: "কাপুর" },
  sharma: { ur: "شرما", ar: "شارما", hi: "शर्मा", bn: "শর্মা" },
  verma: { ur: "ورما", ar: "فيرما", hi: "वर्मा", bn: "ভার্মা" },
  singh: { ur: "سنگھ", ar: "سينغ", hi: "सिंह", bn: "সিং" },
  kashif: { ur: "کاشف", ar: "كاشف", hi: "काशिफ", bn: "কাশিফ" },
  adeel: { ur: "عدیل", ar: "عديل", hi: "अदील", bn: "আদিল" },
  noman: { ur: "نعمان", ar: "نعمان", hi: "नोमान", bn: "নোমান" },
  waqas: { ur: "وقاص", ar: "وقاص", hi: "वक़ास", bn: "ওয়াকাস" },
  shahid: { ur: "شاہد", ar: "شاهد", hi: "शाहिद", bn: "শাহিদ" },
  farooq: { ur: "فاروق", ar: "فاروق", hi: "फारूक", bn: "ফারুক" },
  junaid: { ur: "جنید", ar: "جنيد", hi: "जुनैद", bn: "জুনায়েদ" },
  naveed: { ur: "نوید", ar: "نويد", hi: "नवेद", bn: "নাভিদ" },
  taimoor: { ur: "تیمور", ar: "تيمور", hi: "तैमूर", bn: "তৈমুর" },
  zubair: { ur: "زبیر", ar: "زبير", hi: "ज़ुबैर", bn: "জুবায়ের" },
  ahsan: { ur: "احسن", ar: "أحسن", hi: "अहसन", bn: "আহসান" },
  asad: { ur: "اسد", ar: "أسد", hi: "असद", bn: "আসাদ" },
  babar: { ur: "بابر", ar: "بابر", hi: "बाबर", bn: "বাাবر" },
  haris: { ur: "حارث", ar: "حارث", hi: "हारिस", bn: "হারিস" },
  harris: { ur: "حارث", ar: "حارث", hi: "हारिस", bn: "হারিস" },
  taha: { ur: "طہٰ", ar: "طه", hi: "ताहा", bn: "ত্বহা" },
  mustafa: { ur: "مصطفیٰ", ar: "مصطفى", hi: "मुस्तफा", bn: "মুস্তফা" },
  ibrahim: { ur: "ابراہیم", ar: "إبراهيم", hi: "इब्राहिम", bn: "ইব্রাহিম" },
  ismail: { ur: "اسماعیل", ar: "إسماعيل", hi: "इस्माइल", bn: "ইসমাইল" },
  yusuf: { ur: "یوسف", ar: "يوسف", hi: "यूसुफ", bn: "ইউসুফ" },
  yousuf: { ur: "یوسف", ar: "يوسف", hi: "यूसुफ", bn: "ইউসুফ" },
  rayan: { ur: "ریان", ar: "ريان", hi: "रयान", bn: "রায়ান" },
  ayaan: { ur: "ایان", ar: "أيان", hi: "अयान", bn: "আয়ান" },
  farhan: { ur: "فرحان", ar: "فرحان", hi: "फरहान", bn: "ফারহান" },
  imran: { ur: "عمران", ar: "عمران", hi: "इमरान", bn: "ইমরান" },
  salman: { ur: "سلمان", ar: "سلمان", hi: "सलमान", bn: "সালমান" },
  rizwan: { ur: "رضوان", ar: "رضوان", hi: "रिजवान", bn: "রিজওয়ান" },
  shahzaib: { ur: "شاہ زیب", ar: "شاه زيب", hi: "शाहज़ेब", bn: "শাহজেব" },
  shayan: { ur: "شایان", ar: "شايان", hi: "शायान", bn: "শায়ান" },
  rehan: { ur: "ریحان", ar: "ريحان", hi: "रेहान", bn: "রেহান" },
  daniyal: { ur: "دانیال", ar: "دانيال", hi: "दानियाल", bn: "দানিয়াল" },
  faisal: { ur: "فیصل", ar: "فيصل", hi: "फैसल", bn: "ফয়সাল" },
  raza: { ur: "رضا", ar: "رضا", hi: "रज़ा", bn: "রেজা" },
  anaya: { ur: "عنایہ", ar: "عناية", hi: "अनाया", bn: "অনন্যা" },
  hania: { ur: "ہانیہ", ar: "هانية", hi: "हानिया", bn: "হানিয়া" },
  dua: { ur: "دعا", ar: "دعاء", hi: "दुआ", bn: "দোয়া" },
  mahnoor: { ur: "ماہ نور", ar: "ماه نور", hi: "माहनूर", bn: "মাহনূর" },
  areeba: { ur: "اریبہ", ar: "أريبة", hi: "अरीबा", bn: "আরিবা" },
  alizeh: { ur: "علیزے", ar: "عليزيه", hi: "अलिज़ेह", bn: "আলিজে" },
  kinza: { ur: "کنزہ", ar: "كنزة", hi: "किंज़ा", bn: "কিনজা" },
  laiba: { ur: "لائبہ", ar: "لائبة", hi: "लाइबा", bn: "লাইবা" },
  mehak: { ur: "مہک", ar: "مهك", hi: "महक", bn: "মেহক" },
  iqra: { ur: "اقراء", ar: "إقراء", hi: "इकरा", bn: "ইকরা" },
  bushra: { ur: "بشریٰ", ar: "بشرى", hi: "बुशरा", bn: "বুশরা" },
  sadia: { ur: "سعدیہ", ar: "سعدية", hi: "सादिया", bn: "সাদিয়া" },
  hina: { ur: "حنا", ar: "حناء", hi: "हिना", bn: "হিনা" },
  sana: { ur: "ثنا", ar: "ثناء", hi: "सना", bn: "সানা" },
  saba: { ur: "صبا", ar: "صبا", hi: "सबा", bn: "সাবা" },
  rabia: { ur: "رابعہ", ar: "رابعة", hi: "राबिया", bn: "রাবেয়া" },
  kiran: { ur: "کرن", ar: "كيران", hi: "किरण", bn: "কিরণ" },
  zoya: { ur: "زویا", ar: "زويا", hi: "ज़ोया", bn: "জোয়া" },
  rida: { ur: "ردا", ar: "رداء", hi: "रिदा", bn: "রিদা" },
  hiba: { ur: "ہبہ", ar: "هبة", hi: "हिबा", bn: "হিবা" },
  khadija: { ur: "خدیجہ", ar: "خديجة", hi: "खदीजा", bn: "খাদিজা" },
  zainab: { ur: "زینب", ar: "زينب", hi: "ज़ैनब", bn: "জয়নব" },
  hafsa: { ur: "حفصہ", ar: "حفصة", hi: "हफ़सा", bn: "হাফসা" },
  sumayya: { ur: "سمیہ", ar: "سمية", hi: "सुमैय्या", bn: "সুমাইয়া" },
  layla: { ur: "لیلیٰ", ar: "ليلى", hi: "लैला", bn: "লায়লা" },
  laila: { ur: "لیلیٰ", ar: "ليلى", hi: "लैला", bn: "লায়লা" },
  yasmin: { ur: "یاسمین", ar: "ياسمين", hi: "यास्मीन", bn: "ইয়াসমিন" },
  nadia: { ur: "نادیہ", ar: "نادية", hi: "नादिया", bn: "নদিয়া" },
  samira: { ur: "سمیرہ", ar: "سميرة", hi: "समीरा", bn: "সমিরা" },
  rohan: { ur: "روہن", ar: "روهان", hi: "रोहन", bn: "রোহন" },
  arjun: { ur: "ارجن", ar: "أرجون", hi: "अर्जुन", bn: "অর্জুন" },
  kabir: { ur: "کبیر", ar: "كبير", hi: "कबीर", bn: "কবীর" },
  vivaan: { ur: "ویوان", ar: "فيفان", hi: "विवान", bn: "ভিভান" },
  aditya: { ur: "آدتیہ", ar: "أديتيا", hi: "आदित्य", bn: "আদিত্য" },
  vihaan: { ur: "ویہان", ar: "فيهان", hi: "विहान", bn: "বিহান" },
  reyansh: { ur: "ریانش", ar: "ريانش", hi: "रेयांश", bn: "রেয়াংশ" },
  ananya: { ur: "اننیا", ar: "أنانيا", hi: "अनन्या", bn: "অনন্যা" },
  saanvi: { ur: "سانوی", ar: "سانفي", hi: "सान्वी", bn: "সানভি" },
  ishita: { ur: "اشتا", ar: "إيشيتا", hi: "इशिता", bn: "ইশিতা" },
  riya: { ur: "ریا", ar: "ريا", hi: "रिया", bn: "রিয়া" },
  shreya: { ur: "شریا", ar: "شريا", hi: "श्रेया", bn: "শ্রেয়া" },
  tanvi: { ur: "تنوی", ar: "تانفي", hi: "तन्वी", bn: "তন্বী" },
  kavya: { ur: "کاویہ", ar: "كافيا", hi: "काव्या", bn: "কাব্যা" },
  pooja: { ur: "پوجا", ar: "بوجا", hi: "पूजा", bn: "পূজা" },
  neha: { ur: "نیہا", ar: "نيها", hi: "नेहा", bn: "নেহা" },
  priya: { ur: "پریا", ar: "بريا", hi: "प्रिया", bn: "প্রিয়া" },
  emily: { ur: "ایملی", ar: "إيميلي", hi: "एमिली", bn: "এমিলি" },
  sophia: { ur: "صوفیہ", ar: "صوفيا", hi: "सोफिया", bn: "সোফিয়া" },
  olivia: { ur: "اولیویا", ar: "أوليفيا", hi: "ओलिविया", bn: "অলিভিয়া" },
  mia: { ur: "میا", ar: "ميا", hi: "मिया", bn: "মিয়া" },
  isabella: { ur: "ازابیلا", ar: "إيزابيلا", hi: "इसाबेला", bn: "ইসাবেলা" },
  charlotte: { ur: "شارلٹ", ar: "شارلوت", hi: "शार्लोट", bn: "শার্লট" },
  emma: { ur: "ایما", ar: "إيما", hi: "एम्मा", bn: "এমা" },
  john: { ur: "جان", ar: "جون", hi: "जॉन", bn: "জন" },
  david: { ur: "ڈیوڈ", ar: "ديفيد", hi: "डेविड", bn: "ডেভিড" },
  joseph: { ur: "جوزف", ar: "جوزيف", hi: "जोसेफ", bn: "জোসেফ" },
  adam: { ur: "آدم", ar: "آدم", hi: "आदम", bn: "আদম" },
  noah: { ur: "نوح", ar: "نوح", hi: "नोआ", bn: "নোয়া" },
  lucas: { ur: "لوکاس", ar: "لوكاس", hi: "लुकास", bn: "লুকাস" },
  liam: { ur: "لیام", ar: "ليام", hi: "लियाम", bn: "লিয়াম" },
  alexander: { ur: "الیگزینڈر", ar: "ألكسندر", hi: "अलेक्जेंडर", bn: "আলেকজান্ডার" },
  chloe: { ur: "کلوئی", ar: "كلوي", hi: "क्लोई", bn: "ক্লোই" },
  natasha: { ur: "نتاشا", ar: "ناتاشا", hi: "नताशा", bn: "নাতাশা" },
  bisma: { ur: "بسمہ", ar: "بسمة", hi: "बिस्मा", bn: "বিসমা" },
};

export const INITIAL_MAP: Record<string, Partial<Record<LanguageCode, string>>> = {
  a: { ur: "آ", ar: "أ", hi: "अ", bn: "অ" },
  b: { ur: "ب", ar: "ب", hi: "ब", bn: "ব" },
  c: { ur: "س", ar: "ك", hi: "स", bn: "স" },
  d: { ur: "د", ar: "د", hi: "द", bn: "দ" },
  e: { ur: "ای", ar: "إ", hi: "इ", bn: "ই" },
  f: { ur: "ف", ar: "ف", hi: "फ", bn: "ফ" },
  g: { ur: "گ", ar: "ج", hi: "ग", bn: "গ" },
  h: { ur: "ح", ar: "هـ", hi: "ह", bn: "হ" },
  i: { ur: "آئی", ar: "إ", hi: "आ", bn: "আই" },
  j: { ur: "ج", ar: "ج", hi: "ज", bn: "জ" },
  k: { ur: "ک", ar: "ك", hi: "क", bn: "ক" },
  l: { ur: "ل", ar: "ل", hi: "ल", bn: "ল" },
  m: { ur: "م", ar: "م", hi: "म", bn: "ম" },
  n: { ur: "ن", ar: "ن", hi: "न", bn: "ন" },
  o: { ur: "او", ar: "و", hi: "ओ", bn: "ও" },
  p: { ur: "پ", ar: "ب", hi: "प", bn: "প" },
  q: { ur: "ق", ar: "ق", hi: "क़", bn: "ক" },
  r: { ur: "ر", ar: "ر", hi: "र", bn: "র" },
  s: { ur: "س", ar: "س", hi: "स", bn: "স" },
  t: { ur: "ت", ar: "ت", hi: "त", bn: "ত" },
  u: { ur: "یو", ar: "ي", hi: "उ", bn: "উ" },
  v: { ur: "و", ar: "ف", hi: "व", bn: "ভ" },
  w: { ur: "و", ar: "و", hi: "व", bn: "ও" },
  x: { ur: "ایکس", ar: "إكس", hi: "एक्स", bn: "এক্স" },
  y: { ur: "وائی", ar: "ي", hi: "य", bn: "ওয়াই" },
  z: { ur: "ز", ar: "ز", hi: "ज़", bn: "জ" },
};

export const NAME_CONNECTORS: Record<LanguageCode, string> = {
  en: " & ",
  ur: " اور ",
  ar: " و ",
  hi: " और ",
  fr: " & ",
  es: " y ",
  tr: " ve ",
  de: " & ",
  it: " e ",
  bn: " ও ",
  id: " & ",
};

export function phoneticToUrdu(word: string): string {
  if (!word) return "";
  if (/[\u0600-\u06FF]/.test(word)) return word;

  const lower = word.toLowerCase();
  const len = lower.length;
  let out = "";
  let i = 0;

  while (i < len) {
    if (i < len - 1) {
      const pair = lower.slice(i, i + 2);
      switch (pair) {
        case "sh":
          out += "ش";
          i += 2;
          continue;
        case "ch":
          out += "چ";
          i += 2;
          continue;
        case "kh":
          out += "خ";
          i += 2;
          continue;
        case "gh":
          out += "غ";
          i += 2;
          continue;
        case "ph":
          out += "ف";
          i += 2;
          continue;
        case "th":
          out += "تھ";
          i += 2;
          continue;
        case "dh":
          out += "دھ";
          i += 2;
          continue;
        case "bh":
          out += "بھ";
          i += 2;
          continue;
        case "jh":
          out += "جھ";
          i += 2;
          continue;
        case "zh":
          out += "ژ";
          i += 2;
          continue;
        case "aa":
          out += i === 0 ? "آ" : "ا";
          i += 2;
          continue;
        case "ee":
          out += "ی";
          i += 2;
          continue;
        case "oo":
          out += "و";
          i += 2;
          continue;
        case "ai":
          out += "ائی";
          i += 2;
          continue;
        case "ei":
          out += "ئی";
          i += 2;
          continue;
        case "au":
        case "ou":
          out += "ئو";
          i += 2;
          continue;
      }
    }

    const c = lower[i];
    switch (c) {
      case "a":
        out += i === 0 ? "آ" : "ا";
        break;
      case "b":
        out += "ب";
        break;
      case "c":
        out += i < len - 1 && ["e", "i", "y"].includes(lower[i + 1]) ? "س" : "ک";
        break;
      case "d":
        out += "د";
        break;
      case "e":
        out += i === 0 ? "ای" : i === len - 1 ? "ہ" : "ی";
        break;
      case "f":
        out += "ف";
        break;
      case "g":
        out += "گ";
        break;
      case "h":
        out += "ہ";
        break;
      case "i":
        out += i === 0 ? "ای" : "ی";
        break;
      case "j":
        out += "ج";
        break;
      case "k":
        out += "ک";
        break;
      case "l":
        out += "ل";
        break;
      case "m":
        out += "م";
        break;
      case "n":
        out += "ن";
        break;
      case "o":
        out += i === 0 ? "او" : "و";
        break;
      case "p":
        out += "پ";
        break;
      case "q":
        out += "ق";
        break;
      case "r":
        out += "ر";
        break;
      case "s":
        out += "س";
        break;
      case "t":
        out += "ت";
        break;
      case "u":
        out += i === 0 ? "او" : "و";
        break;
      case "v":
      case "w":
        out += "و";
        break;
      case "x":
        out += "کس";
        break;
      case "y":
        out += "ی";
        break;
      case "z":
        out += "ز";
        break;
      default:
        out += c;
    }
    i += 1;
  }

  return out;
}

export function phoneticToArabic(word: string): string {
  if (!word) return "";
  if (/[\u0600-\u06FF]/.test(word)) return word;

  const lower = word.toLowerCase();
  const len = lower.length;
  let out = "";
  let i = 0;

  while (i < len) {
    if (i < len - 1) {
      const pair = lower.slice(i, i + 2);
      switch (pair) {
        case "sh":
          out += "ش";
          i += 2;
          continue;
        case "ch":
          out += "تش";
          i += 2;
          continue;
        case "kh":
          out += "خ";
          i += 2;
          continue;
        case "gh":
          out += "غ";
          i += 2;
          continue;
        case "ph":
          out += "ف";
          i += 2;
          continue;
        case "th":
          out += "ث";
          i += 2;
          continue;
        case "dh":
          out += "ذ";
          i += 2;
          continue;
        case "aa":
          out += i === 0 ? "آ" : "ا";
          i += 2;
          continue;
        case "ee":
          out += "ي";
          i += 2;
          continue;
        case "oo":
          out += "و";
          i += 2;
          continue;
        case "ai":
          out += "اي";
          i += 2;
          continue;
        case "au":
        case "ou":
          out += "او";
          i += 2;
          continue;
      }
    }

    const c = lower[i];
    switch (c) {
      case "a":
        out += i === 0 ? "أ" : "ا";
        break;
      case "b":
        out += "ب";
        break;
      case "c":
        out += i < len - 1 && ["e", "i", "y"].includes(lower[i + 1]) ? "س" : "ك";
        break;
      case "d":
        out += "د";
        break;
      case "e":
        out += i === 0 ? "إ" : "ي";
        break;
      case "f":
        out += "ف";
        break;
      case "g":
        out += "ج";
        break;
      case "h":
        out += i === len - 1 ? "ة" : "ه";
        break;
      case "i":
        out += i === 0 ? "إ" : "ي";
        break;
      case "j":
        out += "ج";
        break;
      case "k":
        out += "ك";
        break;
      case "l":
        out += "ل";
        break;
      case "m":
        out += "م";
        break;
      case "n":
        out += "ن";
        break;
      case "o":
        out += i === 0 ? "أو" : "و";
        break;
      case "p":
        out += "ب";
        break;
      case "q":
        out += "ق";
        break;
      case "r":
        out += "ر";
        break;
      case "s":
        out += "س";
        break;
      case "t":
        out += "ت";
        break;
      case "u":
        out += i === 0 ? "أو" : "و";
        break;
      case "v":
        out += "ف";
        break;
      case "w":
        out += "و";
        break;
      case "x":
        out += "كس";
        break;
      case "y":
        out += "ي";
        break;
      case "z":
        out += "ز";
        break;
      default:
        out += c;
    }
    i += 1;
  }

  return out;
}

export function phoneticToHindi(word: string): string {
  if (!word) return "";
  if (/[\u0900-\u097F]/.test(word)) return word;

  const lower = word.toLowerCase();
  const len = lower.length;
  let out = "";
  let i = 0;

  while (i < len) {
    if (i < len - 1) {
      const pair = lower.slice(i, i + 2);
      switch (pair) {
        case "sh":
          out += "श";
          i += 2;
          continue;
        case "ch":
          out += "च";
          i += 2;
          continue;
        case "kh":
          out += "ख़";
          i += 2;
          continue;
        case "gh":
          out += "ग़";
          i += 2;
          continue;
        case "ph":
          out += "फ";
          i += 2;
          continue;
        case "th":
          out += "थ";
          i += 2;
          continue;
        case "dh":
          out += "ध";
          i += 2;
          continue;
        case "bh":
          out += "भ";
          i += 2;
          continue;
        case "jh":
          out += "झ";
          i += 2;
          continue;
        case "aa":
          out += i === 0 ? "आ" : "ा";
          i += 2;
          continue;
        case "ee":
          out += i === 0 ? "ई" : "ी";
          i += 2;
          continue;
        case "oo":
          out += i === 0 ? "ऊ" : "ू";
          i += 2;
          continue;
        case "ai":
          out += i === 0 ? "ऐ" : "ै";
          i += 2;
          continue;
        case "au":
        case "ou":
          out += i === 0 ? "औ" : "ौ";
          i += 2;
          continue;
      }
    }

    const c = lower[i];
    switch (c) {
      case "a":
        out += i === 0 ? "अ" : "ा";
        break;
      case "b":
        out += "ब";
        break;
      case "c":
        out += i < len - 1 && ["e", "i", "y"].includes(lower[i + 1]) ? "स" : "क";
        break;
      case "d":
        out += "द";
        break;
      case "e":
        out += i === 0 ? "ए" : "े";
        break;
      case "f":
        out += "फ";
        break;
      case "g":
        out += "ग";
        break;
      case "h":
        out += "ह";
        break;
      case "i":
        out += i === 0 ? "इ" : "ि";
        break;
      case "j":
        out += "ज";
        break;
      case "k":
        out += "क";
        break;
      case "l":
        out += "ल";
        break;
      case "m":
        out += "म";
        break;
      case "n":
        out += "न";
        break;
      case "o":
        out += i === 0 ? "ओ" : "ो";
        break;
      case "p":
        out += "प";
        break;
      case "q":
        out += "क़";
        break;
      case "r":
        out += "र";
        break;
      case "s":
        out += "स";
        break;
      case "t":
        out += "त";
        break;
      case "u":
        out += i === 0 ? "उ" : "ु";
        break;
      case "v":
      case "w":
        out += "व";
        break;
      case "x":
        out += "क्स";
        break;
      case "y":
        out += "य";
        break;
      case "z":
        out += "ज़";
        break;
      default:
        out += c;
    }
    i += 1;
  }

  return out;
}

export function phoneticToBengali(word: string): string {
  if (!word) return "";
  if (/[\u0980-\u09FF]/.test(word)) return word;

  const lower = word.toLowerCase();
  const len = lower.length;
  let out = "";
  let i = 0;

  while (i < len) {
    if (i < len - 1) {
      const pair = lower.slice(i, i + 2);
      switch (pair) {
        case "sh":
          out += "শ";
          i += 2;
          continue;
        case "ch":
          out += "চ";
          i += 2;
          continue;
        case "kh":
          out += "খ";
          i += 2;
          continue;
        case "gh":
          out += "ঘ";
          i += 2;
          continue;
        case "ph":
          out += "ফ";
          i += 2;
          continue;
        case "th":
          out += "থ";
          i += 2;
          continue;
        case "dh":
          out += "ধ";
          i += 2;
          continue;
        case "bh":
          out += "ভ";
          i += 2;
          continue;
        case "jh":
          out += "ঝ";
          i += 2;
          continue;
        case "aa":
          out += i === 0 ? "আ" : "া";
          i += 2;
          continue;
        case "ee":
          out += i === 0 ? "ঈ" : "ী";
          i += 2;
          continue;
        case "oo":
          out += i === 0 ? "ঊ" : "ূ";
          i += 2;
          continue;
        case "ai":
          out += i === 0 ? "ঐ" : "ৈ";
          i += 2;
          continue;
        case "au":
        case "ou":
          out += i === 0 ? "ঔ" : "ৌ";
          i += 2;
          continue;
      }
    }

    const c = lower[i];
    switch (c) {
      case "a":
        out += i === 0 ? "অ" : "া";
        break;
      case "b":
        out += "ব";
        break;
      case "c":
        out += i < len - 1 && ["e", "i", "y"].includes(lower[i + 1]) ? "স" : "ক";
        break;
      case "d":
        out += "দ";
        break;
      case "e":
        out += i === 0 ? "এ" : "ে";
        break;
      case "f":
        out += "ফ";
        break;
      case "g":
        out += "গ";
        break;
      case "h":
        out += "হ";
        break;
      case "i":
        out += i === 0 ? "ই" : "ি";
        break;
      case "j":
        out += "জ";
        break;
      case "k":
        out += "ক";
        break;
      case "l":
        out += "ল";
        break;
      case "m":
        out += "ম";
        break;
      case "n":
        out += "ন";
        break;
      case "o":
        out += i === 0 ? "ও" : "ো";
        break;
      case "p":
        out += "প";
        break;
      case "q":
        out += "ক";
        break;
      case "r":
        out += "র";
        break;
      case "s":
        out += "স";
        break;
      case "t":
        out += "ত";
        break;
      case "u":
        out += i === 0 ? "উ" : "ু";
        break;
      case "v":
        out += "ভ";
        break;
      case "w":
        out += "ও";
        break;
      case "x":
        out += "ক্স";
        break;
      case "y":
        out += "য়";
        break;
      case "z":
        out += "জ";
        break;
      default:
        out += c;
    }
    i += 1;
  }

  return out;
}

function phoneticTransliterate(word: string, targetLang: LanguageCode): string {
  if (targetLang === "ur") return phoneticToUrdu(word);
  if (targetLang === "ar") return phoneticToArabic(word);
  if (targetLang === "hi") return phoneticToHindi(word);
  if (targetLang === "bn") return phoneticToBengali(word);
  return word;
}

export function transliterateFullName(
  fullName: string | undefined | null,
  targetLang: LanguageCode
): string {
  if (!fullName || typeof fullName !== "string") return "";
  const trimmed = fullName.trim();
  if (!trimmed) return "";

  // English or Latin script celebration languages keep Latin spelling
  if (
    targetLang === "en" ||
    targetLang === "fr" ||
    targetLang === "es" ||
    targetLang === "tr" ||
    targetLang === "de" ||
    targetLang === "it" ||
    targetLang === "id"
  ) {
    return trimmed;
  }

  // If already in target non-Latin script, return as-is
  if (/[\u0600-\u06FF\u0900-\u097F\u0980-\u09FF]/.test(trimmed)) {
    return trimmed;
  }

  // 1. Check exact phrase translations (e.g. starter template demo names)
  if (PHRASE_TRANSLATIONS[trimmed]?.[targetLang]) {
    return PHRASE_TRANSLATIONS[trimmed][targetLang]!;
  }

  // 2. Check full name in common name map
  const lower = trimmed.toLowerCase();
  if (COMMON_NAME_MAP[lower]?.[targetLang]) {
    return COMMON_NAME_MAP[lower][targetLang]!;
  }

  // 3. Split by words / whitespace
  const tokens = trimmed.split(/(\s+)/);
  const result = tokens.map((token) => {
    if (!token.trim()) return token;
    const tokenLower = token.toLowerCase();
    if (COMMON_NAME_MAP[tokenLower]?.[targetLang]) {
      return COMMON_NAME_MAP[tokenLower][targetLang]!;
    }
    return phoneticTransliterate(token, targetLang);
  });

  return result.join("");
}

export function transliterateMonogram(
  monogram: string | undefined | null,
  targetLang: LanguageCode
): string {
  if (!monogram || typeof monogram !== "string") return "";
  const trimmed = monogram.trim();
  if (!trimmed) return "";

  if (
    targetLang === "en" ||
    targetLang === "fr" ||
    targetLang === "es" ||
    targetLang === "tr" ||
    targetLang === "de" ||
    targetLang === "it" ||
    targetLang === "id"
  ) {
    return trimmed;
  }

  if (/[\u0600-\u06FF\u0900-\u097F\u0980-\u09FF]/.test(trimmed)) {
    return trimmed;
  }

  // Handle pair like "A&Z", "A & Z", "A+Z", "AZ"
  const pair = trimmed.match(/^([A-Za-z])\s*([&+\-•·/]?)\s*([A-Za-z])$/);
  if (pair) {
    const c1 = pair[1].toLowerCase();
    const sep = pair[2] || "&";
    const c2 = pair[3].toLowerCase();
    const t1 = INITIAL_MAP[c1]?.[targetLang] || pair[1];
    const t2 = INITIAL_MAP[c2]?.[targetLang] || pair[3];
    return `${t1}${sep}${t2}`;
  }

  if (/^[A-Za-z]$/.test(trimmed)) {
    const c = trimmed.toLowerCase();
    return INITIAL_MAP[c]?.[targetLang] || trimmed;
  }

  return trimmed;
}

export function resolveHeadline(
  headline: string | undefined | null,
  targetLang: LanguageCode
): string {
  if (!headline || typeof headline !== "string") return "";
  const trimmed = headline.trim();
  if (!trimmed) return "";

  if (targetLang === "en") return trimmed;

  // Check phrase translations first
  if (PHRASE_TRANSLATIONS[trimmed]?.[targetLang]) {
    return PHRASE_TRANSLATIONS[trimmed][targetLang]!;
  }

  const connector = NAME_CONNECTORS[targetLang] || " & ";

  // Check if headline has a wedding prefix: "The Wedding (Celebration) of X & Y"
  const prefixMatch = trimmed.match(
    /^(The\s+Wedding\s+(?:Celebration\s+)?of\s+)(.+?)\s*(?:&|\band\b)\s*(.+)$/i
  );
  if (prefixMatch) {
    const p1 = prefixMatch[2].trim();
    const p2 = prefixMatch[3].trim();
    const t1 = transliterateFullName(p1, targetLang);
    const t2 = transliterateFullName(p2, targetLang);

    if (targetLang === "ur") return `${t1}${connector}${t2} کی شادی کی تقریب`;
    if (targetLang === "ar") return `حفل زفاف ${t1}${connector}${t2}`;
    if (targetLang === "hi") return `${t1}${connector}${t2} का शुभ विवाह`;
    if (targetLang === "bn") return `${t1}${connector}${t2}-এর শুভ বিবাহ`;
    if (targetLang === "fr") return `La célébration du mariage de ${t1}${connector}${t2}`;
    if (targetLang === "es") return `La celebración de la boda de ${t1}${connector}${t2}`;
    if (targetLang === "tr") return `${t1}${connector}${t2} Düğün Töreni`;
    if (targetLang === "de") return `Die Hochzeitsfeier von ${t1}${connector}${t2}`;
    if (targetLang === "it") return `La celebrazione delle nozze di ${t1}${connector}${t2}`;
    if (targetLang === "id") return `Perayaan Pernikahan ${t1}${connector}${t2}`;
  }

  // Check pair match: "X & Y" or "X and Y"
  const pairMatch = trimmed.match(/^([^&]+?)\s*(?:&|\band\b)\s*([^&]+?)$/i);
  if (pairMatch) {
    const p1 = pairMatch[1].trim();
    const p2 = pairMatch[2].trim();
    const t1 = transliterateFullName(p1, targetLang);
    const t2 = transliterateFullName(p2, targetLang);
    return `${t1}${connector}${t2}`;
  }

  return transliterateFullName(trimmed, targetLang);
}

function resolvePatternTranslation(
  trimmed: string,
  targetLang: LanguageCode
): string | null {
  // 1. Match "X & Y" or "X and Y" (e.g. couple headlines)
  const pairMatch = trimmed.match(/^([^&]+?)\s*(?:&|\band\b)\s*([^&]+?)$/i);
  if (pairMatch) {
    return resolveHeadline(trimmed, targetLang);
  }

  // 2. Match Wax Seal prompts (e.g. "Tap ... seal ... unseal ...")
  if (
    /tap\b.*seal/i.test(trimmed) ||
    /unseal\b.*(?:invite|invitation|folio|envelope|celebration)/i.test(trimmed)
  ) {
    const promptMap: Record<LanguageCode, string> = {
      en: "Tap the wax seal to unseal your invitation",
      ur: "دعوت نامہ کھولنے کے لیے مہر پر کلک کریں",
      ar: "المس الختم الشمعي لفتح بطاقة الدعوة",
      hi: "निमंत्रण पत्र खोलने के लिए मोहर पर स्पर्श करें",
      fr: "Touchez le sceau de cire pour ouvrir votre invitation",
      es: "Toque el sello de lacre para abrir su invitación",
      tr: "Davetiyenizi açmak için mühre dokunun",
      de: "Berühren Sie das Wachssiegel, um Ihre Einladung zu öffnen",
      it: "Tocca il sigillo di ceralacca per aprire l'invito",
      bn: "আমন্ত্রণপত্র খুলতে মোম শীলটিতে স্পর্শ করুন",
      id: "Ketuk segel lilin untuk membuka undangan Anda",
    };
    return promptMap[targetLang] || null;
  }

  // 3. Match Host Lines (e.g. "Together with their ... families")
  if (/together\s+with\b.*famil/i.test(trimmed)) {
    const hostMap: Record<LanguageCode, string> = {
      en: "Together with their beloved families",
      ur: "اپنے پیارے اہل خانہ کے ہمراہ",
      ar: "بمعية عائلاتهم الكريمة",
      hi: "अपने प्रिय परिवारों के साथ",
      fr: "Avec leurs familles bien-aimées",
      es: "Junto con sus queridas familias",
      tr: "Kıymetli aileleriyle birlikte",
      de: "Gemeinsam mit ihren geliebten Familien",
      it: "Insieme alle loro amate famiglie",
      bn: "তাঁদের প্রিয় পরিবারের সাথে",
      id: "Bersama keluarga besar tercinta",
    };
    return hostMap[targetLang] || null;
  }

  // 4. Match Subtitles (e.g. "Request the honor of your presence ...")
  if (/request\s+the\s+honou?r/i.test(trimmed) || /cordially\s+invite/i.test(trimmed)) {
    const subMap: Record<LanguageCode, string> = {
      en: "Request the honor of your presence at their wedding celebration",
      ur: "آپ کو اپنی شادی کی تقریب میں شرکت کی دلی دعوت دیتے ہیں",
      ar: "يتشرفون بدعوتكم لحضور حفل الزفاف المبارك",
      hi: "विवाह समारोह के पावन अवसर पर आपकी गरिमामयी उपस्थिति के आकांक्षी हैं",
      fr: "Ont l'honneur de vous convier à la célébration de leur mariage",
      es: "Tienen el honor de invitarle a la celebración de su boda",
      tr: "Düğün törenimize teşriflerinizi rica ederiz",
      de: "Bitten um die Ehre Ihrer Anwesenheit bei ihrer Hochzeitsfeier",
      it: "Hanno il piacere di invitarvi alla celebrazione del loro matrimonio",
      bn: "তাঁদের শুভ বিবাহ উৎসবে আপনাদের সানন্দ উপস্থিতি কামনা করি",
      id: "Mengharapkan kehadiran Anda di perayaan pernikahan kami",
    };
    return subMap[targetLang] || null;
  }

  // 5. Match Day numbers (e.g. "Day 1", "Day 2", "Day 3")
  const dayMatch = trimmed.match(/^Day\s*(\d+)$/i);
  if (dayMatch) {
    const num = dayMatch[1];
    const dayLabels: Record<string, Partial<Record<LanguageCode, string>>> = {
      "1": {
        ur: "پہلا دن",
        ar: "اليوم الأول",
        hi: "पहला दिन",
        fr: "Jour 1",
        es: "Día 1",
        tr: "1. Gün",
        de: "Tag 1",
        it: "Giorno 1",
        bn: "প্রথম দিন",
        id: "Hari 1",
      },
      "2": {
        ur: "دوسرا دن",
        ar: "اليوم الثاني",
        hi: "दूसरा दिन",
        fr: "Jour 2",
        es: "Día 2",
        tr: "2. Gün",
        de: "Tag 2",
        it: "Giorno 2",
        bn: "দ্বিতীয় দিন",
        id: "Hari 2",
      },
      "3": {
        ur: "تیسرا دن",
        ar: "اليوم الثالث",
        hi: "तीसरा दिन",
        fr: "Jour 3",
        es: "Día 3",
        tr: "3. Gün",
        de: "Tag 3",
        it: "Giorno 3",
        bn: "তৃতীয় দিন",
        id: "Hari 3",
      },
    };
    return dayLabels[num]?.[targetLang] || `Day ${num}`;
  }

  // 6. Match "Daughter of ..." / "Son of ..."
  const roleMatch = trimmed.match(/^(Daughter|Son)\s+of\s+(.+)$/i);
  if (roleMatch) {
    const isDaughter = roleMatch[1].toLowerCase() === "daughter";
    const parents = roleMatch[2].trim();
    if (targetLang === "ur") {
      return `${isDaughter ? "دختر" : "فرزند"} ${parents.replace(/Mr\.\s*&\s*Mrs\./i, "مسٹر اور مسز")}`;
    }
    if (targetLang === "ar") {
      return `${isDaughter ? "ابنة" : "ابن"} ${parents.replace(/Mr\.\s*&\s*Mrs\./i, "السيد والسيدة")}`;
    }
    if (targetLang === "hi") {
      return `${parents.replace(/Mr\.\s*&\s*Mrs\./i, "श्री एवं श्रीमती")} ${isDaughter ? "की सुपुत्री" : "के सुपुत्र"}`;
    }
    if (targetLang === "fr") {
      return `${isDaughter ? "Fille" : "Fils"} de ${parents.replace(/Mr\.\s*&\s*Mrs\./i, "M. et Mme")}`;
    }
    if (targetLang === "es") {
      return `${isDaughter ? "Hija" : "Hijo"} de ${parents.replace(/Mr\.\s*&\s*Mrs\./i, "los Sres.")}`;
    }
    if (targetLang === "id") {
      return `${isDaughter ? "Putri dari" : "Putra dari"} ${parents.replace(/Mr\.\s*&\s*Mrs\./i, "Bpk. & Ibu")}`;
    }
  }

  return null;
}

export function translateText(
  text: string | null | undefined,
  targetLang: LanguageCode
): string {
  if (!text || typeof text !== "string") return "";
  if (targetLang === "en") return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Check in-memory cache
  const memKey = `${targetLang}:${trimmed.toLowerCase()}`;
  if (clientMemoryCache.has(memKey)) {
    return clientMemoryCache.get(memKey)!;
  }

  // 2. Check phrase dictionary (exact match)
  if (PHRASE_TRANSLATIONS[trimmed]?.[targetLang]) {
    const val = PHRASE_TRANSLATIONS[trimmed][targetLang]!;
    clientMemoryCache.set(memKey, val);
    return val;
  }

  // 3. Check case-insensitive phrase match
  for (const [phrase, transObj] of Object.entries(PHRASE_TRANSLATIONS)) {
    if (phrase.toLowerCase() === trimmed.toLowerCase() && transObj[targetLang]) {
      const val = transObj[targetLang]!;
      clientMemoryCache.set(memKey, val);
      return val;
    }
  }

  // 4. Check UI translation reverse lookup
  const enDict = UI_TRANSLATIONS.en;
  const targetDict = UI_TRANSLATIONS[targetLang];
  for (const [k, v] of Object.entries(enDict)) {
    if (v.toLowerCase() === trimmed.toLowerCase()) {
      const val = targetDict[k as TranslationKey];
      if (val) {
        clientMemoryCache.set(memKey, val);
        return val;
      }
    }
  }

  // 5. Pattern-based resolver (names, prompts, roles, days, host lines)
  const patternResult = resolvePatternTranslation(trimmed, targetLang);
  if (patternResult) {
    clientMemoryCache.set(memKey, patternResult);
    return patternResult;
  }

  // 6. Transliterate name fallback if single name or name token in non-Latin languages
  if (
    targetLang === "ur" ||
    targetLang === "ar" ||
    targetLang === "hi" ||
    targetLang === "bn"
  ) {
    const transliterated = transliterateFullName(trimmed, targetLang);
    if (transliterated && transliterated !== trimmed) {
      clientMemoryCache.set(memKey, transliterated);
      return transliterated;
    }
  }

  // 7. Check browser localStorage if available
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(getStorageCacheKey(trimmed, targetLang));
      if (cached) {
        clientMemoryCache.set(memKey, cached);
        return cached;
      }
    } catch {
      // localStorage may fail in private mode
    }
  }

  return text;
}

export function saveClientTranslations(
  translations: Record<string, string>,
  targetLang: LanguageCode
) {
  for (const [orig, trans] of Object.entries(translations)) {
    if (!orig || !trans) continue;
    const memKey = `${targetLang}:${orig.trim().toLowerCase()}`;
    clientMemoryCache.set(memKey, trans);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getStorageCacheKey(orig, targetLang), trans);
      } catch {
        // ignore
      }
    }
  }
}

export function translateDesignData(
  designData: EventDesignData,
  targetLang: LanguageCode,
  dynamicTranslations?: Record<string, string>
): EventDesignData {
  if (targetLang === "en") {
    const clonedEn: EventDesignData = JSON.parse(JSON.stringify(designData));
    if (clonedEn.content) {
      clonedEn.content.subtitle = resolveSubtitle(
        clonedEn.content.subtitle,
        clonedEn.content.itinerary
      );
    }
    return clonedEn;
  }

  const resolve = (txt?: string | null): string => {
    if (!txt) return "";
    if (dynamicTranslations && dynamicTranslations[txt]) {
      return dynamicTranslations[txt];
    }
    return translateText(txt, targetLang);
  };

  const cloned: EventDesignData = JSON.parse(JSON.stringify(designData));

  // 1. Envelope prompt text and wax seal monogram
  if (cloned.envelope) {
    if (cloned.envelope.promptText) {
      cloned.envelope.promptText = resolve(cloned.envelope.promptText);
    }
    if (cloned.envelope.waxSeal?.monogram) {
      cloned.envelope.waxSeal.monogram = transliterateMonogram(
        cloned.envelope.waxSeal.monogram,
        targetLang
      );
    }
  }

  // 2. Blessing header translation in selected language
  if (cloned.content?.blessingHeader?.enabled) {
    const presetId = cloned.content.blessingHeader.preset;
    if (presetId && BLESSING_TRANSLATIONS[presetId]?.[targetLang]) {
      const blessingInfo = BLESSING_TRANSLATIONS[presetId][targetLang];
      cloned.content.blessingHeader.translation = blessingInfo.translation;
      if (blessingInfo.reference) {
        cloned.content.blessingHeader.reference = blessingInfo.reference;
      }
    } else if (cloned.content.blessingHeader.translation) {
      cloned.content.blessingHeader.translation = resolve(
        cloned.content.blessingHeader.translation
      );
    }
  }

  // 3. Content fields
  if (cloned.content) {
    cloned.content.hostLine = resolve(cloned.content.hostLine);
    cloned.content.headline = resolveHeadline(cloned.content.headline, targetLang);
    const effectiveSubtitle = resolveSubtitle(
      cloned.content.subtitle,
      cloned.content.itinerary
    );
    cloned.content.subtitle = resolve(effectiveSubtitle);
    cloned.content.storyQuote = resolve(cloned.content.storyQuote);
    cloned.content.dressCode = resolve(cloned.content.dressCode);
    cloned.content.rsvpHeadline = resolve(cloned.content.rsvpHeadline);
    cloned.content.rsvpDeadline = resolve(cloned.content.rsvpDeadline);

    if (cloned.content.couple) {
      cloned.content.couple.brideName = transliterateFullName(
        cloned.content.couple.brideName,
        targetLang
      );
      cloned.content.couple.groomName = transliterateFullName(
        cloned.content.couple.groomName,
        targetLang
      );
      cloned.content.couple.brideRole = resolve(cloned.content.couple.brideRole);
      cloned.content.couple.groomRole = resolve(cloned.content.couple.groomRole);

      // Center Crest symbol/connector (& -> اور in Urdu, و in Arabic, और in Hindi, ও in Bengali)
      if (cloned.content.couple.crestText) {
        if (targetLang === "ur") {
          cloned.content.couple.crestText = "اور";
        } else if (targetLang === "ar") {
          cloned.content.couple.crestText = "و";
        } else if (targetLang === "hi") {
          cloned.content.couple.crestText = "और";
        } else if (targetLang === "bn") {
          cloned.content.couple.crestText = "ও";
        }
      }
    }

    if (Array.isArray(cloned.content.itinerary)) {
      cloned.content.itinerary = cloned.content.itinerary.map((item) => ({
        ...item,
        title: resolve(item.title),
        description: resolve(item.description),
        dayLabel: resolve(item.dayLabel),
        venue: resolve(item.venue),
        dressCode: resolve(item.dressCode),
      }));
    }
  }

  return cloned;
}

export function formatLocalizedDate(
  dateIso: string | Date,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof dateIso === "string" ? new Date(dateIso) : dateIso;
  if (!d || Number.isNaN(d.getTime())) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  try {
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
  } catch {
    return d.toLocaleDateString("en-US", options || defaultOptions);
  }
}

export function formatLocalizedTime(
  dateIso: string | Date,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof dateIso === "string" ? new Date(dateIso) : dateIso;
  if (!d || Number.isNaN(d.getTime())) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  try {
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
  } catch {
    return d.toLocaleTimeString("en-US", options || defaultOptions);
  }
}
