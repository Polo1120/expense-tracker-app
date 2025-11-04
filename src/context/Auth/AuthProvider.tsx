import { useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "../../lib/client";
import { AuthContext } from "./AuthContext";
import type { User } from "../../types/User";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(pb.authStore.model as User | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model as User | null);
    });

    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await pb.collection("users").authWithPassword<User>(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setLoading(true);
    setError(null);
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name,
      });
      await pb.collection("users").authWithPassword<User>(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    await AsyncStorage.removeItem("themeMode");
    await AsyncStorage.removeItem("hasSeenWelcomeScreen");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: pb.authStore.isValid,
        loading,
        error,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
