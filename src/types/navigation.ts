import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type RootTabParamList = {
  Dashboard: undefined;
  Setting: undefined;
  Profile: undefined;
  SignUp: undefined;
  Login: undefined;
  Add: undefined;
  BudgetSettings: undefined;
};

export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
