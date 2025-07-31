



"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authAPI } from "@/lib/api";
import { toast } from "sonner";
import { setCookies, getCookie, removeCookies } from "cookies-next";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    age: number
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "access_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ინიციალიზაცია: ტოკენის შემოწმება და მომხმარებლის ჩატვირთვა
  useEffect(() => {
    const initAuth = async () => {
      const token = getCookie(TOKEN_KEY);
      if (token) {
        try {
          const response = await authAPI.me();
          setUser(response.data);
        } catch (error) {
          removeCookies(TOKEN_KEY);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

 
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      setCookies(TOKEN_KEY, token, {
        maxAge: 60 * 60, 
        path: "/",
      });

      setUser(userData);
      toast.success("sucsessfully logged in");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "error logging in");
      throw error;
    }
  };



 
  const logout = () => {
    removeCookies(TOKEN_KEY);
    setUser(null);
    toast.success("logged out successfully");
  };

  const register = async (fullName: string, email: string, password: string, age: number) => {
   
    await authAPI.register({ fullName, email, password, age });
   
  };
  

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};