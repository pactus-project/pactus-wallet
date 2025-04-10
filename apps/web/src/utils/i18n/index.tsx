'use client';
import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';
import translations from './translations/en';

interface I18nContextType {
  t: (key: string, ...params: string[]) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Enhanced translation function with parameter support
  const t = (key: string, ...params: string[]): string => {
    if (translations && translations[key]) {
      let text = translations[key];
      params.forEach((param, index) => {
        text = text.replace(new RegExp(`\\{${index}\\}`, 'g'), param);
      });
      return text;
    }
    
    // Return the key if no translation found
    return key;
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}; 