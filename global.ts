import { createTheme } from "@rneui/themed";

declare module "@rneui/themed" {
  export interface Colors {
    bottomBar?: string;
  }
}

export const theme = createTheme({
  lightColors: {
    primary: "#268AED",
    secondary: "#FFC107",
    background: "#FFFFFF",
    white: "#FFFFFF",
    black: "#000000",
    grey0: "#DBE0E5",
    grey1: "#E8E8E8",
    grey2: "#C8C8C8",
    grey3: "#9EABBA",
    grey4: "#888888",
    disabled: "#D3D3D3",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
    bottomBar: "#f0f0f0",
  },
  darkColors: {
    primary: "#268AED",
    secondary: "#FFC107",
    background: "#121417",
    white: "#FFFFFF",
    black: "#000000",
    grey0: "#293038",
    grey1: "#2A2A2A",
    grey2: "#3A3A3A",
    grey3: "#9EABBA",
    grey4: "#3B4754",
    disabled: "#9EABBA",
    error: "#FF5252",
    success: "#4CAF50",
    warning: "#FF9800",
    bottomBar: "#293038",
  },
  mode: "dark",
  components: {
    Button: {
      containerStyle: {
        width: "100%",
      },
      titleStyle: {
        fontFamily: "Inter-Bold",
      },
      buttonStyle: {
        height: 48,
        borderRadius: 12,
      },
    },
    Input: (props, theme) => ({
      containerStyle: {
        width: "100%",
        paddingHorizontal: 0,
        marginHorizontal: 0,
      },
      inputContainerStyle: {
        borderWidth: 1,
        borderRadius: 8,
        height: 56,
        paddingHorizontal: 10,
        backgroundColor: theme.mode === "dark" ? "#293038" : "transparent",
        borderColor: theme.mode === "dark" ? "#293038" : "#CFDBE8",
      },
      inputStyle: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
      },
    }),
    Text: {
      style: {
        fontSize: 14,
        textAlign: "center",
        color: "#fff",
        fontFamily: "Inter-Regular",
      },
      h1Style: {
        fontFamily: "Inter-Bold",
      },
      h2Style: {
        textAlign: "center",
        fontSize: 28,
        fontFamily: "Inter-Bold",
      },
      h3Style: {
        fontFamily: "Inter-Bold",
        fontSize: 22,
      },
      h4Style: {
        fontFamily: "Inter-Bold",
      },
    },
  },
});
