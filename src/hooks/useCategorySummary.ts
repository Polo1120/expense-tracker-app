import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants";
import { getDateRange } from "../utils/dateHelpers";
import { Expense } from "../types";
import { useExpenses } from "../context/Expenses/ExpensesContext";

export interface CategorySummaryData {
  name: string;
  total: number;
}

export const useCategorySummary = () => {
  const { expenses, loading: expensesLoading } = useExpenses();
  const [summary, setSummary] = useState<CategorySummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgetFrequency, setBudgetFrequency] = useState<'month' | 'fortnight'>('month');

  useEffect(() => {
    const processExpenses = async () => {
      setLoading(true);
      try {
        const savedFrequency = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY);
        const activeFrequency =
          savedFrequency === 'fortnight' || savedFrequency === 'month'
            ? savedFrequency
            : budgetFrequency;

        setBudgetFrequency(activeFrequency);

        const { firstDay, lastDay } = getDateRange(activeFrequency);

        // Filter global expenses locally
        const currentPeriodExpenses = expenses.filter(exp => {
          if (!exp.created_at) return false;
          const expDate = new Date(exp.created_at);
          return expDate >= firstDay && expDate <= lastDay;
        });

        const summaryData = currentPeriodExpenses
          .filter((expense: Expense) => expense.type === "expense")
          .reduce((acc: { [key: string]: CategorySummaryData }, expense: Expense) => {
            const category = expense.category || "Other";
            if (!acc[category]) {
              acc[category] = { name: category, total: 0 };
            }
            acc[category].total += expense.amount; // Ensure amount exists
            return acc;
          }, {} as { [key: string]: CategorySummaryData });

        setSummary(Object.values(summaryData));
      } catch (error) {
        console.error("Failed to process category summary:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!expensesLoading) {
      processExpenses();
    }
  }, [budgetFrequency, expenses, expensesLoading]);

  return { summary, loading: loading || expensesLoading };
};
