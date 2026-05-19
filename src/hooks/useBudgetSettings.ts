import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
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

        // 1. Check local storage first for immediate UI render
        const [savedMode, savedAmount, savedFrequency] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_AMOUNT),
          AsyncStorage.getItem(STORAGE_KEYS.BUDGET_FREQUENCY),
        ]);

        if (savedMode === "total") setBudgetMode("total_spend");
        else if (savedMode === "budget" || savedMode === "total_spend") setBudgetMode(savedMode);
        
        if (savedAmount) setBudgetAmount(savedAmount);
        if (savedFrequency) setBudgetFrequency(savedFrequency as 'month' | 'fortnight');

        // 2. Fetch from Supabase to override with cloud truth
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          const { data, error } = await supabase
            .from('user_settings')
            .select('budget_mode, budget_amount, budget_frequency')
            .eq('user_id', userId)
            .single();

          if (!error && data) {
            const dbMode = data.budget_mode as BudgetMode;
            if (dbMode === 'budget' || dbMode === 'total_spend') {
              setBudgetMode(dbMode);
              await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_MODE, dbMode);
            }
            
            if (data.budget_amount !== null) {
              setBudgetAmount(data.budget_amount.toString());
              await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_AMOUNT, data.budget_amount.toString());
            }

            if (data.budget_frequency) {
              setBudgetFrequency(data.budget_frequency as 'month' | 'fortnight');
              await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_FREQUENCY, data.budget_frequency);
            }
          }
        }
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

      // Save locally
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_MODE, budgetMode);
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_FREQUENCY, budgetFrequency);
      if (budgetAmount) {
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGET_AMOUNT, budgetAmount);
      }

      // Save to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const payload = {
          user_id: userId,
          budget_mode: budgetMode,
          budget_frequency: budgetFrequency,
          budget_amount: budgetAmount ? Number(budgetAmount) : null,
        };

        const { error } = await supabase
          .from('user_settings')
          .upsert(payload, { onConflict: 'user_id' });

        if (error) throw error;
      }

      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings to the cloud.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetBudgetMode = (mode: BudgetMode) => {
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
