import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Expense } from "../types";

export function useHistory() {
    const [transactions, setTransactions] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            if (!userId) return;

            let query = supabase
                .from("expenses")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (filter !== "all") {
                query = query.eq("type", filter);
            }

            const { data, error } = await query;

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    return { transactions, loading, filter, setFilter, refresh: fetchTransactions };
}
