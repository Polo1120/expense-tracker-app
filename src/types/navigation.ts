import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { StackNavigationProp } from "@react-navigation/stack";

export type RootTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Add: undefined;
  Settings: undefined;
  SignUp: undefined;
  Login: undefined;
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
