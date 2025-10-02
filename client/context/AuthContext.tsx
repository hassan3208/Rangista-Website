import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type User = { id: string; email: string; name: string } | null;

interface AuthContextValue {
  user: User;
  loading: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LS_USER_KEY = "rangista_user";
const LS_USERS_DB = "rangista_users"; // simple local db for demo

function readUsers(): Record<string, { id: string; name: string; email: string; password: string }> {
  try {
    const raw = localStorage.getItem(LS_USERS_DB);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeUsers(db: Record<string, { id: string; name: string; email: string; password: string }>) {
  localStorage.setItem(LS_USERS_DB, JSON.stringify(db));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string) => {
    const db = readUsers();
    if (db[email]) throw new Error("Account already exists");
    const newUser = { id: crypto.randomUUID(), name, email, password };
    db[email] = newUser;
    writeUsers(db);
    const publicUser = { id: newUser.id, name, email };
    localStorage.setItem(LS_USER_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
  };

  const login = async (email: string, password: string) => {
    const db = readUsers();
    const u = db[email];
    if (!u || u.password !== password) throw new Error("Invalid credentials");
    const publicUser = { id: u.id, name: u.name, email: u.email };
    localStorage.setItem(LS_USER_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
  };

  const logout = () => {
    localStorage.removeItem(LS_USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signup, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
