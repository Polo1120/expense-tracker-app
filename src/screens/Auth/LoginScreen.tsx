import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Button, Input, Text, useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { AuthStackNavigationProp } from "../../types/navigation";
import { isValidEmail } from "../../utils/validators";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { theme } = useTheme();

  const { login, loading, error } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await login(form.email, form.password);
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginTop: 20,
          paddingHorizontal: 16,
          width: "100%",
        },
        title: { marginBottom: 18 },
        generalError: {
          color: theme.colors.error,
          textAlign: "center",
          marginBottom: 10,
        },
        switchText: {
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          marginTop: 18,
          textAlign: "center",
        },
        link: {
          color: theme.colors.primary,
          fontWeight: "600",
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.container]}>
        <Text h2 style={styles.title}>
          Welcome back
        </Text>

        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          errorMessage={errors.email}
        />

        <Input
          secureTextEntry={true}
          placeholder="Password"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          errorMessage={errors.password}
        />

        {error ? <Text style={styles.generalError}>{error}</Text> : null}

        <Button title="Log In" onPress={handleSubmit} loading={loading} />

        <Text style={styles.switchText} onPress={handleSignUp}>
          Don’t have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
