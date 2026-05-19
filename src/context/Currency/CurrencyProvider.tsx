import React, { useState, useMemo, useEffect } from 'react';
import { CurrencyContext } from './CurrencyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

const CURRENCY_STORAGE_KEY = 'user_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const loadCurrency = async () => {
      // 1. Load from local storage for fast UI response
      const storedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (storedCurrency) {
        setCurrency(storedCurrency);
      }

      // 2. Load from Supabase to ensure cloud consistency
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('currency')
          .eq('user_id', userId)
          .single();

        if (!error && data && data.currency) {
          // If local storage has a different preference and the DB is still on the default "USD",
          // push the local preference up to the cloud to prevent the default from overriding it.
          if (storedCurrency && storedCurrency !== data.currency && data.currency === 'USD') {
            await supabase
              .from('user_settings')
              .upsert({ user_id: userId, currency: storedCurrency }, { onConflict: 'user_id' });
          } else {
            setCurrency(data.currency);
            await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, data.currency);
          }
        }
      }
    };
    loadCurrency();
  }, []);

  const handleSetCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);
    await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);

    // Save to Supabase
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (userId) {
      await supabase
        .from('user_settings')
        .upsert({ user_id: userId, currency: newCurrency }, { onConflict: 'user_id' });
    }
  };

  const contextValue = useMemo(() => ({ currency, setCurrency: handleSetCurrency }), [currency]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};
