import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { StackNavigationProp } from "@react-navigation/stack";

export type RootTabParamList = {
  Dashboard: undefined;
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
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
export type SettingsStackNavigationProp =
  StackNavigationProp<SettingsStackParamList>;
