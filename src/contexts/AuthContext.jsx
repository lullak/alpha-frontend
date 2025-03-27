import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const apiEndpoint = "https://localhost/api/auth";
  const defaultValues = {
    accessToken: null,
    role: "admin",
    isAuthenticated: true,
    loading: false,
  };
  const [auth, setAuth] = useState(defaultValues);

  const fetchAuthData = async () => {
    setAuth({ ...defaultValues, loading: false });

    try {
      const res = await fetch(apiEndpoint);

      if (res.ok) {
        const data = await response.json();
        setAuth({
          accessToken: data.accessToken,
          role: data.role,
          isAuthenticated: true,
          loading: false,
        });
      }
    } catch (error) {
      setAuth(defaultValues);
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};
