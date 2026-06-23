import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("freshcart_token") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("freshcart_user") || "");

  async function login(values) {
    const data = await api.signin(values);
    localStorage.setItem("freshcart_token", data.token);
    localStorage.setItem("freshcart_user", data.user?.name || values.email);
    setToken(data.token);
    setUserName(data.user?.name || values.email);
    return data;
  }

  async function register(values) {
    const data = await api.signup(values);
    return data;
  }

  function logout() {
    localStorage.removeItem("freshcart_token");
    localStorage.removeItem("freshcart_user");
    setToken("");
    setUserName("");
  }

  const value = useMemo(() => ({ token, userName, isAuthenticated: Boolean(token), login, register, logout }), [token, userName]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
