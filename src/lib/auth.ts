import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database.types";

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
};

export const getProfileByUserId = async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return data as Profile | null;
};

export const getProfileByHandle = async (handle: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  return data as Profile | null;
};
