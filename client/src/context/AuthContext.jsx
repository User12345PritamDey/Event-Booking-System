import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Register User
  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  };

  // Login User
  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    // If account is not verified
    if (res.data.needsVerification) {
      return res.data;
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));

    setUser(res.data);

    return res.data;
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    const res = await api.post("/auth/verify-otp", {
      email,
      otp,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data));

    setUser(res.data);

    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);