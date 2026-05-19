import { useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "./AuthContext";
import type { User } from "../../types/User";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to map Supabase user to our User type
  const mapUser = (sessionUser: SupabaseUser | null): User | null => {
    if (!sessionUser) return null;
    return {
      id: sessionUser.id,
      email: sessionUser.email || "",
      name: sessionUser.user_metadata?.name || "",
      avatar: sessionUser.user_metadata?.avatar || "",
      created: sessionUser.created_at,
      updated: sessionUser.updated_at || sessionUser.created_at,
    };
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapUser(session.user));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("Error checking session", e);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session?.user) {
        setUser(mapUser(session.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (authError) throw authError;
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
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      if (authError) throw authError;
      // If auto-confirm is off, user might not be logged in immediately depending on settings
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("themeMode"); // Keep valid cleanup
    // await AsyncStorage.removeItem("hasSeenWelcomeScreen"); // Maybe keep this?
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
