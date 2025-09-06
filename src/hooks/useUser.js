"use client";

import { supabase } from "@/config/Subpabase.Client";
import { useState, useEffect } from "react";

function useUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return currentUser;
}

export default useUser;
