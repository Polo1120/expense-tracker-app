import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants";

export type BudgetMode = "budget" | "total_spend";

export function useBudgetSettings() {
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("budget");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [budgetFrequency, setBudgetFrequency] = useState<'month' | 'fortnight'>('month');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const [savedMode, savedAmount, savedFrequency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT),
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY),
        ]);

        if (savedMode === "total") {
          setBudgetMode("total_spend");
        } else if (savedMode === "budget" || savedMode === "total_spend") {
          setBudgetMode(savedMode);
        }
        if (savedAmount) setBudgetAmount(savedAmount);
        if (savedFrequency) setBudgetFrequency(savedFrequency as 'month' | 'fortnight');
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError(null);

      await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_MODE, budgetMode);
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_FREQUENCY, budgetFrequency);
      if (budgetMode === "budget") {
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_AMOUNT, budgetAmount);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.BUDGET_AMOUNT);
      }

      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetBudgetMode = (mode: BudgetMode) => {
    if (mode === "total_spend") {
      setBudgetAmount("");
    }
    setBudgetMode(mode);
  };

  return {
    budgetMode,
    setBudgetMode: handleSetBudgetMode,
    budgetAmount,
    setBudgetAmount,
    loading,
    saving,
    message,
    error,
    handleSave,
    budgetFrequency,
    setBudgetFrequency,
  };
}
