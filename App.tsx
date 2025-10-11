import React from "react";
import { ThemeProvider } from "@rneui/themed";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { NetworkBanner } from "./src/components/NetworkBanner";
import { AuthProvider } from "./src/context/Auth/AuthProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { theme } from "./global";

export default function App() {
  const isConnected = useNetworkStatus();

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {!isConnected && <NetworkBanner />}
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
