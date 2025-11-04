import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "../lib/client";
import { STORAGE_KEYS } from "../constants";
import { Expense } from "../types";

type BudgetMode = "budget" | "total_spend";

interface DashboardData {
  budgetAmount: number;
  budgetMode: BudgetMode;
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
      // Health check
      await pb.health.check();

      const [savedBudget, savedMode, savedFrequency] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY),
      ]);

      if (savedBudget) setBudgetAmount(Number(savedBudget));
      if (savedMode) setBudgetMode(savedMode as BudgetMode);
      if (savedFrequency) setBudgetFrequency(savedFrequency as 'month' | 'fortnight');

      const userId = pb.authStore.model?.id;
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

      const expenses = await pb.collection("expenses").getFullList<Expense>({
        filter: `user.id = "${userId}" && date >= "${firstDay.toISOString().split('T')[0]}" && date <= "${lastDay.toISOString().split('T')[0]}"`,
      });

      const expensesTotal = expenses
        .filter((exp) => exp.type === "expense")
        .reduce((acc, exp) => acc + (exp.amount || 0), 0);
      const incomeTotal = expenses
        .filter((exp) => exp.type === "income")
        .reduce((acc, exp) => acc + (exp.amount || 0), 0);

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
    }, [])
  );

  useEffect(() => {
    const unsubscribe = pb.collection("expenses").subscribe("*", (e) => {
      if (e.action === "create" || e.action === "update" || e.action === "delete") {
        loadData();
      }
    });

    return () => {
      pb.collection("expenses").unsubscribe("*");
    };
  }, []);

  return { budgetAmount, budgetMode, totalExpenses, totalIncome, loading, error, budgetFrequency };
}
