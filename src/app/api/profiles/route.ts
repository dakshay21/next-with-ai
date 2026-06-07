import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId } from "@/lib/auth";
import { createProfileSchema } from "@/lib/validators";

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getProfileByUserId(user.id);
  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      handle: parsed.data.handle,
      display_name: parsed.data.display_name ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Handle is already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data }, { status: 201 });
};
