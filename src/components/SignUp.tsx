import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Input, Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { RootTabNavigationProp } from "../types/navigation";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../utils/validators";

export default function SignUp() {
  const navigation = useNavigation<RootTabNavigationProp>();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", general: "" };

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

    try {
      setLoading(true);
      await signup(form.email, form.password);
      navigation.navigate("Login");
    } catch (err: any) {
      if (err.message?.includes("Duplicate")) {
        setErrors((prev) => ({
          ...prev,
          general: "This email address is already registered",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Something went wrong. Please try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
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

      {errors.general ? (
        <Text style={styles.generalError}>{errors.general}</Text>
      ) : null}

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
  link: { marginTop: 18, textAlign: "center" },
  linkHighlight: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
