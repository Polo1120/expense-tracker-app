import { useState, useEffect, useMemo } from "react";
import pb from "../lib/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants";
import { useTheme } from "@rneui/themed";
import { Expense } from "../types";

export const useChartData = (budgetMode: "budget" | "total_spend") => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Health check
        await pb.health.check();

        const userId = pb.authStore.model?.id;
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          const [expenseRecords, savedBudget] = await Promise.all([
            pb.collection("expenses").getFullList<Expense>({
              filter: `user.id = "${userId}"`,
            }),
            AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT),
          ]);

          setExpenses(expenseRecords);
          if (savedBudget) {
            setBudgetAmount(Number(savedBudget));
          }
        } catch (error) {
          console.error("Failed to fetch chart data:", error);
          setError("Failed to fetch chart data. Please try again later.");
        }
      } catch (err) {
        console.error("Server is not reachable:", err);
        setError("Server is not reachable. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        name: d.toLocaleString("default", { month: "short" }),
        month: d.getMonth(),
        year: d.getFullYear(),
      };
    }).reverse();

    const labels = months.map((m) => m.name);
    const actualSpendData = months.map((m) =>
      expenses
        .filter((e) => {
          if (!e.date) return false;
          const expenseDate = new Date(e.date);

          return (
            expenseDate.getMonth() === m.month &&
            expenseDate.getFullYear() === m.year
          );
        })
        .reduce((sum, e) => sum + e.amount, 0)
    );

    if (budgetMode === "budget") {
      return {
        labels,
        datasets: [
          {
            data: actualSpendData,
            color:
              theme.mode === "dark"
                ? (opacity = 1) => `rgba(158 ,171 ,186, ${opacity})`
                : (opacity = 1) => `rgba(97 ,117, 138, ${opacity})`,
          },
        ],
        legend: [],
      };
    } else {
      return {
        labels,
        datasets: [
          {
            data: actualSpendData,
            color:
              theme.mode === "dark"
                ? (opacity = 1) => `rgba(158 ,171 ,186, ${opacity})`
                : (opacity = 1) => `rgba(97 ,117, 138, ${opacity})`,
          },
        ],
        legend: [],
      };
    }
  }, [expenses, budgetAmount, budgetMode]);

  const { thisMonthPercentage, balance } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = expenses
      .filter((e) => {
        if (!e.date) return false;
        const expenseDate = new Date(e.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const percentage =
      budgetAmount > 0 ? (thisMonthExpenses / budgetAmount) * 100 : 0;
    const monthlyBalance = budgetAmount - thisMonthExpenses;

    return { thisMonthPercentage: percentage, balance: monthlyBalance };
  }, [expenses, budgetAmount]);

  return { data, thisMonthPercentage, balance, loading, error };
};
