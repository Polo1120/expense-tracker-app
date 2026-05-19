import { View, StyleSheet } from "react-native";
import React, { useState, useMemo } from "react";
import { Button, Input, Text, useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { AuthStackNavigationProp } from "../../types/navigation";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/validators";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { theme } = useTheme();
  const { signup, loading, error } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

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

    await signup(form.email, form.password, form.name);
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { marginTop: 20, paddingHorizontal: 16, width: "100%" },
        title: { marginBottom: 18 },
        generalError: {
          color: theme.colors.error,
          textAlign: "center",
          marginBottom: 10,
        },
        link: {
          marginTop: 18,
          textAlign: "center",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
        },
        linkHighlight: {
          color: theme.colors.primary,
          fontWeight: "600",
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text h2 style={styles.title}>
          Create an Account
        </Text>

        <Input
          placeholder="Full Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          errorMessage={errors.name}
        />

        <Input
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          errorMessage={errors.email}
        />

        <Input
          secureTextEntry
          placeholder="Password"
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          errorMessage={errors.password}
        />

        {error ? <Text style={styles.generalError}>{error}</Text> : null}

        <Button
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          title="Sign Up"
        />

        <Text style={styles.link} onPress={handleLogin}>
          Already have an account?{" "}
          <Text style={styles.linkHighlight}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
