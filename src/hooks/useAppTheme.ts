import { useTheme } from "@rneui/themed";
import type { Colors } from "@rneui/themed";

export interface AppTheme {
  mode: "light" | "dark";
  colors: Colors;
}

export const useAppTheme = (): AppTheme => {
  const { theme } = useTheme();

  return {
    mode: theme.mode,
    colors: theme.colors,
  };
};
