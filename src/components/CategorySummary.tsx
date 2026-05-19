import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useCategorySummary } from "../hooks/useCategorySummary";
import { useFormatCurrency } from "../utils/useFormatCurrency";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { Icon, useTheme, makeStyles } from "@rneui/themed";

export const CategorySummary: React.FC = () => {
  const { summary, loading } = useCategorySummary();
  const formatCurrency = useFormatCurrency();
  const { theme } = useTheme();
  const styles = useStyles();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {summary.map((item) => (
        <View key={item.name} style={styles.item}>
          <View style={styles.iconContainer}>
            <Icon
              name={
                EXPENSE_CATEGORIES[item.name as keyof typeof EXPENSE_CATEGORIES]
                  ?.icon || "dots-horizontal"
              }
              type="material-community"
              color={
                theme.mode === "dark" ? theme.colors.white : theme.colors.black
              }
              size={24}
            />
          </View>
          <View>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryTotal}>{formatCurrency(item.total)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: theme.colors.grey0,
    marginRight: 15,
    padding: 14,
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: theme.mode === "dark" ? theme.colors.white : theme.colors.black,
  },
  categoryTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.grey3,
  },
  loadingContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
}));
