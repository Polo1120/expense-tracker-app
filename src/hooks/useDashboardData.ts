import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { STORAGE_KEYS } from "../constants";
import type { BudgetMode } from "./useBudgetSettings";

interface DashboardData {
  budgetAmount: number;
  budgetMode: BudgetMode;
  budgetFrequency: 'month' | 'fortnight';
  totalExpenses: number;
  totalIncome: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("budget");
  const [budgetFrequency, setBudgetFrequency] = useState<'month' | 'fortnight'>('month');
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [savedBudget, savedMode, savedFrequency] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY),
      ]);

      if (savedBudget) setBudgetAmount(Number(savedBudget));
      if (savedMode === "total") {
        setBudgetMode("total_spend");
      } else if (savedMode === "budget" || savedMode === "total_spend") {
        setBudgetMode(savedMode);
      }
      if (savedFrequency) setBudgetFrequency(savedFrequency as 'month' | 'fortnight');

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

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

      // Supabase query
      const { data: expenses, error: dbError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId) // Assuming user_id column exists
        .gte('created_at', firstDay.toISOString())
        .lte('created_at', lastDay.toISOString());

      if (dbError) throw dbError;

      const expensesTotal = (expenses || [])
        .filter((exp: any) => exp.type === "expense")
        .reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
      const incomeTotal = (expenses || [])
        .filter((exp: any) => exp.type === "income")
        .reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);

      setTotalExpenses(expensesTotal);
      setTotalIncome(incomeTotal);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [budgetFrequency]) // Added dependency as it affects data loading
  );

  useEffect(() => {
    // Realtime subscription
    const channel = supabase
      .channel('public:expenses')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        (payload: any) => {
          // Ideally check if payload affects current user, but reloading is safe
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [budgetFrequency]);

  return { budgetAmount, budgetMode, totalExpenses, totalIncome, loading, error, budgetFrequency };
}
