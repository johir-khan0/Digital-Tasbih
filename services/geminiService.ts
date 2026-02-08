
import { Quote } from "../types";
import { Language } from "../App";

const STATIC_HADITHS: Record<Language, Quote[]> = {
  en: [
    { text: "The example of the one who remembers his Lord and the one who does not is like the living and the dead.", reference: "Sahih Bukhari" },
    { text: "Should I not inform you of the best of your deeds? It is the remembrance of Allah.", reference: "Tirmidhi" },
    { text: "Two phrases are light on the tongue but heavy in the balance: SubhanAllahi wa bihamdihi, SubhanAllahil Azim.", reference: "Sahih Bukhari" },
    { text: "He who says, 'SubhanAllahi wa bihamdihi' 100 times a day, his sins will be forgiven even if they were like the foam of the sea.", reference: "Sahih Bukhari" },
    { text: "If your hearts were always as they are when you are with me, the angels would shake hands with you.", reference: "Sahih Muslim" },
    { text: "Allah says: I am as My servant thinks I am. I am with him when he makes mention of Me.", reference: "Sahih Bukhari" },
    { text: "Keep your tongue moist with the remembrance of Allah.", reference: "Tirmidhi" },
    { text: "The mufarridun have gone ahead. They are those who remember Allah much.", reference: "Sahih Muslim" },
    { text: "No people sit in a gathering remembering Allah but the angels surround them and mercy covers them.", reference: "Sahih Muslim" },
    { text: "When you pass by the meadows of Paradise, graze there. They are the circles of dhikr.", reference: "Tirmidhi" },
    { text: "The most beloved words to Allah are four: SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar.", reference: "Sahih Muslim" },
    { text: "Everything in the world is cursed except the remembrance of Allah and what supports it.", reference: "Tirmidhi" },
    { text: "For everything there is a polish, and the polish for the hearts is the remembrance of Allah.", reference: "Bayhaqi" },
    { text: "Whoever says 'La ilaha illallah wahdahu la sharika lah...' 100 times, it is like freeing 10 slaves.", reference: "Sahih Bukhari" },
    { text: "There is no deed that is better for saving a person from the punishment of Allah than the remembrance of Allah.", reference: "Ahmad" }
  ],
  bn: [
    { text: "যে ব্যক্তি তার রবের যিকির করে আর যে করে না, তাদের উদাহরণ হলো জীবিত ও মৃতর মতো।", reference: "সহীহ বুখারী" },
    { text: "আমি কি তোমাদের সর্বোত্তম আমল সম্পর্কে বলব না? তা হলো আল্লাহর যিকির।", reference: "তিরমিযী" },
    { text: "উচ্চারণে সহজ কিন্তু মিযানে অনেক ভারী আমল: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযীম।", reference: "সহীহ বুখারী" },
    { text: "যে ব্যক্তি দিনে ১০০ বার 'সুবহানাল্লাহি ওয়া বিহামদিহি' পড়বে, তার সমস্ত গুনাহ মাফ করা হবে, যদিও তা সমুদ্রের ফেনার মতো হয়।", reference: "সহীহ বুখারী" },
    { text: "তোমাদের অবস্থা যদি সর্বদা তেমন থাকত যেমন আমার কাছে থাকাকালীন থাকে, তবে ফেরেশতারা তোমাদের সাথে মুসাফাহা করত।", reference: "সহীহ মুসলিম" },
    { text: "আল্লাহ বলেন: আমার বান্দা আমার প্রতি যেমন ধারণা রাখে আমি তেমনই। সে যখন আমাকে স্মরণ করে আমি তার সাথেই থাকি।", reference: "সহীহ বুখারী" },
    { text: "তোমার জিহ্বা যেন সর্বদা আল্লাহর যিকিরে সিক্ত থাকে।", reference: "তিরমিযী" },
    { text: "মুফারিদগণ অগ্রগামী হয়ে গেছে। তারা হলো সেই সব লোক যারা আল্লাহকে অধিক স্মরণকারী।", reference: "সহীহ মুসলিম" },
    { text: "যখনই কোনো সম্প্রদায় আল্লাহর যিকিরে বসে, ফেরেশতারা তাদের ঘিরে রাখে এবং রহমত তাদের ঢেকে নেয়।", reference: "সহীহ মুসলিম" },
    { text: "যখন তোমরা জান্নাতের বাগানের পাশ দিয়ে যাও তখন সেখান থেকে ফল আহরণ করো। জান্নাতের বাগান হলো যিকিরের মজলিস।", reference: "তিরমিযী" },
    { text: "আল্লাহর কাছে সবচেয়ে প্রিয় বাক্য ৪টি: সুবহানাল্লাহ, আলহামদুলিল্লাহ, লা ইলাহা ইল্লাল্লাহ, আল্লাহু আকবার।", reference: "সহীহ মুসলিম" },
    { text: "দুনিয়ার সবকিছুই অভিশপ্ত, তবে আল্লাহর যিকির এবং তার সহযোগী বিষয়গুলো ছাড়া।", reference: "তিরমিযী" },
    { text: "প্রত্যেক জিনিসেরই একটি পলিশ থাকে, আর অন্তরের পলিশ হলো আল্লাহর যিকির।", reference: "বায়হাকী" },
    { text: "যে ব্যক্তি দিনে ১০০ বার 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু...' পাঠ করবে, সে ১০টি গোলাম আযাদ করার সওয়াব পাবে।", reference: "সহীহ বুখারী" },
    { text: "আল্লাহর আযাব থেকে মানুষকে বাঁচাতে আল্লাহর যিকিরের চেয়ে কার্যকর আর কোনো আমল নেই।", reference: "মুসনাদে আহমাদ" }
  ]
};

