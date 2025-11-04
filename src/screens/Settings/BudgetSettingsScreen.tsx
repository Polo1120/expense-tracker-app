import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, ButtonGroup, Input, Button, useTheme } from "@rneui/themed";
import { useBudgetSettings } from "../../hooks/useBudgetSettings";
import { useCurrency } from "../../hooks/useCurrency";
import { SafeAreaView } from "react-native-safe-area-context";

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
          padding: 16,
        },
        label: {
          color: theme.colors.grey3,
          marginBottom: 6,
          fontSize: 14,
          fontWeight: "600",
        },
        group: {
          borderRadius: 10,
          marginBottom: 20,
        },
        groupButton: {
          backgroundColor: theme.colors.grey5,
        },
        selectedButton: {
          backgroundColor: theme.colors.primary,
        },
        groupText: {
          color: theme.colors.white,
          fontWeight: "600",
        },
        inputContainer: {
          borderWidth: 1,
          borderColor: theme.colors.grey4,
          borderRadius: 10,
          backgroundColor: theme.colors.grey5,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text style={styles.label}>Mode</Text>
        <ButtonGroup
          buttons={["Budget Mode", "Total Spend Mode"]}
          selectedIndex={budgetMode === "budget" ? 0 : 1}
          onPress={(i) => setBudgetMode(i === 0 ? "budget" : "total")}
          containerStyle={styles.group}
          buttonStyle={styles.groupButton}
          textStyle={styles.groupText}
          selectedButtonStyle={styles.selectedButton}
        />

        {budgetMode === "budget" && (
          <>
            <Input
              placeholder={`Budget Amount (${currency})`}
              keyboardType="numeric"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              inputStyle={{ color: theme.colors.white }}
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
    </SafeAreaView>
  );
}
