export interface Expense {
  id: string;
  name: string; // Added missing name field
  amount: number;
  user_id: string; // Changed from user to user_id
  date?: string;
  category?: string;
  type: "income" | "expense";
  created_at?: string;
}

export interface ExpenseFormData {
  name: string;
  amount: number;
  category: string;
  date: string;
  user: string | undefined;
  type: "income" | "expense";
}
