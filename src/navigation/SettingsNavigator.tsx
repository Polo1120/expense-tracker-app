import React from "react";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import BudgetSettingsScreen from "../screens/Settings/BudgetSettingsScreen";
import ProfileScreen from "../screens/Settings/ProfileScreen";
import SecurityScreen from "../screens/Settings/SecurityScreen";
import { CurrencyScreen } from "../screens/Settings/CurrencyScreen";
import type { SettingsStackParamList } from "../types/navigation";
import { useTheme } from "@rneui/themed";

const Stack = createStackNavigator<SettingsStackParamList>();

export function SettingsNavigator({
  toggleTheme,
}: {
  toggleTheme: () => void;
}) {
  const { theme: currentTheme } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsMain"
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: currentTheme.colors.background },
          headerTintColor: currentTheme.colors.white,
        }}
      >
        {(props) => <SettingsScreen {...props} toggleTheme={toggleTheme} />}
      </Stack.Screen>
      <Stack.Screen
        name="BudgetSettings"
        component={BudgetSettingsScreen}
        options={{
          title: "Budget Settings",
          headerStyle: { backgroundColor: currentTheme.colors.background },
          headerTintColor: currentTheme.colors.white,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerStyle: { backgroundColor: currentTheme.colors.background },
          headerTintColor: currentTheme.colors.white,
        }}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          title: "Security",
          headerStyle: { backgroundColor: currentTheme.colors.background },
          headerTintColor: currentTheme.colors.white,
        }}
      />
      <Stack.Screen
        name="Currency"
        component={CurrencyScreen}
        options={{
          title: "Currency",
          headerStyle: { backgroundColor: currentTheme.colors.background },
          headerTintColor: currentTheme.colors.white,
        }}
      />
    </Stack.Navigator>
  );
}
