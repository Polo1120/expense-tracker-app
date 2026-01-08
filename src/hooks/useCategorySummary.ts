import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { STORAGE_KEYS } from "../constants";

export interface CategorySummaryData {
  name: string;
  total: number;
}

export const useCategorySummary = () => {
  const [summary, setSummary] = useState<CategorySummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetFrequency, setBudgetFrequency] = useState<'month' | 'fortnight'>('month');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        const now = new Date();
        let firstDay: Date;
        let lastDay: Date;

        if (budgetFrequency === 'month') {
          firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else { // fortnight
          const dayOfMonth = now.getDate();
          if (dayOfMonth <= 15) {
            firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            lastDay = new Date(now.getFullYear(), now.getMonth(), 15);
          } else {
            firstDay = new Date(now.getFullYear(), now.getMonth(), 16);
            lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          }
        }

        const { data: expenseRecords, error: dbError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .gte('date', firstDay.toISOString().split('T')[0])
          .lte('date', lastDay.toISOString().split('T')[0]);

        if (dbError) throw dbError;

        const summaryData = (expenseRecords || []).reduce((acc: any, expense: any) => {
          const category = expense.category || "Other";
          if (!acc[category]) {
            acc[category] = { name: category, total: 0 };
          }
          acc[category].total += expense.amount; // Ensure amount exists
          return acc;
        }, {} as { [key: string]: CategorySummaryData });

        setSummary(Object.values(summaryData));
      } catch (error) {
        console.error("Failed to fetch category summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return { summary, loading };
};
