import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "@rneui/themed";

export default function ProfileScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <Text h2>Profile Screen</Text>
    </View>
  );
}