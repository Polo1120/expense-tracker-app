export interface Expense {
  id: string;
  amount: number;
  user: string;
  date?: string;
  category?: string;
  type: "income" | "expense";
}

export interface ExpenseFormData {
  name: string;
  amount: number;
  category: string;
  date: string;
  user: string | undefined;
  type: "income" | "expense";
}
