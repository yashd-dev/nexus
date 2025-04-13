"use client";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user from session storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
      if (error) throw error;

      if (data.password_hash !== password) {
        throw new Error("Invalid credentials");
      }

      sessionStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return { error: null };
    } catch (error) {
      return { error: error.message || "Login failed" };
    }
  };

  const signUp = async (userData) => {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          name: userData.name,
          email: userData.email,
          password_hash: userData.password,
          role: userData.role,
        })
        .select()
        .single();
      if (userError) throw userError;

      if (userData.role === "teacher") {
        const { error: teacherError } = await supabase
          .from("teachers")
          .insert({ user_id: user.id, is_available: true });
        if (teacherError) throw teacherError;
      } else if (userData.role === "student") {
        const { error: studentError } = await supabase
          .from("students")
          .insert({ user_id: user.id, semester_id: userData.semester_id });
        if (studentError) throw studentError;
      }

      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return { error: null, user };
    } catch (error) {
      return { error: error.message || "Registration failed", user: null };
    }
  };

  const signOut = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/access-account");
  };

  const updateUser = async (userData) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          email: userData.email,
        })
        .eq("id", user.id);
      if (error) throw error;

      if (userData.role === "teacher" && userData.is_available !== undefined) {
        const { error: teacherError } = await supabase
          .from("teachers")
          .update({ is_available: userData.is_available })
          .eq("user_id", user.id);
        if (teacherError) throw teacherError;
      }

      const updatedUser = { ...user, ...userData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { error: null };
    } catch (error) {
      return { error: error.message || "Update failed" };
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
