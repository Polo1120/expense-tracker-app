import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, LinearProgress } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "../lib/client";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface Expense {
  id: string;
  amount: number;
  user: string;
}

export default function Dashboard() {
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [budgetMode, setBudgetMode] = useState<string>("budget");
  const [periodMode, setPeriodMode] = useState<string>("monthly");
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadSettingsAndExpenses = async () => {
        try {
          setLoading(true);

          // Cargar configuración local
          const [savedBudget, savedMode, savedPeriod] = await Promise.all([
            AsyncStorage.getItem("budgetAmount"),
            AsyncStorage.getItem("budgetMode"),
            AsyncStorage.getItem("periodMode"),
          ]);

          if (savedBudget) setBudgetAmount(Number(savedBudget));
          if (savedMode) setBudgetMode(savedMode);
          if (savedPeriod) setPeriodMode(savedPeriod);

          // Usuario actual
          const userId = pb.authStore.model?.id;
          if (!userId) return;

          // Obtener gastos
          const expenses = await pb.collection("expenses").getFullList({
            filter: `user.id = "${userId}"`,
          });

          const total = expenses.reduce(
            (acc, exp) => acc + (exp.amount || 0),
            0
          );
          setTotalExpenses(total);
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      loadSettingsAndExpenses();
    }, [])
  );

  const percent = budgetAmount > 0 ? totalExpenses / budgetAmount : 0;
  const remaining = budgetAmount - totalExpenses;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>Dashboard</Card.Title>
        <Card.Divider />

        <Text style={styles.text}>
          Mode:{" "}
          <Text style={styles.highlight}>
            {budgetMode === "budget" ? "Budget Mode" : "Total Spend Mode"}
          </Text>
        </Text>

        {budgetMode === "budget" && (
          <Text style={styles.text}>
            Period:{" "}
            <Text style={styles.highlight}>
              {periodMode === "monthly" ? "Monthly" : "Biweekly"}
            </Text>
          </Text>
        )}

        <Text style={styles.text}>
          Total Budget:{" "}
          <Text style={styles.highlight}>${budgetAmount.toFixed(2)}</Text>
        </Text>

        <Text style={styles.text}>
          Total Spent:{" "}
          <Text style={styles.highlight}>${totalExpenses.toFixed(2)}</Text>
        </Text>

        <Text style={styles.text}>
          Remaining:{" "}
          <Text
            style={[
              styles.highlight,
              { color: remaining < 0 ? "#FF5252" : "#4CAF50" },
            ]}
          >
            ${remaining.toFixed(2)}
          </Text>
        </Text>

        <LinearProgress
          value={percent > 1 ? 1 : percent}
          variant="determinate"
          color={remaining < 0 ? "#FF5252" : "#007BFF"}
          style={styles.progress}
        />
        <Text style={styles.percentText}>
          {(percent * 100).toFixed(1)}% used
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
  },
  title: {
    color: "#fff",
  },
  text: {
    color: "#E0E0E0",
    marginBottom: 6,
  },
  highlight: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  progress: {
    marginTop: 10,
    borderRadius: 10,
    height: 8,
  },
  percentText: {
    color: "#A0A0A0",
    marginTop: 6,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
});
