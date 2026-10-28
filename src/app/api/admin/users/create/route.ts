import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, grade, enrolledBook, parentName, parentPhone } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ họ tên và email học sinh." },
        { status: 400 }
      );
    }

    const tempPassword = password || `Lingo@${Math.floor(100000 + Math.random() * 900000)}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isMock = !supabaseUrl || supabaseUrl.includes("mock-project");

    if (isMock) {
      // Demo / Simulation mode
      return NextResponse.json({
        success: true,
        isMock: true,
        user: {
          id: `usr_${Date.now().toString().slice(-6)}`,
          email,
          name,
          role: "student",
          grade,
          enrolledBook,
          tempPassword,
          parentName: parentName || "Chưa cập nhật",
          parentPhone: parentPhone || "Chưa cập nhật",
          created_at: new Date().toISOString(),
        },
        message: "Tài khoản học viên đã được tạo thành công (Chế độ mô phỏng).",
      });
    }

    // Real Supabase Provisioning with Service Role
    const supabaseAdmin = createAdminClient();

    // 1. Create auth user with pre-confirmed email (student doesn't need to verify email manually)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        role: "student",
        full_name: name,
        grade,
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: `Lỗi tạo tài khoản Supabase: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 2. Ensure profile exists and set role = 'student'
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        role: "student",
        full_name: name,
        streak_days: 0,
      } as any);

    if (profileError) {
      console.warn("Profile upsert warning:", profileError.message);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        role: "student",
        grade,
        enrolledBook,
        tempPassword,
      },
      message: "Tài khoản học sinh đã được tạo và kích hoạt thành công trên Supabase!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Lỗi máy chủ khi cấp tài khoản học viên" },
      { status: 500 }
    );
  }
}
