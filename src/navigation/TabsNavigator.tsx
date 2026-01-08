import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon, useTheme } from "@rneui/themed";
import HomeScreen from "../screens/Dashboard/DashboardScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import AddExpenseScreen from "../screens/Expense/AddExpenseScreen";
import { SettingsNavigator } from "./SettingsNavigator";
import { RootTabParamList } from "../types";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabsNavigator({ toggleTheme }: { toggleTheme: () => void }) {
  const { theme: currentTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: currentTheme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.colors.grey0,
        },
        headerTintColor: currentTheme.colors.adaptiveColor,
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
          tabBarInactiveTintColor: currentTheme.colors.grey3,
          tabBarActiveTintColor: currentTheme.colors.adaptiveColor,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="material" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarInactiveTintColor: currentTheme.colors.grey3,
          tabBarActiveTintColor: currentTheme.colors.adaptiveColor,
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" type="material" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          title: "Add",

          tabBarInactiveTintColor: currentTheme.colors.grey3,
          tabBarActiveTintColor: currentTheme.colors.adaptiveColor,
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
          tabBarInactiveTintColor: currentTheme.colors.grey3,
          tabBarActiveTintColor: currentTheme.colors.adaptiveColor,
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
