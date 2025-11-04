import { createContext } from 'react';

export interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
