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
import ServerScreen from "../screens/Settings/ServerScreen";
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
          headerTitleAlign: "center",
          title: "Settings",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      >
        {(props) => <SettingsScreen {...props} toggleTheme={toggleTheme} />}
      </Stack.Screen>
      <Stack.Screen
        name="BudgetSettings"
        component={BudgetSettingsScreen}
        options={{
          title: "Budget Settings",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          title: "Security",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      />
      <Stack.Screen
        name="Currency"
        component={CurrencyScreen}
        options={{
          title: "Currency",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      />
      <Stack.Screen
        name="ServerSettings"
        component={ServerScreen}
        options={{
          title: "Server Settings",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: currentTheme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: currentTheme.colors.grey0,
          },
          headerTintColor: currentTheme.colors.adaptiveColor,
        }}
      />
    </Stack.Navigator>
  );
}
