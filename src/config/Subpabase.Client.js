import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      persistSession: true,   // ✅ store session in localStorage
      autoRefreshToken: true, // ✅ refresh session automatically
    },
  }
);
