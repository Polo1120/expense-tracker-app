import React, { useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import pb from "../lib/client";

interface ExpenseFormData {
  name: string;
  amount: number;
  category: string;
  date: string;
  user: string | undefined;
}

export default function AddExpense() {
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: 0,
    category: "",
    date: "",
    user: pb.authStore.model?.id,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpenseFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Bills",
    "Shopping",
    "Other",
  ];

  const handleChange = (key: keyof ExpenseFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "amount" ? Number(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than zero";
      valid = false;
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
      valid = false;
    }

    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");

    try {
      const expenseData = {
        ...formData,
        user: pb.authStore.model?.id,
      };

      await pb.collection("expenses").create(expenseData);
      setSuccessMessage("Expense saved successfully!");
      setFormData({ name: "", amount: 0, category: "", date: "", user: "" });
    } catch (error: any) {
      console.error("Error creating expense:", error);
      setSuccessMessage("Failed to save expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      handleChange("date", formatted);
    }
  };

  return (
    <View style={styles.card}>
      <Input
        placeholder="Expense name"
        value={formData.name}
        onChangeText={(value) => handleChange("name", value)}
        errorMessage={errors.name}
      />

      <Input
        placeholder="Amount"
        keyboardType="numeric"
        value={formData.amount ? formData.amount.toString() : ""}
        onChangeText={(value) => handleChange("amount", value)}
        errorMessage={errors.amount}
      />

      <View style={styles.selectContainer}>
        <Picker
          selectedValue={formData.category}
          onValueChange={(v) => handleChange("category", v)}
          style={styles.picker}
          dropdownIconColor="#888"
        >
          <Picker.Item label="Category" value="" />
          {categories.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>
      {errors.category ? (
        <Text style={styles.errorText}>{errors.category}</Text>
      ) : null}

      <View style={styles.dateContainer}>
        <Button
          title={formData.date ? formData.date : "Date"}
          onPress={() => setShowDatePicker(true)}
          buttonStyle={styles.dateButton}
          titleStyle={{
            color: formData.date ? "#fff" : "#9EABBA",
          }}
          type="clear"
        />
        {errors.date ? (
          <Text style={styles.errorText}>{errors.date}</Text>
        ) : null}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date ? new Date(formData.date) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <Button
        title={loading ? "Saving..." : "Save Expense"}
        onPress={handleSubmit}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  selectContainer: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#293038",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#293038",
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  picker: {
    height: 56,
    color: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  dateContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  successText: {
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 12,
  },
  dateButton: {
    height: 56,
    backgroundColor: "#293038",
    borderRadius: 10,
    marginBottom: 10,
    fontWeight: "normal",
  },
});
