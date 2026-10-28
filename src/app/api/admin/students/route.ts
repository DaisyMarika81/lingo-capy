import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { Database } from "@/types/database";

export const dynamic = "force-dynamic";

const DEFAULT_SUPABASE_URL = "https://smcaqwlablyculowblyc.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY2Fxd2xhYmx5Y3Vsb3dibHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzM4MDMsImV4cCI6MjEwODc0OTgwM30.zZdH7ncZ0dV6wvytt8DZu6rDA767hS4QichkDpD26Lc";

export async function GET(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
    const cookieStore = cookies();

    const supabaseAdmin = createAdminClient();

    // 1. Authenticate user via Authorization Header or Session Cookie
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const { data: authData } = await supabaseAdmin.auth.getUser(token);
      if (authData?.user) {
        userId = authData.user.id;
      }
    }

    if (!userId) {
      const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      });
      const { data: sessionData } = await supabase.auth.getUser();
      if (sessionData?.user) {
        userId = sessionData.user.id;
      }
    }

    // Verify staff/admin role if user is found
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single<{ role: string }>();

      if (profile && profile.role !== "admin" && profile.role !== "teacher") {
        return NextResponse.json({ error: "Bạn không có quyền truy cập." }, { status: 403 });
      }
    }

    // 2. Fetch all users from Supabase Auth & Profiles
    const [{ data: authUsers }, { data: studentProfiles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("profiles").select("*").eq("role", "student"),
    ]);

    const profileMap = new Map((studentProfiles || []).map((p: any) => [p.id, p]));
    const studentAuthUsers = (authUsers?.users || []).filter(
      (u) => u.user_metadata?.role === "student" || profileMap.has(u.id)
    );

    const students = studentAuthUsers.map((authUser) => {
      const p = profileMap.get(authUser.id);
      const meta = authUser.user_metadata || {};
      return {
        id: authUser.id,
        name: p?.full_name || meta.full_name || authUser.email?.split("@")[0] || "Học sinh",
        email: authUser.email || "Chưa có email",
        grade: meta.grade || "Lớp 6",
        enrolledBook: meta.enrolledBook || "Tiếng Anh 6 - Global Success",
        progressPct: p?.progress_pct || 0,
        streakDays: p?.streak_days || 0,
        lastActive: p?.last_active_at ? new Date(p.last_active_at).toLocaleDateString("vi-VN") : "Hôm nay",
        parentName: meta.parentName || "Chưa cập nhật",
        parentPhone: meta.parentPhone || "Chưa cập nhật",
        status: "active" as const,
      };
    });

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: error?.message || "Lỗi máy chủ khi lấy danh sách học viên." },
      { status: 500 }
    );
  }
}
