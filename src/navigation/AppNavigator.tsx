import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../hooks/useAuth";
import { TabsNavigator } from "./TabsNavigator";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useAppTheme } from "../hooks/useAppTheme";
import BudgetSettingsScreen from "../screens/BudgetSettingsScreen";

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const theme = useAppTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabsNavigator} />
          <Stack.Screen
            name="BudgetSettings"
            component={BudgetSettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
