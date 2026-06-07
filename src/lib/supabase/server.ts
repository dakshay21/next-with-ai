import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import { getSupabasePublishableKey, getSupabaseUrl } from "./env";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    },
  );
};
