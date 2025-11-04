import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, LinearProgress, useTheme } from "@rneui/themed";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useFormatCurrency } from "../../utils/useFormatCurrency";
import { SafeAreaView } from "react-native-safe-area-context";
import { DashboardChart } from "../../components/DashboardChart";
import { CategorySummary } from "../../components/CategorySummary";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const {
    budgetAmount,
    budgetMode,
    totalExpenses,
    totalIncome,
    loading,
    error,
  } = useDashboardData();

  const formatCurrency = useFormatCurrency();

  const { percent, remaining } = useMemo(() => {
    const income = budgetMode === "budget" ? budgetAmount : totalIncome;
    const percent = income > 0 ? totalExpenses / income : 0;
    const remaining = income - totalExpenses;
    return { percent, remaining };
  }, [budgetAmount, totalExpenses, totalIncome, budgetMode]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,

          paddingHorizontal: 16,
        },
        card: {},
        containerValues: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          rowGap: 16,
          justifyContent: "space-between",
        },
        contentValues: {
          padding: 20,
          backgroundColor: theme.mode === "dark" ? theme.colors.grey0 : "",
          borderRadius: 12,
          width: "48%",
          borderWidth: 1,
          borderColor: theme.colors.grey0,
        },
        contentValuesBalance: {
          backgroundColor: theme.mode === "dark" ? theme.colors.grey0 : "",
          width: "100%",
          borderRadius: 12,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.colors.grey0,
        },
        text: {
          fontSize: 16,
          textAlign: "left",
          fontFamily: "Inter-Medium",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          marginBottom: 6,
        },
        highlight: {
          textAlign: "left",
          fontFamily: "Inter-Bold",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          fontSize: 18,
        },
        titleBudget: {
          fontSize: 14,
          color: theme.colors.grey3,
        },
        BudgetTitle: {
          textAlign: "left",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          marginBlock: 32,
        },
        progress: {
          borderRadius: 10,
          height: 8,
          backgroundColor: theme.colors.grey0,
        },
        percentText: {
          color: theme.colors.grey3,
          marginTop: 6,
          textAlign: "left",
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        },
        loadingText: {
          color: theme.colors.white,
          fontSize: 16,
        },
        errorContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          padding: 16,
        },
        errorText: {
          color: theme.colors.error,
          fontSize: 16,
          textAlign: "center",
        },
      }),
    [theme]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          {budgetMode === "budget" && (
            <Text style={styles.titleBudget}>Monthly Budget</Text>
          )}

          <View style={styles.containerValues}>
            <View style={styles.contentValues}>
              <Text style={styles.text}>Income</Text>
              <Text style={styles.highlight}>
                {formatCurrency(
                  budgetMode === "budget" ? budgetAmount : totalIncome
                )}
              </Text>
            </View>

            <View style={styles.contentValues}>
              <Text style={styles.text}>Expenses</Text>
              <Text style={styles.highlight}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>

            <View style={styles.contentValuesBalance}>
              <Text style={styles.text}>Balance</Text>
              <Text
                style={[
                  styles.highlight,
                  {
                    color:
                      remaining < 0
                        ? theme.colors.error
                        : theme.mode === "dark"
                        ? theme.colors.white
                        : theme.colors.black,
                  },
                ]}
              >
                {formatCurrency(remaining)}
              </Text>
            </View>
          </View>

          {budgetMode === "budget" && (
            <>
              <View>
                <Text h3 style={styles.BudgetTitle}>
                  Budget
                </Text>
                <Text style={styles.text}>Remaining</Text>
                <LinearProgress
                  value={percent > 1 ? 1 : percent}
                  variant="determinate"
                  color={
                    remaining < 0
                      ? theme.colors.error
                      : theme.mode === "dark"
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  style={styles.progress}
                />

                <Text style={styles.percentText}>
                  {(percent * 100).toFixed(1)}% used
                </Text>
              </View>
            </>
          )}
        </View>
        <DashboardChart budgetMode={budgetMode} />
        <CategorySummary />
      </ScrollView>
    </SafeAreaView>
  );
}