const MOTIVATIONAL_SENTENCES: Record<Language, string[]> = {
  en: [
    "MashaAllah! May Allah accept your dhikr.",
    "Excellent! Keep your tongue moist with the remembrance of Allah.",
    "Beautiful! Every dhikr is a step closer to Paradise.",
    "Great job! The best of deeds is the constant remembrance of Allah.",
    "Alhamdulillah! You've successfully completed this package.",
    "Stay consistent, for Allah loves the most regular of deeds.",
    "Your heart finds peace in the remembrance of Allah. Keep going!",
    "Dhikr is the polish that removes the rust from the heart.",
    "MashaAllah! You are investing in your eternal home.",
    "May this dhikr bring barakah and light into your life."
  ],
  bn: [
    "মাশাআল্লাহ! আল্লাহ আপনার যিকির কবুল করুন।",
    "চমৎকার! আল্লাহর স্মরণে আপনার জিহ্বাকে সবসময় সিক্ত রাখুন।",
    "সুবহানাল্লাহ! প্রতিটি যিকির আপনাকে জান্নাতের এক ধাপ কাছে নিয়ে যায়।",
    "অসাধারণ কাজ! সর্বোত্তম আমল হলো আল্লাহর নিয়মিত যিকির করা।",
    "আলহামদুলিল্লাহ! আপনি সফলভাবে এই প্যাকেজটি সম্পন্ন করেছেন।",
    "ধারাবাহিকতা বজায় রাখুন, কারণ নিয়মিত আমল আল্লাহর কাছে প্রিয়।",
    "আল্লাহর জিকিরেই অন্তরের প্রশান্তি। এগিয়ে চলুন!",
    "যিকির হলো অন্তরের মরিচা দূর করার শ্রেষ্ঠ উপায়।",
    "মাশাআল্লাহ! আপনি আপনার আখেরাতের জন্য শ্রেষ্ঠ বিনিয়োগ করছেন।",
    "এই যিকির আপনার জীবনে বরকত ও নূর বয়ে আনুক।"
  ]
};

// Returns a random Hadith from the static list based on the selected language
export const getDailyInspiration = (lang: Language): Quote => {
  const hadiths = STATIC_HADITHS[lang];
  const randomIndex = Math.floor(Math.random() * hadiths.length);
  return hadiths[randomIndex];
};

export const getCompletionMotivation = (lang: Language): string => {
  const sentences = MOTIVATIONAL_SENTENCES[lang];
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
};
