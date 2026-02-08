
import React, { useState } from 'react';
import { Language } from '../App';

interface DuaLibraryProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

interface DuaItem {
  id: number;
  arabic: string;
  translation: string;
  reference: string;
  benefit: string;
  isVerified: boolean;
}

const getDuaList = (lang: Language): DuaItem[] => [
  {
    id: 1,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: lang === 'en' 
      ? "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."
      : "হে আমাদের প্রতিপালক! আমাদের দুনিয়াতেও কল্যাণ দিন এবং আখেরাতেও কল্যাণ দিন এবং আমাদের আগুনের (জাহান্নামের) আযাব থেকে রক্ষা করুন।",
    reference: lang === 'en' ? "Quran 2:201" : "আল-কুরআন ২:২০১",
    benefit: lang === 'en' ? "Success in both worlds" : "দুনিয়া ও আখেরাতের কল্যাণ",
    isVerified: true
  },
  {
    id: 2,
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    translation: lang === 'en'
      ? "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."
      : "আপনি ব্যতীত কোনো সত্য ইলাহ নেই; আপনি অতি পবিত্র। নিশ্চয়ই আমি জালিমদের (অপরাধীদের) অন্তর্ভুক্ত ছিলাম।",
    reference: lang === 'en' ? "Quran 21:87" : "আল-কুরআন ২১:৮৭",
    benefit: lang === 'en' ? "Relief from distress" : "বিপদ ও দুশ্চিন্তা থেকে মুক্তি",
    isVerified: true
  },
  {
    id: 3,
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
    translation: lang === 'en'
      ? "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower."
      : "হে আমাদের প্রতিপালক! সরল পথ প্রদর্শনের পর আমাদের অন্তরকে সত্যলঙ্ঘনে প্রবৃত্ত করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন। নিশ্চয়ই আপনি পরম দাতা।",
    reference: lang === 'en' ? "Quran 3:8" : "আল-কুরআন ৩:৮",
    benefit: lang === 'en' ? "Steadfastness in faith" : "ঈমানের ওপর অটল থাকা",
    isVerified: true
  },
  {
    id: 4,
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
    translation: lang === 'en'
      ? "My Lord, forgive and have mercy, and You are the best of the merciful."
      : "হে আমার প্রতিপালক! ক্ষমা করুন ও রহম করুন; আর আপনিই তো সর্বশ্রেষ্ঠ দয়ালু।",
    reference: lang === 'en' ? "Quran 23:118" : "আল-কুরআন ২৩:১১৮",
    benefit: lang === 'en' ? "Mercy and forgiveness" : "ক্ষমা ও রহমত প্রার্থনা",
    isVerified: true
  },
  {
    id: 5,
    arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    translation: lang === 'en'
      ? "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers."
      : "হে আমাদের প্রতিপালক! আমরা নিজেদের প্রতি জুলুম করেছি। আপনি যদি আমাদের ক্ষমা না করেন এবং আমাদের প্রতি দয়া না করেন, তবে অবশ্যই আমরা ক্ষতিগ্রস্তদের অন্তর্ভুক্ত হব।",
    reference: lang === 'en' ? "Quran 7:23" : "আল-কুরআন ৭:২৩",
    benefit: lang === 'en' ? "Repentance (Tawbah)" : "ক্ষমা ও তওবা কবুল",
    isVerified: true
  },
  {
    id: 6,
    arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation: lang === 'en'
      ? "My Lord, have mercy upon them as they brought me up [when I was] small."
      : "হে আমার প্রতিপালক! আপনি তাদের (পিতামাতার) প্রতি দয়া করুন, যেভাবে তারা আমাকে শৈশবে লালন-পালন করেছেন।",
    reference: lang === 'en' ? "Quran 17:24" : "আল-কুরআন ১৭:২৪",
    benefit: lang === 'en' ? "For parents" : "পিতামাতার জন্য দোয়া",
    isVerified: true
  },
  {
    id: 7,
    arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    translation: lang === 'en'
      ? "O Turner of the hearts, keep my heart steadfast upon Your religion."
      : "হে অন্তরসমূহের পরিবর্তনকারী! আমার অন্তরকে আপনার দ্বীনের ওপর অটল রাখুন।",
    reference: lang === 'en' ? "Sunan at-Tirmidhi: 3522" : "সুনান তিরমিযী: ৩৫২২",
    benefit: lang === 'en' ? "Spiritual steadfastness" : "দ্বীনের ওপর অটল থাকা",
    isVerified: true
  },
  {
    id: 8,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    translation: lang === 'en'
      ? "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men."
      : "হে আল্লাহ! আমি আপনার আশ্রয় নিচ্ছি দুশ্চিন্তা ও দুঃখ থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও ভীরুতা থেকে, ঋণের বোঝা ও মানুষের প্রাবল্য (জবরদস্তি) থেকে।",
    reference: lang === 'en' ? "Sahih al-Bukhari: 2893" : "সহীহ বুখারী: ২৮৯৩",
    benefit: lang === 'en' ? "Relief from anxiety and debt" : "দুশ্চিন্তা ও ঋণ থেকে মুক্তি",
    isVerified: true
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    translation: lang === 'en'
      ? "O Allah, I ask You for forgiveness and well-being in this world and the Hereafter."
      : "হে আল্লাহ! আমি আপনার কাছে দুনিয়া ও আখেরাতে ক্ষমা ও নিরাপত্তা (আফিয়াত) প্রার্থনা করছি।",
    reference: lang === 'en' ? "Sunan Abu Dawood: 5074" : "সুনান আবু দাউদ: ৫০৭৪",
    benefit: lang === 'en' ? "Safety and well-being" : "নিরাপত্তা ও আফিয়াত লাভ",
    isVerified: true
  },
  {
    id: 10,
    arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    translation: lang === 'en'
      ? "O Allah, there is no ease except in that which You have made easy, and You make the difficulty, if You wish, easy."
      : "হে আল্লাহ! আপনি যা সহজ করেছেন তা ছাড়া কোনো কিছুই সহজ নয়। আর আপনি চাইলে কঠিনকেও সহজ করে দেন।",
    reference: lang === 'en' ? "Sahih Ibn Hibban: 974" : "সহীহ ইবনে হিব্বান: ৯৭৪",
    benefit: lang === 'en' ? "Ease in difficulty" : "কঠিন কাজ সহজ হওয়া",
    isVerified: true
  },
  {
    id: 11,
    arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    translation: lang === 'en'
      ? "My Lord, indeed I am, for whatever good You would send down to me, in need."
      : "হে আমার প্রতিপালক, আপনি আমার প্রতি যে কল্যাণই নাযিল করবেন, আমি তার মুখাপেক্ষী।",
    reference: lang === 'en' ? "Quran 28:24" : "আল-কুরআন ২৮:২৪",
    benefit: lang === 'en' ? "Seeking goodness and need" : "কল্যাণ ও রিজিক প্রার্থনা",
    isVerified: true
  },
  {
    id: 12,
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
    translation: lang === 'en'
      ? "My Lord, expand for me my breast [with assurance] and ease for me my task and untie the knot from my tongue that they may understand my speech."
      : "হে আমার প্রতিপালক, আমার বক্ষ প্রশস্ত করে দিন এবং আমার কাজ সহজ করে দিন এবং আমার জিহ্বার জড়তা দূর করে দিন যাতে তারা আমার কথা বুঝতে পারে।",
    reference: lang === 'en' ? "Quran 20:25-28" : "আল-কুরআন ২০:২৫-২৮",
    benefit: lang === 'en' ? "Confidence and speech" : "বক্ষ প্রশস্ত ও কাজ সহজ হওয়া",
    isVerified: true
  },
  {
    id: 13,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ وَمِنْ قَلْبٍ لَا يَخْشَعُ وَمِنْ نَفْسٍ لَا تَشْبَعُ وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا",
    translation: lang === 'en'
      ? "O Allah, I seek refuge in You from knowledge that does not benefit, from a heart that does not fear [You], from a soul that is never satisfied, and from a supplication that is not answered."
      : "হে আল্লাহ! আমি আপনার নিকট আশ্রয় চাই এমন জ্ঞান থেকে যা কোনো উপকারে আসে না, এমন অন্তর থেকে যা আপনার ভয়ে ভীত হয় না, এমন নফ্‌স থেকে যা তৃপ্ত হয় না এবং এমন দোয়া থেকে যা কবুল করা হয় না।",
    reference: lang === 'en' ? "Sahih Muslim: 2722" : "সহীহ মুসলিম: ২৭২২",
    benefit: lang === 'en' ? "Protection from useless knowledge" : "উপকারহীন বিষয় থেকে আশ্রয়",
    isVerified: true
  },
  {
    id: 14,
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    translation: lang === 'en'
      ? "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous."
      : "হে আমাদের প্রতিপালক, আমাদের স্ত্রীদের পক্ষ থেকে এবং আমাদের সন্তানদের পক্ষ থেকে আমাদের জন্য চোখের শীতলতা দান করুন এবং আমাদের মুত্তাকীদের জন্য আদর্শস্বরূপ করুন।",
    reference: lang === 'en' ? "Quran 25:74" : "আল-কুরআন ২৫:৭৪",
    benefit: lang === 'en' ? "Righteous family" : "নেককার পরিবার ও সন্তান লাভ",
    isVerified: true
  },
  {
    id: 15,
    arabic: "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    translation: lang === 'en'
      ? "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance."
      : "হে আমাদের প্রতিপালক, আপনার পক্ষ থেকে আমাদের রহমত দান করুন এবং আমাদের জন্য আমাদের কাজ সঠিকভাবে পরিচালনা করার ব্যবস্থা করুন।",
    reference: lang === 'en' ? "Quran 18:10" : "আল-কুরআন ১৮:১০",
    benefit: lang === 'en' ? "Mercy and guidance" : "রহমত ও সঠিক পথের দিশা",
    isVerified: true
  },
  {
    id: 16,
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    translation: lang === 'en'
      ? "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah."
      : "আল্লাহর নামে, আমি আল্লাহর ওপর ভরসা করলাম, আর আল্লাহর সাহায্য ছাড়া কোনো উপায় নেই এবং কোনো শক্তি নেই।",
    reference: lang === 'en' ? "Sunan Abu Dawood: 5095" : "সুনান আবু দাউদ: ৫০৯৫",
    benefit: lang === 'en' ? "Protection when leaving home" : "ঘর থেকে বের হওয়ার নিরাপত্তা",
    isVerified: true
  },
  {
    id: 17,
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation: lang === 'en'
      ? "My Lord, increase me in knowledge."
      : "হে আমার প্রতিপালক, আমার জ্ঞান বৃদ্ধি করে দিন।",
    reference: lang === 'en' ? "Quran 20:114" : "আল-কুরআন ২০:১১৪",
    benefit: lang === 'en' ? "Seeking knowledge" : "ইলম বা জ্ঞান বৃদ্ধি",
    isVerified: true
  },
  {
    id: 18,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: lang === 'en'
      ? "I seek refuge in the perfect words of Allah from the evil of what He has created."
      : "আমি আল্লাহর পরিপূর্ণ কালিমাগুলোর মাধ্যমে তাঁর সৃষ্টির অনিষ্টতা থেকে আশ্রয় চাচ্ছি।",
    reference: lang === 'en' ? "Sahih Muslim: 2708" : "সহীহ মুসলিম: ২৭০৮",
    benefit: lang === 'en' ? "Protection from harm" : "সকল অনিষ্ট থেকে বাঁচার দোয়া",
    isVerified: true
  },
  {
    id: 19,
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    translation: lang === 'en'
      ? "O Allah, help me to remember You, to give thanks to You, and to worship You in the best manner."
      : "হে আল্লাহ! আপনার জিকর করতে, আপনার শোকর আদায় করতে এবং আপনার সুন্দর ইবাদত করতে আমাকে সাহায্য করুন।",
    reference: lang === 'en' ? "Sunan Abu Dawood: 1522" : "সুনান আবু দাউদ: ১৫২২",
    benefit: lang === 'en' ? "Help in worship" : "ইবাদত ও শুকরিয়ায় সাহায্য লাভ",
    isVerified: true
  },
  {
    id: 20,
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: lang === 'en'
      ? "In Your Name, O Allah, I die and I live."
      : "হে আল্লাহ! আপনারই নামে আমি মরি এবং আপনারই নামে আমি জীবিত হই (জাগ্রত হই)।",
    reference: lang === 'en' ? "Sahih al-Bukhari: 6312" : "সহীহ বুখারী: ৬৩১২",
    benefit: lang === 'en' ? "Before sleeping" : "ঘুমানোর আগের দোয়া",
    isVerified: true
  },
  {
    id: 21,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    translation: lang === 'en'
      ? "O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds."
      : "হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।",
    reference: lang === 'en' ? "Sunan Ibn Majah: 925" : "সুনান ইবনে মাজাহ: ৯২৫",
    benefit: lang === 'en' ? "Daily morning dua" : "সকালের বরকতময় দোয়া",
    isVerified: true
  },
  {
    id: 22,
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    translation: lang === 'en'
      ? "I am pleased with Allah as my Lord, Islam as my religion, and Muhammad (PBUH) as my Prophet."
      : "আমি আল্লাহকে প্রতিপালক হিসেবে, ইসলামকে দ্বীন হিসেবে এবং মুহাম্মদ (সা.)-কে নবী হিসেবে পেয়ে সন্তুষ্ট হয়েছি।",
    reference: lang === 'en' ? "Sunan Abu Dawood: 5072" : "সুনান আবু দাউদ: ৫০৭২",
    benefit: lang === 'en' ? "Contentment with faith" : "ঈমানের ওপর সন্তুষ্টি লাভ",
    isVerified: true
  },
  {
    id: 23,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    translation: lang === 'en'
      ? "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency."
      : "হে আল্লাহ! আমি আপনার কাছে হেদায়েত, তাকওয়া, পবিত্রতা এবং সচ্ছলতা প্রার্থনা করছি।",
    reference: lang === 'en' ? "Sahih Muslim: 2721" : "সহীহ মুসলিম: ২৭২১",
    benefit: lang === 'en' ? "Spiritual & financial well-being" : "হেদায়েত ও সচ্ছলতা লাভ",
    isVerified: true
  },
  {
    id: 24,
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    translation: lang === 'en'
      ? "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication."
      : "হে আমার প্রতিপালক! আমাকে সালাত কায়েমকারী করুন এবং আমার বংশধরদের মধ্য থেকেও। হে আমাদের প্রতিপালক! আমার দোয়া কবুল করুন।",
    reference: lang === 'en' ? "Quran 14:40" : "আল-কুরআন ১৪:৪০",
    benefit: lang === 'en' ? "Steadfastness in prayer" : "সালাতে নিয়মিত হওয়া",
    isVerified: true
  },
  {
    id: 25,
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ",
    translation: lang === 'en'
      ? "O Allah, forgive me all my sins: the small and the great, the first and the last, the open and the secret."
      : "হে আল্লাহ! আমার ছোট-বড়, আগের-পরের এবং প্রকাশ্য-গোপন সব গুনাহ ক্ষমা করে দিন।",
    reference: lang === 'en' ? "Sahih Muslim: 483" : "সহীহ মুসলিম: ৪৮৩",
    benefit: lang === 'en' ? "Comprehensive forgiveness" : "পূর্ণাঙ্গ গুনাহ মাফ",
    isVerified: true
  }
];

