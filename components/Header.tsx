
import React from 'react';
import { Language } from '../App';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, language, toggleLanguage }) => {
  return (
    <header className="py-2 sm:py-6 px-4 flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-lg sm:text-3xl font-bold text-emerald-700 dark:text-emerald-500 tracking-tight">
          {language === 'en' ? 'Tasbih' : 'তাসবিহ'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm mt-0 watch:hidden font-medium">
          {language === 'en' ? 'Digital Dhikr Companion' : 'ডিজিটাল আমল সাথী'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleLanguage}
          className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 transition-all active:scale-90 font-bold text-xs sm:text-sm"
        >
          {language === 'en' ? 'BN' : 'EN'}
        </button>
        <button 
          onClick={toggleDarkMode}
          className="p-1.5 sm:p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-amber-400 transition-all active:scale-90"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
