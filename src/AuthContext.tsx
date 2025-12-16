import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // redirectTo: `https://pasindu-promodh.github.io/lootbox/`,
          redirectTo: `http://localhost:5173`,
          queryParams: {
            // access_type: 'offline',
            // prompt: 'consent',
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  // const signOut = async () => {
  //   try {
  //     const { error } = await supabase.auth.signOut();
  //     if (error) throw error;
  //   } catch (error: any) {
  //     console.error("Error signing out:", error.message);
  //     throw error;
  //   }
  // };

  const signOut = async () => {
    try {
      // Even if session is null, signOut() can be called safely
      const { error } = await supabase.auth.signOut({ scope: "global" });

      if (error) {
        console.warn(
          "Sign-out attempted without valid session. Ignoring.",
          error.message
        );
      }

      // Reset local state manually
      setSession(null);
      setUser(null);
    } catch (err: any) {
      console.error("Unexpected sign-out error:", err.message);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
