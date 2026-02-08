
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TasbihCounter from './components/TasbihCounter';
import SpiritualQuote from './components/SpiritualQuote';
import ArabicCalendar from './components/ArabicCalendar';

export type Language = 'en' | 'bn';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tasbih_dark_mode');
    return saved === 'true';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tasbih_lang');
    return (saved as Language) || 'bn';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tasbih_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('tasbih_lang', language);
  }, [language]);

  // Daily Notification Logic
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    const checkAndSendNotification = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHour = now.getHours();
      const todayKey = now.toISOString().split('T')[0];
      const lastNotifiedDate = localStorage.getItem('tasbih_last_notified_date');

      // Check if it's after 7 PM (19:00) and hasn't notified today
      if (currentHour >= 19 && lastNotifiedDate !== todayKey) {
        new Notification('Reminder', {
          body: 'Ghumanor age Surah Mulk tilwat korte and tasbih porte!',
          icon: '/favicon.ico', // Fallback icon
        });
        localStorage.setItem('tasbih_last_notified_date', todayKey);
      }
    };

    requestNotificationPermission();
    
    // Check immediately on load
    checkAndSendNotification();

    // Check every 15 minutes in case the app is left open
    const interval = setInterval(checkAndSendNotification, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'bn' : 'en');

  return (
    <div className="min-h-screen min-h-screen-ios flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 items-center overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col h-full min-h-screen-ios px-3 sm:px-8">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          language={language} 
          toggleLanguage={toggleLanguage} 
        />
        
        <div className="shrink-0 mt-1 watch:hidden">
          <ArabicCalendar language={language} />
        </div>

        <div className="hidden tall:block watch:hidden shrink-0 mt-1 mb-2">
          <SpiritualQuote language={language} />
        </div>
        
        <main className="flex-1 flex flex-col justify-center py-2 watch:py-0 mb-2">
          <TasbihCounter language={language} />
        </main>
        
        <footer className="py-3 hidden sm:block watch:hidden text-center text-slate-400 dark:text-slate-600 text-[12px] shrink-0 border-t border-slate-200/50 dark:border-slate-900">
          <p>{language === 'en' ? 'Find peace in the remembrance of Allah' : 'আল্লাহর স্মরণে প্রশান্তি খুঁজুন'}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
