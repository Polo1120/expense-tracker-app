import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "../lib/client";
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
      const userId = pb.authStore.model?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const savedFrequency = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY);
      if (savedFrequency) setBudgetFrequency(savedFrequency as 'month' | 'fortnight');

      try {
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

        const expenseRecords: any[] = await pb
          .collection("expenses")
          .getFullList({
            filter: `user.id = "${userId}" && date >= "${firstDay.toISOString().split('T')[0]}" && date <= "${lastDay.toISOString().split('T')[0]}"`,
          });

        const summaryData = expenseRecords.reduce((acc, expense) => {
          const category = expense.category || "Other";
          if (!acc[category]) {
            acc[category] = { name: category, total: 0 };
          }
          acc[category].total += expense.amount;
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
