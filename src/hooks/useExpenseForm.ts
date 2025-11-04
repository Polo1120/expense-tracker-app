import { useState } from "react";
import pb from "../lib/client";
import { ExpenseFormData } from "../types";

export function useExpenseForm() {
  const [formData, setFormData] = useState<Omit<ExpenseFormData, 'user'>>({
    name: "",
    amount: 0,
    category: "",
    date: "",
    type: "expense",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpenseFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof Omit<ExpenseFormData, 'user'>, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "amount" ? Number(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setSuccessMessage("");
    setError(null);
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
      valid = false;
    }

    if (formData.type === "expense" && !formData.category.trim()) {
      newErrors.category = "Category is required for expenses";
      valid = false;
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setError(null);

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const expenseData: ExpenseFormData = {
        ...formData,
        user: userId,
      };

      await pb.collection("expenses").create(expenseData);
      setSuccessMessage("Transaction saved successfully!");
      setFormData({ name: "", amount: 0, category: "", date: "", type: "expense" });
    } catch (error: any) {
      console.error("Error creating expense:", error);
      setError("Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    successMessage,
    error,
    handleChange,
    handleSubmit,
  };
}
