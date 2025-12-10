// AuthCallback.tsx
import { useEffect } from "react";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

const AuthCallback: React.FC = () => {

  useEffect(() => {
    // Fire once on mount
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <div>Logging in...</div>;
};

export default AuthCallback;
function setUser(_user: User | null): any {
    throw new Error("Function not implemented.");
}

