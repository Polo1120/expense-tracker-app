import React, { useState, useMemo, useEffect } from 'react';
import { CurrencyContext } from './CurrencyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_STORAGE_KEY = 'user_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const loadCurrency = async () => {
      const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (storedCurrency) {
        setCurrency(storedCurrency);
      }
    };
    loadCurrency();
  }, []);

  const handleSetCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  };

  const contextValue = useMemo(() => ({ currency, setCurrency: handleSetCurrency }), [currency]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};
