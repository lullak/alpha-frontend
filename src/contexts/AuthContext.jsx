import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const storeToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storeToken) setToken(storeToken);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signUp = async (formData) => {
    try {
      const res = await fetch("https://localhost:7030/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "Sign up failed");
        return false;
      }

      return true;
    } catch {
      setErrorMessage("Try again.");
      return false;
    }
  };

  const signIn = async (email, password, isPersistent = false) => {
    try {
      const res = await fetch("https://localhost:7030/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({ email, password, isPersistent }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error);
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      return true;
    } catch {
      setErrorMessage("Invalid email or password");
      return false;
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const authFetch = async (url, options = {}) => {
    const headers = options.headers ? { ...options.headers } : {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    headers["X-API-KEY"] = import.meta.env.VITE_X_API_KEY;
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{ loading, token, user, signUp, signIn, signOut, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
