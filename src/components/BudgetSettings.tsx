import React, { useState, useEffect } from "react";
import { View, StyleSheet} from "react-native";
import { Text, ButtonGroup, Input, Button } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";


type BudgetMode = "budget" | "total";
type PeriodMode = "monthly" | "biweekly";

export default function BudgetSettings() {
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("budget");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("monthly");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
    
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedMode = await AsyncStorage.getItem("budgetMode");
        const savedPeriod = await AsyncStorage.getItem("periodMode");
        const savedAmount = await AsyncStorage.getItem("budgetAmount");

        if (savedMode) setBudgetMode(savedMode as BudgetMode);
        if (savedPeriod) setPeriodMode(savedPeriod as PeriodMode);
        if (savedAmount) setBudgetAmount(savedAmount);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await AsyncStorage.setItem("budgetMode", budgetMode);
      await AsyncStorage.setItem("periodMode", periodMode);
      await AsyncStorage.setItem("budgetAmount", budgetAmount);
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.header}>
        Budget Settings
      </Text>

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
          <Text style={styles.label}>Budget Period</Text>
          <ButtonGroup
            buttons={["Monthly", "Biweekly"]}
            selectedIndex={periodMode === "monthly" ? 0 : 1}
            onPress={(i) => setPeriodMode(i === 0 ? "monthly" : "biweekly")}
            containerStyle={styles.group}
            buttonStyle={styles.groupButton}
            textStyle={styles.groupText}
            selectedButtonStyle={styles.selectedButton}
          />
        </>
      )}

      <Input
        placeholder="Budget Amount (COP)"
        keyboardType="numeric"
        value={budgetAmount}
        onChangeText={setBudgetAmount}
        inputStyle={{ color: "#fff" }}
        inputContainerStyle={styles.inputContainer}
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <Button
        title={saving ? "Saving..." : "Save"}
        onPress={handleSave}
        loading={saving}
        containerStyle={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 16,
  },
  header: {
    color: "#fff",
    marginBottom: 24,
  },
  label: {
    color: "#8A8A8A",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  group: {
    borderRadius: 10,
    marginBottom: 20,
  },
  groupButton: {
    backgroundColor: "#1A1A1A",
  },
  selectedButton: {
    backgroundColor: "#007BFF",
  },
  groupText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#2D2D2D",
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 10,
    height: 56,
  },
  message: {
    color: "#4CAF50",
    textAlign: "center",
    marginVertical: 10,
  },
  saveButton: {
    width: "100%",
    marginTop: 10,
  },
});
