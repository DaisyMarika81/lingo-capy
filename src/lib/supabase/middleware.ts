import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const DEFAULT_SUPABASE_URL = "https://smcaqwlablyculowblyc.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY2Fxd2xhYmx5Y3Vsb3dibHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzM4MDMsImV4cCI6MjEwODc0OTgwM30.zZdH7ncZ0dV6wvytt8DZu6rDA767hS4QichkDpD26Lc";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;

  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Not logged in -> Redirect protected routes to /login
    if (!user) {
      const protectedPrefixes = ["/dashboard", "/lessons", "/mistakes", "/admin", "/parent"];
      if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // 2. User is logged in -> Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();

    const role = profile?.role || (user.user_metadata?.role as string) || "student";

    // If already logged in, redirect /login away to role-specific home
    if (pathname === "/login" || pathname === "/register") {
      if (role === "admin" || role === "teacher") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (role === "parent") {
        return NextResponse.redirect(new URL("/parent/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. STRICT ROLE ISOLATION:
    // ADMIN & TEACHER: only allowed in /admin/* (NOT allowed in /dashboard, /lessons, /parent, /mistakes)
    if (role === "admin" || role === "teacher") {
      const forbiddenForAdmin = ["/dashboard", "/lessons", "/mistakes", "/parent"];
      if (forbiddenForAdmin.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    // PARENT: only allowed in /parent/* (NOT allowed in /admin, /dashboard, /lessons, /mistakes)
    if (role === "parent") {
      const forbiddenForParent = ["/admin", "/dashboard", "/lessons", "/mistakes"];
      if (forbiddenForParent.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.redirect(new URL("/parent/dashboard", request.url));
      }
    }

    // STUDENT: only allowed in /dashboard, /lessons/*, /mistakes/* (NOT allowed in /admin, /parent)
    if (role === "student") {
      const forbiddenForStudent = ["/admin", "/parent"];
      if (forbiddenForStudent.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    // If error on protected routes, fail closed (redirect to login)
    const protectedPrefixes = ["/admin", "/dashboard", "/lessons", "/mistakes", "/parent"];
    if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }
}
