import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export const middleware = async (request: NextRequest) =>
  updateSession(request);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/auth/:path*",
    "/api/bookmarks/:path*",
    "/api/profiles/:path*",
  ],
};
