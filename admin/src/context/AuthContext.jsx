import { createContext, useContext, useEffect, useState } from "react";
import { adminApi } from "../api/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    adminApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("admin_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const data = await adminApi.login(payload);
    localStorage.setItem("admin_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
