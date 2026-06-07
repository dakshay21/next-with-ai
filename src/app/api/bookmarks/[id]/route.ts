import { NextResponse } from "next/server";
import { apiErrors } from "@/lib/messages";
import { createClient } from "@/lib/supabase/server";
import { formatZodError, updateBookmarkSchema } from "@/lib/validators";

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
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

  const parsed = updateBookmarkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: apiErrors.noFieldsToUpdate },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: apiErrors.serverError }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: apiErrors.bookmarkNotFound },
      { status: 404 },
    );
  }

  return NextResponse.json({ bookmark: data });
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: apiErrors.unauthorized }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: apiErrors.serverError }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: apiErrors.bookmarkNotFound },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
};
