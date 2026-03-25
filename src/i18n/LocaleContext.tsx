'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type Locale, type TranslationKey, translate } from './translations';

interface LocaleContextType {
  locale: Locale;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  t: (key) => translate(key, 'en'),
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find((c) => c.trim().startsWith('locale='));
    if (localeCookie) {
      const value = localeCookie.split('=')[1]?.trim();
      if (value === 'ro' || value === 'en') {
        setLocale(value);
      }
    }
  }, []);

  const t = (key: TranslationKey) => translate(key, locale);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
