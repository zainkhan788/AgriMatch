import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface User {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string, location?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "@agrimatch_users";
const SESSION_KEY = "@agrimatch_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const start = Date.now();
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session) setUser(JSON.parse(session));
      } catch {}
      const elapsed = Date.now() - start;
      const minLoadingMs = 1500;
      if (elapsed < minLoadingMs) {
        await new Promise(resolve => setTimeout(resolve, minLoadingMs - elapsed));
      }
      setIsLoading(false);
    })();
  }, []);

  const getUsers = async (): Promise<Record<string, { password: string; user: User }>> => {
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    const entry = users[trimmedEmail];
    if (!entry) return { success: false, error: "No account found with this email." };
    if (entry.password !== password) return { success: false, error: "Incorrect password. Please try again." };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(entry.user));
    setUser(entry.user);
    return { success: true };
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    location?: string,
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    if (users[trimmedEmail]) return { success: false, error: "An account with this email already exists." };
    const newUser: User = {
      name: name.trim(),
      email: trimmedEmail,
      phone: phone?.trim(),
      location: location?.trim(),
      joinedAt: new Date().toISOString(),
    };
    users[trimmedEmail] = { password, user: newUser };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
