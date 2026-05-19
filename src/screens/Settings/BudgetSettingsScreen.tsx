import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, ButtonGroup, Input, Button, useTheme } from "@rneui/themed";
import { useBudgetSettings } from "../../hooks/useBudgetSettings";
import { useCurrency } from "../../hooks/useCurrency";

export default function BudgetSettingsScreen() {
  const { theme } = useTheme();
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
  } = useBudgetSettings();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: 16,
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: 16,
        },
        group: {
          borderRadius: 12,
          marginBottom: 20,
          backgroundColor: theme.colors.grey0,
          borderWidth: 0,
          padding: 4,
        },
        groupButton: {
          backgroundColor: theme.colors.grey0,
          borderRadius: 12,
        },
        selectedButton: {
          backgroundColor: theme.mode === "dark" ? theme.colors.black : theme.colors.white,
          borderRadius: 12,
        },
        groupText: {
          color: theme.colors.grey3,
          fontWeight: "600",
        },
        selectedGroupText: {
          color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
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
      }),
    [theme]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ButtonGroup
        buttons={["Budget Mode", "Total Spend Mode"]}
        selectedIndex={budgetMode === "budget" ? 0 : 1}
        onPress={(i) => setBudgetMode(i === 0 ? "budget" : "total_spend")}
        containerStyle={styles.group}
        buttonStyle={styles.groupButton}
        textStyle={styles.groupText}
        selectedButtonStyle={styles.selectedButton}
        selectedTextStyle={styles.selectedGroupText}
        innerBorderStyle={{ width: 0 }}
      />

      {budgetMode === "budget" && (
        <>
          <Input
            placeholder={`Budget Amount (${currency})`}
            keyboardType="numeric"
            value={budgetAmount}
            onChangeText={setBudgetAmount}
            inputStyle={{ color: theme.colors.adaptiveColor }}
            inputContainerStyle={styles.inputContainer}
          />
        </>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={saving ? "Saving..." : "Save"}
        onPress={handleSave}
        loading={saving}
        containerStyle={styles.saveButton}
      />
    </View>
  );
}
