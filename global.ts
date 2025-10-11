import { createTheme } from "@rneui/themed";

declare module "@rneui/themed" {
  export interface Colors {
    bottomBar?: string;
  }
}

export const theme = createTheme({
  lightColors: {
    primary: "#4CAF50",
    background: "#FFFFFF",
    white: "#fff",
    disabled: "#CCC28F",
    bottomBar: "#f0f0f0",
  },
  darkColors: {
    primary: "#268AED",
    background: "#121417",
    bottomBar: "#293038",
    white: "#ffff",
    disabled: "#9EABBA",
  },
  mode: "dark",
  components: {
    Button: {
      containerStyle: {
        width: "100%",
      },
      titleStyle: {
        fontWeight: "bold",
      },
      buttonStyle: {
        height: 48,
        borderRadius: 12,
      },
    },
    Input: {
      containerStyle: {
        width: "100%",
        paddingHorizontal: 0,
        marginHorizontal: 0,
      },
      inputContainerStyle: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#293038",
        height: 56,
        backgroundColor: "#293038",
        paddingHorizontal: 10,
      },
      inputStyle: {
        fontSize: 16,
        color: "#fff",
      },
    },
    Text: {
      style: {
        fontSize: 14,
        textAlign: "center",
      },
      h2Style: {
        textAlign: "center",
        fontSize: 28,
      },
    },
  },
});
