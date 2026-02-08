
import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../App';

interface CalendarProps {
  language: Language;
}

const ArabicCalendar: React.FC<CalendarProps> = ({ language }) => {
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [today, setToday] = useState(new Date());

  const [dates, setDates] = useState({
    hijri: '',
    gregorian: '',
    hijriMonth: '',
    gregMonth: '',
  });

  const locale = language === 'bn' ? 'bn-BD' : 'en-US';

  useEffect(() => {
    const updateDates = () => {
      const now = new Date();
      setToday(now);

      const gregFormatter = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const hijriFormatter = new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const hijriMonthFormatter = new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {
        month: 'long',
        year: 'numeric'
      });

      const gregMonthFormatter = new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric'
      });

      setDates({
        gregorian: gregFormatter.format(now),
        hijri: hijriFormatter.format(now),
        hijriMonth: hijriMonthFormatter.format(now),
        gregMonth: gregMonthFormatter.format(now)
      });
    };

    updateDates();
    const nextMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
    const msUntilMidnight = nextMidnight - today.getTime();
    const timeout = setTimeout(updateDates, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, [today, locale]);

  const calendarData = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    // getDay() returns 0 for Sunday, 1 for Monday...
    const startDayOfWeek = firstDayOfMonth.getDay();
    
    const hijriDayFormatter = new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {
      day: 'numeric',
    });

    const hijriMonthNameFormatter = new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {
      month: 'long',
      year: 'numeric'
    });

    const gregMonthNameFormatter = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    });

    const days = [];
    // Padding for the first week
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        hijriDay: hijriDayFormatter.format(date),
        isToday: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }

    return {
      days,
      gregTitle: gregMonthNameFormatter.format(firstDayOfMonth),
      hijriTitle: hijriMonthNameFormatter.format(firstDayOfMonth)
    };
  }, [currentViewDate, today, locale]);

  const changeMonth = (offset: number) => {
    setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + offset, 1));
  };

  // Standardizing labels to start from Sunday to match JS getDay() logic
  const dayNames = language === 'bn' 
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div 
        onClick={() => setShowFullCalendar(true)}
        className="mx-4 mb-4 p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all duration-300 hover:ring-2 hover:ring-emerald-500/20 cursor-pointer active:scale-[0.98]"
      >
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {dates.hijri}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium leading-tight">
              {language === 'en' ? 'Gregorian' : 'গ্রেগরিয়ান'}: {dates.gregorian}
            </span>
          </div>
        </div>
        <div className="text-slate-300 dark:text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {showFullCalendar && (
        <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[95vh]">
            
            <div className="p-6 sm:p-10 bg-emerald-600 dark:bg-emerald-800 text-white relative">
              <button 
                onClick={() => setShowFullCalendar(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex justify-between items-center pr-12">
                <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center flex-1">
                  <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">{calendarData.gregTitle}</h3>
                  <p className="text-sm sm:text-lg text-emerald-100 font-bold uppercase tracking-widest mt-1">{calendarData.hijriTitle}</p>
                </div>
                <button onClick={() => changeMonth(1)} className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-[10px] sm:text-base font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {calendarData.days.map((dayData, idx) => (
                  <div 
                    key={idx} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl transition-all relative
                      ${!dayData ? 'opacity-0' : ''} 
                      ${dayData?.isToday 
                        ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 dark:shadow-none scale-[1.05] z-10' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700'}`}
                  >
                    {dayData && (
                      <>
                        <span className={`text-base sm:text-3xl font-bold ${dayData.isToday ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {dayData.day}
                        </span>
                        <span className={`text-[8px] sm:text-sm font-bold leading-none mt-1 ${dayData.isToday ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-500'}`}>
                          {dayData.hijriDay}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                <button 
                  onClick={() => setCurrentViewDate(new Date())}
                  className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 px-6 py-2 rounded-full transition-all"
                >
                  {language === 'en' ? 'Return to Today' : 'আজকের তারিখে ফিরুন'}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArabicCalendar;
