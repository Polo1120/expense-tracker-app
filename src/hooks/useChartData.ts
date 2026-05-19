import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
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
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          // Fetch expenses from Supabase
          const { data: expenseRecords, error: dbError } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId);

          if (dbError) throw dbError;

          const savedBudget = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT);

          setExpenses((expenseRecords || []) as unknown as Expense[]); // Cast for now, ensuring types match later
          if (savedBudget) {
            setBudgetAmount(Number(savedBudget));
          }
        } catch (error) {
          console.error("Failed to fetch chart data:", error);
          setError("Failed to fetch chart data. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetMode]); // Added budgetMode dependency if it matters, or keep empty if independent

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
          if (!e.created_at) return false;
          const expenseDate = new Date(e.created_at);

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
        if (!e.created_at) return false;
        const expenseDate = new Date(e.created_at);
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
