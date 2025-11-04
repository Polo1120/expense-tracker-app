import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, useTheme } from "@rneui/themed";
import HomeScreen from "../screens/Dashboard/DashboardScreen";
import AddExpenseScreen from "../screens/Expense/AddExpenseScreen";
import { SettingsNavigator } from "./SettingsNavigator";
import { RootTabParamList } from "../types";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabsNavigator({ toggleTheme }: { toggleTheme: () => void }) {
  const { theme: currentTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: currentTheme.colors.background },
        headerTintColor: currentTheme.colors.white,
        tabBarActiveTintColor: currentTheme.colors.white,
        tabBarInactiveTintColor: currentTheme.colors.disabled,
        tabBarItemStyle: { paddingVertical: 9 },
        tabBarStyle: {
          height: 70,
          backgroundColor: currentTheme.colors.bottomBar,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="material" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Icon name="add" type="material" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" type="material" color={color} size={size} />
          ),
        }}
      >
        {(props) => <SettingsNavigator {...props} toggleTheme={toggleTheme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
