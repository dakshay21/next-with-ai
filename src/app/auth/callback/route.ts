import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/auth";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profile = await getProfileByUserId(user.id);
        const redirectPath = profile ? "/dashboard" : "/onboarding";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
};
