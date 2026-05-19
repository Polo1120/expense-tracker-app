import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { StackNavigationProp } from "@react-navigation/stack";

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type RootTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Add: undefined;
  Settings: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  BudgetSettings: undefined;
  Profile: undefined;
  Security: undefined;
  Currency: undefined;
  ServerSettings: undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
export type SettingsStackNavigationProp =
  StackNavigationProp<SettingsStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
