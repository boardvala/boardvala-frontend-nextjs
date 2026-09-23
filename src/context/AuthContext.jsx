"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    setUser({
      token,
      role: localStorage.getItem("role"),
      email: localStorage.getItem("email"),
      mobile: localStorage.getItem("mobile"),
      name: localStorage.getItem("name"),
    });
  }

  setLoading(false);
}, []);

  function login(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email || "");
    localStorage.setItem("mobile", data.mobile || "");
    localStorage.setItem("name", data.name || "");

    setUser(data);
  }

  function logout() {
    localStorage.clear();

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
