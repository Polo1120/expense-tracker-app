import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import { STORAGE_KEYS } from "../constants";
import type { BudgetMode } from "./useBudgetSettings";
import { getDateRange } from "../utils/dateHelpers";
import { Expense } from "../types";
import { useExpenses } from "../context/Expenses/ExpensesContext";

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
  const { expenses, loading: expensesLoading } = useExpenses();
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

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      // Fetch cloud settings to sync across devices
      const { data: userSettings, error: settingsError } = await supabase
        .from('user_settings')
        .select('budget_mode, budget_amount, budget_frequency')
        .eq('user_id', userId)
        .single();

      let activeBudgetAmount = 0;
      let activeBudgetMode: BudgetMode = "budget";
      let activeFrequency: 'month' | 'fortnight' = "month";

      if (!settingsError && userSettings) {
        // Use cloud settings
        activeBudgetAmount = userSettings.budget_amount ? Number(userSettings.budget_amount) : 0;
        activeBudgetMode = userSettings.budget_mode as BudgetMode;
        activeFrequency = userSettings.budget_frequency as 'month' | 'fortnight';
        
        // Save them locally for offline access/fast load next time
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_AMOUNT, activeBudgetAmount.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_MODE, activeBudgetMode);
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_FREQUENCY, activeFrequency);
      } else {
        // Fallback to local storage if cloud fetch fails or first time
        if (savedBudget) activeBudgetAmount = Number(savedBudget);
        if (savedMode === "total") activeBudgetMode = "total_spend";
        else if (savedMode === "budget" || savedMode === "total_spend") activeBudgetMode = savedMode as BudgetMode;
        if (savedFrequency) activeFrequency = savedFrequency as 'month' | 'fortnight';
      }

      setBudgetAmount(activeBudgetAmount);
      setBudgetMode(activeBudgetMode);
      setBudgetFrequency(activeFrequency);

      const { firstDay, lastDay } = getDateRange(activeFrequency);

      // Filter global expenses instead of querying Supabase
      const currentPeriodExpenses = expenses.filter(exp => {
        if (!exp.created_at) return false;
        const expDate = new Date(exp.created_at);
        return expDate >= firstDay && expDate <= lastDay;
      });

      const expensesTotal = currentPeriodExpenses
        .filter((exp: Expense) => exp.type === "expense")
        .reduce((acc: number, exp: Expense) => acc + (exp.amount || 0), 0);
      const incomeTotal = currentPeriodExpenses
        .filter((exp: Expense) => exp.type === "income")
        .reduce((acc: number, exp: Expense) => acc + (exp.amount || 0), 0);

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
      if (!expensesLoading) {
        loadData();
      }
    }, [budgetFrequency, expenses, expensesLoading])
  );

  return { budgetAmount, budgetMode, totalExpenses, totalIncome, loading: loading || expensesLoading, error, budgetFrequency };
}
