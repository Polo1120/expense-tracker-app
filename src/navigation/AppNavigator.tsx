import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../hooks/useAuth";
import { TabsNavigator } from "./TabsNavigator";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import { View, ActivityIndicator } from "react-native";

const Stack = createStackNavigator();

export function AppNavigator({ toggleTheme }: { toggleTheme: () => void }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Tabs" : "Login"}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Tabs" >
          {(props) => <TabsNavigator {...props} toggleTheme={toggleTheme} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
