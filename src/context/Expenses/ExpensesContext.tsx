import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Expense } from '../../types';

interface ExpensesContextType {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  refreshExpenses: () => Promise<void>;
}

export const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      setExpenses(data || []);
    } catch (err) {
      console.error("Error fetching expenses globally:", err);
      setError("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();

    // Realtime subscription
    const channel = supabase
      .channel('public:expenses')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        () => {
          fetchExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ExpensesContext.Provider value={{ expenses, loading, error, refreshExpenses: fetchExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};
