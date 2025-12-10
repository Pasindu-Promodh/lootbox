// import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
// import { supabase } from "./supabase";
// import type { User } from "@supabase/supabase-js";

// interface AuthContextType {
//   user: User | null;
//   signInWithGoogle: () => void;
//   signOut: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   signInWithGoogle: () => {},
//   signOut: () => {},
// });

// interface ProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: ProviderProps) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Load active session
//     supabase.auth.getSession().then(({ data }) => {
//       setUser(data.session?.user ?? null);
//     });

//     // Listen for auth changes
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   const signInWithGoogle = () => {
//     supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: { redirectTo: window.location.origin } // Supabase will redirect back to your site
//     });
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from './supabase';
// import type { Session, User } from '@supabase/supabase-js';

// interface AuthContextType {
//   session: Session | null;
//   user: User | null;
//   loading: boolean;
//   signIn: () => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signIn = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: `${window.location.origin}/`,
//           queryParams: {
//             access_type: 'offline',
//             prompt: 'consent',
//           },
//         },
//       });

//       if (error) throw error;
//     } catch (error: any) {
//       console.error('Error signing in:', error.message);
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//     } catch (error: any) {
//       console.error('Error signing out:', error.message);
//       throw error;
//     }
//   };

//   const value = {
//     session,
//     user,
//     loading,
//     signIn,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        provider: 'google',
        options: {
          redirectTo: `https://pasindu-promodh.github.io/lootbox/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      throw error;
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};