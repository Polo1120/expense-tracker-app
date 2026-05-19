import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ThemeProvider } from "@rneui/themed";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import { NetworkBanner } from "./src/components/NetworkBanner";
import { AuthProvider } from "./src/context/Auth/AuthProvider";
import { CurrencyProvider } from "./src/context/Currency/CurrencyProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { theme as globalTheme } from "./global";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WelcomeScreen from "./src/screens/Welcome/WelcomeScreen";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const isConnected = useNetworkStatus();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        const seenWelcome = await AsyncStorage.getItem("hasSeenWelcomeScreen");
        const savedTheme = await AsyncStorage.getItem("themeMode");

        if (savedTheme) {
          setThemeMode(savedTheme as "light" | "dark");
        }

        if (seenWelcome) {
          setInitialRoute("App");
        } else {
          setInitialRoute("Welcome");
        }
      } catch (e) {
        console.warn(e);
        setInitialRoute("Welcome");
      } finally {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      }
    }

    prepareApp();
  }, [fontsLoaded]);

  const theme = useMemo(() => {
    const newTheme = { ...globalTheme };
    newTheme.mode = themeMode;
    return newTheme;
  }, [themeMode]);

  const navTheme = useMemo(() => {
    return themeMode === "dark"
      ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: theme.darkColors?.background || "#121417" } }
      : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.lightColors?.background || "#FFFFFF" } };
  }, [themeMode, theme]);

  const toggleTheme = async () => {
    const newThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newThemeMode);
    await AsyncStorage.setItem("themeMode", newThemeMode);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || !initialRoute) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CurrencyProvider>
            {!isConnected && <NetworkBanner />}
            <NavigationContainer theme={navTheme}>
              <Stack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{ headerShown: false, contentStyle: { backgroundColor: themeMode === "dark" ? theme.darkColors?.background : theme.lightColors?.background } }}
              >
                <Stack.Screen name="Welcome">
                  {(props) => (
                    <WelcomeScreen {...props} setThemeMode={setThemeMode} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="App">
                  {(props) => (
                    <AppNavigator {...props} toggleTheme={toggleTheme} />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}
