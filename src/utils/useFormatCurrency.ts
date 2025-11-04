import { useCurrency } from '../hooks/useCurrency';

export const useFormatCurrency = () => {
  const { currency } = useCurrency();

  return (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
};
