import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "ethara-auth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { user: null, token: null, rememberMe: true };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/profile");
        setAuth((current) => ({ ...current, user: data.data }));
      } catch (_error) {
        localStorage.removeItem(STORAGE_KEY);
        setAuth({ user: null, token: null, rememberMe: true });
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [auth.token]);

  const persistAuth = (nextAuth) => {
    setAuth(nextAuth);

    if (nextAuth.rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(STORAGE_KEY);
    if (!auth.token && sessionAuth) {
      setAuth(JSON.parse(sessionAuth));
    }
  }, [auth.token]);

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    persistAuth(data.data);
    toast.success("Welcome back");
    return data.data;
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    persistAuth(data.data);
    toast.success("Account created");
    return data.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_error) {
      // UI should still clear stale sessions even if the server call fails.
    }

    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setAuth({ user: null, token: null, rememberMe: true });
    toast.success("Logged out");
  };

  const updateUser = (user) => {
    const next = { ...auth, user };
    setAuth(next);
    if (localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    if (sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  };

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      rememberMe: auth.rememberMe,
      isAuthenticated: Boolean(auth.token),
      loading,
      login,
      register,
      logout,
      updateUser,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
