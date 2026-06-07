import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
) => {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("handle, display_name, created_at, id")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (bookmarksError) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile: {
      handle: profile.handle,
      display_name: profile.display_name,
      created_at: profile.created_at,
    },
    bookmarks: bookmarks ?? [],
  });
};
