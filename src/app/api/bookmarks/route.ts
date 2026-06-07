import { NextResponse } from "next/server";
import { apiErrors } from "@/lib/messages";
import { createClient } from "@/lib/supabase/server";
import { createBookmarkSchema, formatZodError } from "@/lib/validators";

export const GET = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: apiErrors.unauthorized }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: apiErrors.serverError }, { status: 500 });
  }

  return NextResponse.json({ bookmarks: data ?? [] });
};

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: apiErrors.unauthorized }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: apiErrors.invalidJson }, { status: 400 });
  }

  const parsed = createBookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      title: parsed.data.title,
      url: parsed.data.url,
      is_public: parsed.data.is_public,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: apiErrors.serverError }, { status: 500 });
  }

  return NextResponse.json({ bookmark: data }, { status: 201 });
};
