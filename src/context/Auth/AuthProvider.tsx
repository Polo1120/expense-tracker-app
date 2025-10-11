import { useState, useEffect, type ReactNode } from "react";
import pb from "../../lib/client";
import { AuthContext } from "./AuthContext";
import type { User } from "../../types/User";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

  useEffect(() => {
    const syncAuth = () => {
      setUser(pb.authStore.model as User | null);
      setIsAuthenticated(pb.authStore.isValid);
    };

    syncAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      syncAuth();
    });

    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password: string) => {
    await pb.collection("users").authWithPassword<User>(email, password);
  };

  const signup = async (email: string, password: string, name?: string) => {
    const record = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
      name,
    });

    await pb.collection("users").authWithPassword<User>(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
