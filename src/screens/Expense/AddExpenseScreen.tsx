import React, { useState } from "react";
import { View, Platform } from "react-native";
import { Input, Button, Text, useTheme, ButtonGroup, makeStyles } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { EXPENSE_CATEGORIES } from "../../constants";
import { useExpenseForm } from "../../hooks/useExpenseForm";
import { useExpenses } from "../../context/Expenses/ExpensesContext";

export default function AddExpenseScreen() {
  const { theme } = useTheme();
  const styles = useStyles();
  const { refreshExpenses } = useExpenses();
  const {
    formData,
    errors,
    loading,
    successMessage,
    error,
    handleChange,
    handleSubmit: originalHandleSubmit,
  } = useExpenseForm();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      handleChange("date", formatted);
    }
  };

  const handleSubmit = async () => {
    await originalHandleSubmit();
    refreshExpenses(); // Trigger global refresh after adding
  };

  return (
    <View style={styles.container}>
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
          {Object.keys(EXPENSE_CATEGORIES).map((c) => (
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
            color: formData.date
              ? theme.colors.adaptiveColor
              : theme.colors.grey3,
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

      <ButtonGroup
        buttons={["Expense", "Income"]}
        selectedIndex={formData.type === "expense" ? 0 : 1}
        onPress={(i) => handleChange("type", i === 0 ? "expense" : "income")}
        containerStyle={styles.typeButtonGroup}
        innerBorderStyle={{ width: 0 }}
        buttonStyle={styles.typeButton}
        selectedButtonStyle={styles.typeButtonSelected}
        textStyle={{ color: theme.colors.grey3 }}
        selectedTextStyle={styles.typeButtonSelectedText}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <Button
        title={loading ? "Saving..." : "Save Transaction"}
        onPress={handleSubmit}
        loading={loading}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: theme.colors.background,
  },
  selectContainer: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor:
      theme.mode === "dark" ? theme.colors.grey0 : theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
  },
  picker: {
    height: 56,
    color: theme.colors.adaptiveColor,
  },
  dateContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  successText: {
    color: theme.colors.success,
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    color: theme.colors.error,
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
    backgroundColor:
      theme.mode === "dark" ? theme.colors.grey0 : theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    borderRadius: 10,
    marginBottom: 10,
  },
  typeButtonGroup: {
    borderWidth: 0,
    width: "100%",
    backgroundColor: theme.colors.grey0,
    marginBottom: 20,
    marginHorizontal: 0,
    padding: 4,
    borderRadius: 12,
  },
  typeButton: {
    backgroundColor: theme.colors.grey0,
    borderRadius: 12,
  },
  typeButtonSelected: {
    backgroundColor:
      theme.mode === "dark" ? theme.colors.black : theme.colors.white,
    borderRadius: 12,
  },
  typeButtonSelectedText: {
    color:
      theme.mode === "dark" ? theme.colors.white : theme.colors.black,
  },
}));