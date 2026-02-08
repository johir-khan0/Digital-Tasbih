
import React, { useEffect, useState } from 'react';
import { getDailyInspiration } from '../services/geminiService';
import { Quote } from '../types';
import { Language } from '../App';

interface SpiritualQuoteProps {
  language: Language;
}

const SpiritualQuote: React.FC<SpiritualQuoteProps> = ({ language }) => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Pick a random quote immediately on load/language change
    const data = getDailyInspiration(language);
    setQuote(data);
  }, [language]);

  if (!quote) return null;

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl mx-4 mb-8 border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-colors duration-300">
      <p className="text-emerald-800 dark:text-emerald-300 text-sm italic leading-relaxed">
        {/* We use standard quotes here and ensure the source data doesn't have double quotes */}
        "{quote.text.replace(/^["']+|["']+$/g, '')}"
      </p>
      <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-2 font-normal">— {quote.reference}</p>
    </div>
  );
};

export default SpiritualQuote;
