
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TasbihType, CycleItem, TasbihCombination, HistoryItem } from '../types';
import { getCompletionMotivation } from '../services/geminiService';
import { Language } from '../App';
import DuaLibrary from './DuaLibrary';

interface HapticConfig {
  tap: number;
  undo: number;
  complete: number;
  voice: number;
}

const DEFAULT_HAPTIC: HapticConfig = {
  tap: 25,
  undo: 15,
  complete: 150,
  voice: 40
};

// Storage Parser moved outside to be safely used in initializers
function safeParse<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Storage key ${key} corrupted, using fallback.`);
    return fallback;
  }
}

const getPresets = (lang: Language): TasbihCombination[] => [
  {
    id: 'salah_post',
    title: lang === 'en' ? 'Post-Salah Dhikr' : 'সালাত পরবর্তী যিকির',
    description: lang === 'en' 
      ? '33x SubhanAllah, 33x Alhamdulillah, and 34x Allahu Akbar after Fard prayer.' 
      : 'ফরয নামাযের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ এবং ৩৪ বার আল্লাহু আকবার।',
    reference: lang === 'en' ? 'Sahih Muslim: 1242' : 'সহীহ মুসলিম: ১২৪২',
    cycles: [
      { name: lang === 'en' ? 'SubhanAllah (سُبْحَانَ اللَّهِ)' : 'সুবহানাল্লাহ (سُبْحَانَ اللَّهِ)', target: 33 },
      { name: lang === 'en' ? 'Alhamdulillah (الْحَمْدُ لِلَّهِ)' : 'আলহামদুলিল্লাহ (الْحَمْدُ لِلَّهِ)', target: 33 },
      { name: lang === 'en' ? 'Allahu Akbar (اللَّهُ أَكْبَرُ)' : 'আল্লাহু আকবার (اللَّهُ أَكْبَرُ)', target: 34 }
    ]
  },
  {
    id: 'la_ilaha_illallah_100',
    title: lang === 'en' ? 'Tahlil (100x)' : 'তাহলীল (১০০ বার)',
    description: lang === 'en'
      ? 'Reciting "La ilaha illallah". It is the best form of remembrance.'
      : '“লা ইলাহা ইল্লাল্লাহ” পাঠ। এটি সর্বোত্তম যিকির।',
    reference: lang === 'en' ? 'Sunan at-Tirmidhi: 3383' : 'সুনান তিরমিযী: ৩৩8৩',
    cycles: [
      { name: lang === 'en' ? 'La ilaha illallah (لَا إِلٰهَ إِلَّا اللَّهُ)' : 'লা ইলাহা ইল্লাল্লাহ (لَا إِلٰهَ إِلَّا اللَّهُ)', target: 100 }
    ]
  },
  {
    id: 'astaghfirullah_100',
    title: lang === 'en' ? 'Istighfar (100x)' : 'ইস্তিগফার (১০০ বার)',
    description: lang === 'en'
      ? 'Seeking forgiveness from Allah. The Prophet (PBUH) used to do this 100 times a day.'
      : 'আল্লাহর কাছে ক্ষমা প্রার্থনা। রাসূলুল্লাহ (সা.) দিনে ১০০ বার ইস্তিগফার করতেন।',
    reference: lang === 'en' ? 'Sahih Muslim: 2702' : 'সহীহ মুসলিম: ২৭০২',
    cycles: [
      { name: lang === 'en' ? 'Astaghfirullah (أَسْتَغْفِرُ اللَّهَ)' : 'আস্তাগফিরুল্লাহ (أَسْتَغْفِرُ اللَّهَ)', target: 100 }
    ]
  },
  {
    id: 'durood_100',
    title: lang === 'en' ? 'Salawat / Durood' : 'দরুদ শরীফ',
    description: lang === 'en'
      ? 'Sending blessings upon the Prophet (PBUH). Whoever sends one blessing, Allah sends ten.'
      : 'রাসূলুল্লাহ (সা.)-এর ওপর দরুদ পাঠ। একবার দরুদ পড়লে আল্লাহ ১০ বার রহমত নাযিল করেন।',
    reference: lang === 'en' ? 'Sahih Muslim: 408' : 'সহীহ মুসলিম: ৪০৮',
    cycles: [
      { name: lang === 'en' ? 'Sallallahu Alaihi Wasallam (صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ)' : 'সাল্লাল্লাহু আলৈহি ওয়াসাল্লাম (صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ)', target: 100 }
    ]
  },
  {
    id: 'morning_evening_100',
    title: lang === 'en' ? '100x Glorification' : 'সুবহানাল্লাহি ওয়া বিহামদিহি',
    description: lang === 'en'
      ? 'Reciting this 100x morning/evening wipes away sins even if they are like sea foam.'
      : 'সকাল-সন্ধ্যায় ১০০ বার পাঠ করলে সমুদ্রের ফেনা পরিমাণ গুনাহ মাফ হয়।',
    reference: lang === 'en' ? 'Sahih Bukhari: 6405' : 'সহীহ বুখারী: ৬৪০৫',
    cycles: [
      { name: lang === 'en' ? 'SubhanAllahi wa bihamdihi (سُبْحَانَ اللَّهِ وَبِحَمْدِهِ)' : 'সুবহানাল্লাহি ওয়া বিহামদিহি (সুবহানাল্লাহি ওয়া বিহামদিহি)', target: 100 }
    ]
  },
  {
    id: 'heavy_scales',
    title: lang === 'en' ? 'Heavy on Scales' : 'মিযানে ভারী যিকির',
    description: lang === 'en'
      ? 'Two phrases light on the tongue but heavy on the scales.'
      : 'উচ্চারণে সহজ কিন্তু মিযানে অনেক ভারী আমল।',
    reference: lang === 'en' ? 'Sahih Bukhari: 7563' : 'সহীহ বুখারী: ৭৫৬৩',
    cycles: [
      { name: lang === 'en' ? 'SubhanAllahi wa bihamdihi (سُبْحَانَ اللَّهِ وَبِحَمْدِهِ)' : 'সুবহানাল্লাহি ওয়া বিহামদিহি (সুবহানাল্লাহি ওয়া বিহামদিহি)', target: 50 },
      { name: lang === 'en' ? 'SubhanAllahil Azim (سُبْحَانَ اللَّهِ الْعَظِيمِ)' : 'সুবহানাল্লাহিল আযীম (سُبْحَانَ اللَّهِ الْعَظِيمِ)', target: 50 }
    ]
  },
  {
    id: 'hasbunallahu_100',
    title: lang === 'en' ? 'Reliance on Allah' : 'আল্লাহর ওপর ভরসা',
    description: lang === 'en'
      ? 'Sufficient for us is Allah, and He is the best Disposer of affairs.'
      : 'আল্লাহই আমাদের জন্য যথেষ্ট এবং তিনিই শ্রেষ্ঠ কর্মবিধায়ক।',
    reference: lang === 'en' ? 'Quran 3:173' : 'আল-কুরআন ৩:১৭৩',
    cycles: [
      { name: lang === 'en' ? 'Hasbunallahu wa nimal wakil (حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ)' : 'হাসবুনাল্লাহু ওয়া নি’মাল ওয়াকীল (হাসবুনাল্লাহু ওয়া নিন্মাল ওয়াকীল)', target: 100 }
    ]
  },
  {
    id: 'sayyidul_istighfar',
    title: lang === 'en' ? 'Sayyidul Istighfar' : 'সাইয়্যিদুল ইস্তিগফার',
    description: lang === 'en'
      ? 'The master of all prayers for forgiveness. If recited with conviction and dies, one enters Jannah.'
      : 'ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া। বিশ্বাসের সাথে সকালে পড়ে সন্ধ্যায় মারা গেলে সে জান্নাতি হবে।',
    reference: lang === 'en' ? 'Sahih Bukhari: 6306' : 'সহীহ বুখারী: ৬৩০৬',
    cycles: [
      { name: lang === 'en' ? 'Sayyidul Istighfar (اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ)' : 'সাইয়্যিদুল ইস্তিগফার (اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ)', target: 1 }
    ]
  },
  {
    id: 'paradise_treasure',
    title: lang === 'en' ? 'Paradise Treasure' : 'জান্নাতের গুপ্তধন',
    description: lang === 'en'
      ? 'La hawla wa la quwwata illa billah is a treasure from the treasures of Jannah.'
      : 'জান্নাতের অন্যতম শ্রেষ্ঠ ভাণ্ডার।',
    reference: lang === 'en' ? 'Sahih Bukhari: 4205' : 'সহীহ বুখারী: ৪২০৫',
    cycles: [
      { name: lang === 'en' ? 'La hawla wa la quwwata illa billah (لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ)' : 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ (لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ)', target: 100 }
    ]
  },
  {
    id: 'four_best_words_pkg',
    title: lang === 'en' ? 'Four Beloved Words' : 'আল্লাহর প্রিয় ৪ বাক্য',
    description: lang === 'en' 
      ? 'The words most beloved to Allah.'
      : 'আল্লাহর কাছে সবচেয়ে প্রিয় ৪টি বাক্য।',
    reference: lang === 'en' ? 'Sahih Muslim: 2137' : 'সহীহ মুসলিম: ২১৩৭',
    cycles: [
      { name: lang === 'en' ? 'SubhanAllah (سُبْحَانَ اللَّهِ)' : 'সুবহানাল্লাহ (سُبْحَانَ اللَّهِ)', target: 25 },
      { name: lang === 'en' ? 'Alhamdulillah (الْحَمْدُ لِلَّهِ)' : 'আলহামদুলিল্লাহ (الْحَمْدُ لِلَّهِ)', target: 25 },
      { name: lang === 'en' ? 'La ilaha illallah (لَا إِلٰهَ إِلَّا اللَّهُ)' : 'লা ইলাহা ইল্লাল্লাহ (لَا إِلٰهَ إِلَّا اللَّهُ)', target: 25 },
      { name: lang === 'en' ? 'Allahu Akbar (اللَّهُ أَكْبَرُ)' : 'আল্লাহু আকবার (اللَّهُ أَكْبَرُ)', target: 25 }
    ]
  }
];

interface TasbihCounterProps {
  language: Language;
}

const TasbihCounter: React.FC<TasbihCounterProps> = ({ language }) => {
  const presets = getPresets(language);

  const [count, setCount] = useState(() => {
    const val = parseInt(localStorage.getItem('tasbih_count') || '0', 10);
    return isNaN(val) ? 0 : val;
  });
  const [currentCycle, setCurrentCycle] = useState(() => {
    const val = parseInt(localStorage.getItem('tasbih_current_cycle') || '0', 10);
    return isNaN(val) ? 0 : val;
  });
  const [activePresetId, setActivePresetId] = useState(() => localStorage.getItem('tasbih_active_preset_id') || 'salah_post');

  const [dailyTotals, setDailyTotals] = useState<Record<string, Record<string, number>>>(() => safeParse('tasbih_daily_totals', {}));
  const [dailyDhikrStats, setDailyDhikrStats] = useState<Record<string, Record<string, number>>>(() => safeParse('tasbih_daily_dhikr_stats', {}));

  const getTodayKey = () => new Date().toISOString().split('T')[0];
  const todayKey = getTodayKey();
  const currentPackageTotal = dailyTotals[todayKey]?.[activePresetId] || 0;
  const dhikrStatsForToday = dailyDhikrStats[todayKey] || {};

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPackagePicker, setShowPackagePicker] = useState(false);
  const [showDuaLibrary, setShowDuaLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [showCompletionNotification, setShowCompletionNotification] = useState(false);
  const [hasTriggeredCompletion, setHasTriggeredCompletion] = useState(false);
  const [completionMotivation, setCompletionMotivation] = useState('');
  const [isSuccessState, setIsSuccessState] = useState(false);

  const [newPackageTitle, setNewPackageTitle] = useState('');
  const [newPackageCycles, setNewPackageCycles] = useState<CycleItem[]>([{ name: '', target: 33 }]);
  
  const [hapticSettings, setHapticSettings] = useState<HapticConfig>(() => safeParse('tasbih_haptic_settings', DEFAULT_HAPTIC));
  const [userPackages, setUserPackages] = useState<TasbihCombination[]>(() => safeParse('tasbih_user_packages', []));

  const [cycles, setCycles] = useState<CycleItem[]>(() => {
    const saved = localStorage.getItem('tasbih_custom_cycles');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    const initialPreset = presets.find(p => p.id === activePresetId) || presets[0];
    return initialPreset.cycles;
  });

  useEffect(() => {
    if (!activePresetId.startsWith('user_')) {
      const freshPreset = getPresets(language).find(p => p.id === activePresetId);
      if (freshPreset) setCycles(freshPreset.cycles);
    }
  }, [language, activePresetId]);

  useEffect(() => { localStorage.setItem('tasbih_count', count.toString()); }, [count]);
  useEffect(() => { localStorage.setItem('tasbih_current_cycle', currentCycle.toString()); }, [currentCycle]);
  useEffect(() => { localStorage.setItem('tasbih_active_preset_id', activePresetId); }, [activePresetId]);
  useEffect(() => { localStorage.setItem('tasbih_custom_cycles', JSON.stringify(cycles)); }, [cycles]);
  useEffect(() => { localStorage.setItem('tasbih_haptic_settings', JSON.stringify(hapticSettings)); }, [hapticSettings]);
  useEffect(() => { localStorage.setItem('tasbih_daily_totals', JSON.stringify(dailyTotals)); }, [dailyTotals]);
  useEffect(() => { localStorage.setItem('tasbih_daily_dhikr_stats', JSON.stringify(dailyDhikrStats)); }, [dailyDhikrStats]);

  const vibrate = useCallback((duration: number | number[]) => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(duration); } catch (e) {}
    }
  }, []);

  const resetCurrent = useCallback(() => {
    setCount(0);
    setHasTriggeredCompletion(false);
    setIsSuccessState(false);
    vibrate(20);
  }, [vibrate]);

  const currentCycleData = cycles[currentCycle] || cycles[0];
  const currentTarget = currentCycleData?.target || 33;

  const updateStats = useCallback((pkgId: string, dhikrName: string, increment: number) => {
    const today = getTodayKey();
    
    setDailyTotals(prev => {
      const currentDays = prev[today] || {};
      const currentPkgTotal = currentDays[pkgId] || 0;
      const updatedDays = { ...currentDays, [pkgId]: Math.max(0, currentPkgTotal + increment) };
      return { ...prev, [today]: updatedDays };
    });

    setDailyDhikrStats(prev => {
      const currentDays = prev[today] || {};
      const currentDhikrTotal = currentDays[dhikrName] || 0;
      const updatedDays = { ...currentDays, [dhikrName]: Math.max(0, currentDhikrTotal + increment) };
      return { ...prev, [today]: updatedDays };
    });
  }, []);

  const handleTap = useCallback(() => {
    if (showPackagePicker || showSettings || isEditingTarget || isSuccessState || showCreateModal || showDuaLibrary || showHistory) return;
    
    const targetVal = cycles[currentCycle]?.target || 33;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
    
    if (hapticSettings.tap > 0) vibrate(hapticSettings.tap);
    
    setCount(prev => prev + 1);
    updateStats(activePresetId, currentCycleData.name, 1);

    if (count + 1 >= targetVal) {
      if (currentCycle < cycles.length - 1) {
        if (hapticSettings.complete > 0) vibrate(hapticSettings.complete);
      } else {
        if (hapticSettings.complete > 0) vibrate([hapticSettings.complete, 100, hapticSettings.complete]);
      }
    }
  }, [count, currentCycle, cycles, currentCycleData, hapticSettings, isEditingTarget, isSuccessState, showPackagePicker, showSettings, showCreateModal, showDuaLibrary, showHistory, vibrate, updateStats, activePresetId]);

  const nextStep = useCallback(() => {
    setCount(0);
    setCurrentCycle(prev => (prev + 1) % cycles.length);
    setIsEditingTarget(false);
    setShowCompletionNotification(false);
    setHasTriggeredCompletion(false);
    setIsSuccessState(false);
    vibrate([25, 40, 25]);
  }, [cycles.length, vibrate]);

  const applyPreset = (preset: TasbihCombination) => {
    setCycles(preset.cycles);
    setCurrentCycle(0);
    setCount(0);
    setHasTriggeredCompletion(false);
    setIsSuccessState(false);
    setActivePresetId(preset.id);
    setShowPackagePicker(false);
    vibrate(20);
  };

  const createCustomPackage = () => {
    const title = newPackageTitle.trim().slice(0, 50);
    if (!title) return;
    
    const filteredCycles = newPackageCycles
      .filter(c => c.name.trim() !== '')
      .map(c => ({ 
        name: c.name.trim().slice(0, 50), 
        target: Math.max(1, Math.min(99999, c.target)) 
      }));

    if (filteredCycles.length === 0) return;

    const newPkg: TasbihCombination = { 
      id: 'user_' + Date.now(), 
      title, 
      description: 'Custom package', 
      cycles: filteredCycles 
    };

    const updated = [...userPackages, newPkg];
    setUserPackages(updated);
    localStorage.setItem('tasbih_user_packages', JSON.stringify(updated));
    setShowCreateModal(false);
    setNewPackageTitle('');
    setNewPackageCycles([{ name: '', target: 33 }]);
    vibrate(20);
  };

  const handleTargetSubmit = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0 && val < 1000000) {
      const newCycles = cycles.map(c => ({ ...c, target: val }));
      setCycles(newCycles);
      setIsEditingTarget(false);
      vibrate(15);
    } else {
      setIsEditingTarget(false);
    }
  };

  useEffect(() => {
    if (count >= currentTarget && count > 0 && !isSuccessState) {
      if (currentCycle < cycles.length - 1) {
        const timer = setTimeout(() => {
          setCount(0);
          setCurrentCycle(prev => prev + 1);
          setHasTriggeredCompletion(false);
        }, 300); 
        return () => clearTimeout(timer);
      } else if (!hasTriggeredCompletion) {
        const handleFullPackageCompletion = () => {
          setHasTriggeredCompletion(true);
          setIsSuccessState(true); 
          const motivation = getCompletionMotivation(language);
          setCompletionMotivation(motivation);
          setShowCompletionNotification(true);
          
          setTimeout(() => setShowCompletionNotification(false), 5000);
          setTimeout(() => {
            setCount(0);
            setIsSuccessState(false);
            setCurrentCycle(0);
            setHasTriggeredCompletion(false);
          }, 3000); 
        };
        handleFullPackageCompletion();
      }
    }
  }, [count, currentTarget, currentCycle, cycles.length, activePresetId, hasTriggeredCompletion, isSuccessState, language]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full space-y-4 sm:space-y-8">
      
      {/* Slide-down Notification */}
      <div className={`fixed top-4 left-4 right-4 z-[300] transition-all duration-700 transform ${showCompletionNotification ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'}`}>
        <div className="w-full max-w-lg mx-auto glass-panel p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-5 border border-emerald-500/20">
          <div className="size-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-1">{language === 'en' ? 'MashaAllah!' : 'মাশাআল্লাহ!'}</h4>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight italic">"{completionMotivation}"</p>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="w-full flex justify-between items-center px-4">
        <div className="flex gap-2">
          <button onClick={() => { setShowPackagePicker(true); vibrate(10); }} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/10 shadow-sm active:scale-95 transition-all">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            {language === 'en' ? 'Packages' : 'প্যাকেজ'}
          </button>
          <button onClick={() => { setShowHistory(true); vibrate(10); }} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm border border-slate-500/10 shadow-sm active:scale-95 transition-all">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {language === 'en' ? 'History' : 'ইতিহাস'}
          </button>
          <button onClick={() => { setShowDuaLibrary(true); vibrate(10); }} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-500/10 shadow-sm active:scale-95 transition-all">
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            {language === 'en' ? 'Duas' : 'দুয়া'}
          </button>
          <button onClick={() => { setShowSettings(true); vibrate(10); }} className="p-2.5 rounded-2xl glass-panel text-slate-500 dark:text-slate-400 shadow-sm active:scale-95 transition-all">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37-1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </div>

      {/* Cycle Indicator */}
      <div className="w-full flex justify-start items-center p-3 rounded-[2rem] glass-panel border border-slate-200/20 shadow-xl overflow-x-auto no-scrollbar mx-4">
        <div className="flex items-center gap-6 px-4 min-w-max">
          {cycles.map((cycle, idx) => (
            <div key={idx} onClick={() => { if(isSuccessState) return; setCurrentCycle(idx); setCount(0); vibrate(10); }} className={`flex flex-col items-center cursor-pointer transition-all ${idx === currentCycle ? 'opacity-100 scale-105' : 'opacity-30 scale-90'}`}>
              <div className={`w-3 h-3 rounded-full mb-1 ${idx === currentCycle ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-300 dark:bg-slate-700'}`} />
              <span className={`text-[10px] font-bold ${idx === currentCycle ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 font-numbers'}`}>{cycle.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Counter Panel */}
      <div className={`w-full flex-1 flex flex-col justify-center rounded-[3rem] shadow-2xl p-fluid-card border relative transition-all duration-700 overflow-hidden ${isSuccessState ? 'bg-emerald-100/80 dark:bg-emerald-950/40 border-emerald-400/50 animate-success-pulse' : 'glass-panel border-white/40 dark:border-slate-700/30'}`}>
        <div className="flex flex-col items-center relative z-10 w-full px-4 text-center">
          <p className="font-bold text-xl sm:text-4xl tracking-tight text-emerald-600 dark:text-emerald-400 mb-6 font-numbers">{currentCycleData?.name}</p>
          <div className="text-fluid-count font-black tracking-tighter tabular-nums leading-none text-slate-900 dark:text-slate-50 mb-12 select-none">
            {language === 'bn' ? count.toLocaleString('bn-BD') : count}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 shadow-lg flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'en' ? 'Today' : 'আজ'}:</span>
               <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-numbers">{language === 'bn' ? currentPackageTotal.toLocaleString('bn-BD') : currentPackageTotal}</span>
            </div>
            <button 
              onClick={() => { if(!isSuccessState) { setTempTarget(currentTarget.toString()); setIsEditingTarget(true); vibrate(5); } }}
              className="px-6 py-3 rounded-3xl bg-slate-500/5 border border-slate-500/10 shadow-lg flex items-center gap-3 active:scale-95 transition-all hover:bg-slate-500/10"
            >
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'en' ? 'Goal' : 'লক্ষ্য'}:</span>
               {isEditingTarget ? (
                 <input 
                   autoFocus
                   type="number" 
                   value={tempTarget}
                   onChange={e => setTempTarget(e.target.value.slice(0, 6))}
                   onBlur={handleTargetSubmit}
                   onKeyDown={e => e.key === 'Enter' && handleTargetSubmit()}
                   className="w-16 bg-white dark:bg-slate-800 border-none rounded-lg text-lg font-black text-center text-emerald-600 outline-none ring-2 ring-emerald-500/30"
                 />
               ) : (
                 <span className="text-lg font-black text-slate-800 dark:text-slate-200 font-numbers">{language === 'bn' ? currentTarget.toLocaleString('bn-BD') : currentTarget}</span>
               )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tap Button */}
      <div className="py-4 shrink-0">
        <button 
          onClick={handleTap} 
          disabled={isSuccessState || showPackagePicker}
          className={`size-fluid-button rounded-full bg-emerald-600 dark:bg-emerald-700 shadow-2xl shadow-emerald-500/20 active:scale-[0.9] transition-all flex items-center justify-center border-[20px] border-white dark:border-slate-800 ${isSuccessState ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
           <span className="text-white text-3xl sm:text-7xl font-black uppercase tracking-tighter select-none">{language === 'en' ? 'Tap' : 'ট্যাপ'}</span>
        </button>
      </div>

      {/* Footer Controls */}
      <div className="w-full grid grid-cols-3 gap-4 pb-6 shrink-0 px-4">
        <button onClick={() => { if(isSuccessState) return; resetCurrent(); }} className="col-span-1 py-5 rounded-3xl glass-panel text-orange-600 dark:text-orange-400 font-black shadow-lg text-sm sm:text-xl active:scale-95 transition-all">{language === 'en' ? 'Reset' : 'রিসেট'}</button>
        <button onClick={() => { if(isSuccessState) return; nextStep(); }} className="col-span-2 py-5 rounded-3xl bg-emerald-600 dark:bg-emerald-700 text-white font-black shadow-2xl shadow-emerald-500/30 text-sm sm:text-xl active:scale-95 transition-all">{language === 'en' ? 'Next' : 'পরবর্তী'}</button>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
               <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{language === 'en' ? 'Today\'s History' : 'আজকের আমল'}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Resets at Midnight</p>
               </div>
               <button onClick={() => setShowHistory(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl active:scale-90 transition-all">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {Object.keys(dhikrStatsForToday).length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium italic">{language === 'en' ? 'No dhikr performed today yet.' : 'আজ এখন পর্যন্ত কোনো যিকির করা হয়নি।'}</p>
                </div>
              ) : (
                Object.entries(dhikrStatsForToday).map(([name, total]) => (
                  <div key={name} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 tracking-tight font-numbers">{name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((total as number) / 100) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-numbers">{language === 'bn' ? (total as number).toLocaleString('bn-BD') : total}</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{language === 'en' ? 'Completed' : 'পূর্ণ হয়েছে'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
               <p className="text-[10px] font-bold text-slate-400 italic">"The best of deeds are those performed regularly, even if they are small."</p>
            </div>
          </div>
        </div>
      )}

      {/* Package Picker Modal */}
      {showPackagePicker && (
        <div className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
               <div>
                  <h2 className="text-2xl font-black text-emerald-800 dark:text-emerald-500 tracking-tight">{language === 'en' ? 'Dhikr Packages' : 'যিকির প্যাকেজ'}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Quran & Sunnah</p>
               </div>
               <button onClick={() => setShowPackagePicker(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl transition-all active:scale-90">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
               {presets.map(p => (
                 <button 
                   key={p.id} 
                   onClick={() => applyPreset(p)} 
                   className={`w-full p-6 text-left rounded-3xl border transition-all relative group overflow-hidden ${activePresetId === p.id ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900'}`}
                 >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{p.title}</h3>
                        {activePresetId === p.id && <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-2">{p.description}</p>
                      <div className="flex items-center gap-2">
                         <div className="h-px w-4 bg-emerald-500/30"></div>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.reference}</span>
                      </div>
                    </div>
                 </button>
               ))}
               {userPackages.length > 0 && (
                 <div className="pt-4 space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Your Custom Dhikr</h4>
                   {userPackages.map(p => (
                     <button key={p.id} onClick={() => applyPreset(p)} className={`w-full p-6 text-left rounded-3xl border transition-all ${activePresetId === p.id ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'}`}>
                        <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{p.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">Custom Created</p>
                     </button>
                   ))}
                 </div>
               )}
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
               <button onClick={() => { setShowCreateModal(true); setShowPackagePicker(false); vibrate(10); }} className="w-full py-5 bg-emerald-600 dark:bg-emerald-700 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all shadow-emerald-500/20">
                 {language === 'en' ? 'Create Custom Dhikr' : 'নতুন কাস্টম যিকির'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
               <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{language === 'en' ? 'Settings' : 'সেটিংস'}</h2>
               <button onClick={() => setShowSettings(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl active:scale-90 transition-all">
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <div className="p-8 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{language === 'en' ? 'Vibration Strength' : 'ভাইব্রেশন মাত্রা'}</h3>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{language === 'en' ? 'Tap' : 'ট্যাপ'}</span>
                     <input type="range" min="0" max="100" value={hapticSettings.tap} onChange={e => setHapticSettings({...hapticSettings, tap: parseInt(e.target.value)})} className="w-32 accent-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{language === 'en' ? 'Complete' : 'ধাপ শেষ'}</span>
                     <input type="range" min="0" max="250" value={hapticSettings.complete} onChange={e => setHapticSettings({...hapticSettings, complete: parseInt(e.target.value)})} className="w-32 accent-emerald-500" />
                  </div>
               </div>
               <button onClick={() => { if(confirm('Reset all app data? This cannot be undone.')) { localStorage.clear(); window.location.reload(); } }} className="w-full py-5 text-red-500 font-black border border-red-500/10 bg-red-500/5 rounded-2xl hover:bg-red-500/10 transition-all">
                 {language === 'en' ? 'Reset App Data' : 'অ্যাপ ডেটা রিসেট'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[600] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
               <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{language === 'en' ? 'Custom Dhikr' : 'নতুন প্যাকেজ'}</h2>
               <button onClick={() => setShowCreateModal(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-2xl active:scale-90 transition-all"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
               <input type="text" maxLength={50} placeholder={language === 'en' ? "Title (e.g. My Morning Dhikr)" : "নাম (যেমন: সকালের আমল)"} value={newPackageTitle} onChange={e => setNewPackageTitle(e.target.value)} className="w-full p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-800 dark:text-slate-100" />
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Steps</h3>
                  {newPackageCycles.map((c, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" maxLength={50} placeholder="Dhikr Name" value={c.name} onChange={e => { const updated = [...newPackageCycles]; updated[idx].name = e.target.value; setNewPackageCycles(updated); }} className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200" />
                      <input type="number" min="1" max="99999" placeholder="Target" value={c.target} onChange={e => { const updated = [...newPackageCycles]; updated[idx].target = Math.min(99999, parseInt(e.target.value) || 0); setNewPackageCycles(updated); }} className="w-24 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 font-black text-center text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ))}
                  <button onClick={() => { if(newPackageCycles.length < 10) setNewPackageCycles([...newPackageCycles, { name: '', target: 33 }]); vibrate(5); }} className="px-4 py-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 rounded-xl hover:bg-emerald-500/20 transition-all">+ Add Step</button>
               </div>
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-slate-800">
               <button onClick={createCustomPackage} className="w-full py-5 bg-emerald-600 dark:bg-emerald-700 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all shadow-emerald-500/20">{language === 'en' ? 'Save Package' : 'সংরক্ষণ করুন'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Library calls */}
      <DuaLibrary language={language} isOpen={showDuaLibrary} onClose={() => setShowDuaLibrary(false)} />
    </div>
  );
};

export default TasbihCounter;