const DuaLibrary: React.FC<DuaLibraryProps> = ({ language, isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const duas = getDuaList(language);

  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] bg-slate-950/80 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-500 tracking-tight">
              {language === 'en' ? 'Verified Duas' : 'দুয়া ভাণ্ডার'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {language === 'en' ? 'Authentic References' : 'বিশুদ্ধ সূত্র সংকলন'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl transition-all active:scale-90"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6">
          {duas.map((dua) => (
            <div 
              key={dua.id} 
              className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 space-y-6 group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/20"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                    {dua.benefit}
                  </div>
                  {dua.isVerified && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/10">
                      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {language === 'en' ? 'Sahih' : 'সহীহ'}
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                  #{dua.id.toString().padStart(2, '0')}
                </div>
              </div>

              <div className="text-right py-2 relative group/arabic">
                <p className="text-2xl sm:text-4xl font-bold leading-[2.2] sm:leading-[2.4] text-slate-900 dark:text-slate-50 arabic-script tracking-tight" dir="rtl">
                  {dua.arabic}
                </p>
                <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => copyToClipboard(dua.id, dua.arabic)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-500 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {copiedId === dua.id ? (language === 'en' ? 'Copied' : 'কপি হয়েছে') : (language === 'en' ? 'Copy Arabic' : 'আরবি কপি')}
                    </span>
                    <svg className={`h-4 w-4 ${copiedId === dua.id ? 'text-emerald-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {copiedId === dua.id ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="relative">
                  <span className="absolute -left-4 top-0 h-full w-1 bg-emerald-500/20 rounded-full"></span>
                  <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">
                    "{dua.translation}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {dua.reference}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => copyToClipboard(dua.id + 100, dua.translation)}
                    className="p-2.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all active:scale-95"
                    title={language === 'en' ? 'Copy Translation' : 'অনুবাদ কপি'}
                  >
                    <svg className={`h-4 w-4 ${copiedId === (dua.id + 100) ? 'text-emerald-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {copiedId === (dua.id + 100) ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center shrink-0">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-600">
            {language === 'en' ? 'Authentic Supplications' : 'প্রামাণিক দোয়ার সংকলন'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuaLibrary;
