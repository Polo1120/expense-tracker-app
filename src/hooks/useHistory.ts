import { useState, useEffect } from "react";
import { Expense } from "../types";
import { useExpenses } from "../context/Expenses/ExpensesContext";

export function useHistory() {
    const { expenses, loading: expensesLoading, refreshExpenses } = useExpenses();
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

    useEffect(() => {
        setLoading(true);
        let filtered = expenses;
        if (filter !== "all") {
            filtered = expenses.filter(exp => exp.type === filter);
        }
        setTransactions(filtered);
        setLoading(false);
    }, [filter, expenses]);

    return { transactions, loading: loading || expensesLoading, filter, setFilter, refresh: refreshExpenses };
}
