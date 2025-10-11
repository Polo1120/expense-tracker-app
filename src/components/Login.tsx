import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Button, Input, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { RootTabNavigationProp } from "../types/navigation";
import { isValidEmail } from "../utils/validators";

export default function Login() {
  const navigation = useNavigation<RootTabNavigationProp>();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

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

    try {
      await login(form.email, form.password);
    } catch (err: any) {
      if (err.message?.includes("Failed to authenticate")) {
        setErrors((prev) => ({
          ...prev,
          general: "Email or password is incorrect",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Something went wrong. Please try again.",
        }));
      }
    }
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
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

      {errors.general ? (
        <Text style={styles.generalError}>{errors.general}</Text>
      ) : null}

      <Button onPress={handleSubmit}>Log In</Button>

      <Text style={styles.switchText} onPress={handleSignUp}>
        Don’t have an account? <Text style={styles.link}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, paddingHorizontal: 16, width: "100%" },
  title: { marginBottom: 18 },
  generalError: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  switchText: {
    marginTop: 18,
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
