import React from "react";
import { View, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import { Text, Input, Button, makeStyles } from "@rneui/themed";
import { useBudgetSettings } from "../../hooks/useBudgetSettings";
import { useCurrency } from "../../hooks/useCurrency";

export default function BudgetSettingsScreen() {
  const styles = useStyles();
  const { currency } = useCurrency();
  const {
    budgetMode,
    setBudgetMode,
    budgetAmount,
    setBudgetAmount,
    loading,
    saving,
    message,
    error,
    handleSave,
    budgetFrequency,
    setBudgetFrequency,
  } = useBudgetSettings();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Dashboard View</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.pill, budgetMode === "total_spend" && styles.pillActive]}
          onPress={() => setBudgetMode("total_spend")}
        >
          <Text style={[styles.pillText, budgetMode === "total_spend" && styles.pillTextActive]}>
            Total Spend
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, budgetMode === "budget" && styles.pillActive]}
          onPress={() => setBudgetMode("budget")}
        >
          <Text style={[styles.pillText, budgetMode === "budget" && styles.pillTextActive]}>
            Budget Mode
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Budget Frequency</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.pill, budgetFrequency === "month" && styles.pillActive]}
          onPress={() => setBudgetFrequency("month")}
        >
          <Text style={[styles.pillText, budgetFrequency === "month" && styles.pillTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, budgetFrequency === "fortnight" && styles.pillActive]}
          onPress={() => setBudgetFrequency("fortnight")}
        >
          <Text style={[styles.pillText, budgetFrequency === "fortnight" && styles.pillTextActive]}>
            Biweekly
          </Text>
        </TouchableOpacity>
      </View>

      {budgetMode === "budget" && (
        <View style={{ marginBottom: 20 }}>
          <Input
            placeholder={`${budgetFrequency === "month" ? "Monthly" : "Biweekly"} Budget Amount (${currency})`}
            keyboardType="numeric"
            value={budgetAmount}
            onChangeText={setBudgetAmount}
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={saving ? "Saving..." : "Save"}
        onPress={handleSave}
        loading={saving}
        containerStyle={styles.saveButton}
      />
    </ScrollView>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: theme.colors.adaptiveColor,
    marginBottom: 16,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  pill: {
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  pillActive: {
    borderColor: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
  },
  pillText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: theme.colors.grey3,
  },
  pillTextActive: {
    color: theme.colors.adaptiveColor,
    fontFamily: "Inter-Bold",
  },
  inputText: {
    color: theme.colors.adaptiveColor,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    borderRadius: 10,
    backgroundColor: theme.colors.grey0,
    paddingHorizontal: 10,
    height: 56,
  },
  message: {
    color: theme.colors.success,
    textAlign: "center",
    marginVertical: 10,
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
    marginVertical: 10,
  },
  saveButton: {
    width: "100%",
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
}));
