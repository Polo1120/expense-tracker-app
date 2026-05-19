import { useCurrency } from '../hooks/useCurrency';

export const useFormatCurrency = () => {
  const { currency } = useCurrency();

  return (value: number) => {
   
    const isZeroDecimal = currency === 'COP' || currency === 'JPY';
    
   
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(value);

    
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      COP: '$',
    };

    const symbol = symbols[currency] || '$';

    return `${symbol} ${formattedNumber}`;
  }
};
