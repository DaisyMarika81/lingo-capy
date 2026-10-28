import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { Database } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ students: [] });
    }

    const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
    }

    // Verify staff/admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();

    if (profile?.role !== "admin" && profile?.role !== "teacher") {
      return NextResponse.json({ error: "Bạn không có quyền truy cập." }, { status: 403 });
    }

    // Use Service Role to get users and profiles
    const supabaseAdmin = createAdminClient();
    const [{ data: authUsers }, { data: studentProfiles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 100 }),
      supabaseAdmin.from("profiles").select("*").eq("role", "student"),
    ]);

    const authMap = new Map((authUsers?.users || []).map((u) => [u.id, u]));

    const students = (studentProfiles || []).map((p: any) => {
      const authUser = authMap.get(p.id);
      const meta = authUser?.user_metadata || {};
      return {
        id: p.id,
        name: p.full_name || meta.full_name || authUser?.email?.split("@")[0] || "Học sinh",
        email: authUser?.email || "Chưa có email",
        grade: meta.grade || "Lớp 6",
        enrolledBook: meta.enrolledBook || "Tiếng Anh 6 - Global Success",
        progressPct: p.progress_pct || 0,
        streakDays: p.streak_days || 0,
        lastActive: p.last_active_at ? new Date(p.last_active_at).toLocaleDateString("vi-VN") : "Hôm nay",
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
