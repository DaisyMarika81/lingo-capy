import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const response = NextResponse.json({ success: true });

  // Delete all cookies related to supabase auth
  const all = cookieStore.getAll();
  all.forEach((cookie) => {
    if (cookie.name.includes("sb-") || cookie.name.includes("supabase")) {
      response.cookies.delete(cookie.name);
      cookieStore.delete(cookie.name);
    }
  });

  return response;
}
