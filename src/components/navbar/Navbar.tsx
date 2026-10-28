"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ShieldCheck, Users, BookOpen, AlertCircle } from "lucide-react";

interface UserProfile {
  name: string;
  role: "student" | "parent" | "teacher" | "admin";
  email?: string;
}

interface NavbarProps {
  user?: UserProfile | null;
}

export function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(initialUser || null);
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const supabase = createClient();

    // Check active session from Supabase
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single<{ role: "student" | "parent" | "teacher" | "admin"; full_name: string }>();

        const role = profile?.role || (user.user_metadata?.role as any) || "student";
        const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Người dùng";

        setCurrentUser({
          name,
          role,
          email: user.email,
        });
      } else if (!initialUser) {
        setCurrentUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single<{ role: "student" | "parent" | "teacher" | "admin"; full_name: string }>();

        setCurrentUser({
          name: profile?.full_name || session.user.email?.split("@")[0] || "Người dùng",
          role: profile?.role || "student",
          email: session.user.email,
        });
      } else if (!initialUser) {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout error:", e);
    }
    setCurrentUser(null);
    router.push("/login");
  };

  const role = currentUser?.role;

  return (
    <header className="w-full bg-[#FFFBF5]/90 backdrop-blur-sm sticky top-0 z-40 border-b border-[#E0E7FF]/60">
      <div className="max-w-[1160px] mx-auto px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
        {/* Logo & Brand */}
        <Link
          href={role === "admin" ? "/admin/dashboard" : role === "parent" ? "/parent/dashboard" : "/"}
          className="flex items-center gap-2.5 font-extrabold text-[22px] text-ink-900 group"
        >
          <div className="transform transition-transform group-hover:scale-105 group-hover:rotate-2">
            <LingoCapy size={42} />
          </div>
          <span>Lingo Capy</span>
        </Link>

        {/* Dynamic Navigation according to Role */}
        {!isAuthPage && (
          <div className="flex items-center gap-3">
            {/* 1. ADMIN & TEACHER: Only show Admin links */}
            {(role === "admin" || role === "teacher") && (
              <>
                <Link
                  href="/admin/dashboard"
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    pathname === "/admin/dashboard"
                      ? "bg-indigo-50 text-capy-primary"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  Admin Studio
                </Link>
                <Link
                  href="/admin/students"
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    pathname === "/admin/students"
                      ? "bg-indigo-50 text-capy-primary"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  Quản lý học viên
                </Link>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                  Admin
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-3d text-xs font-bold px-3 py-1.5 rounded-xl btn-white gap-1"
                  title="Đăng xuất khỏi tài khoản Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </>
            )}

            {/* 2. PARENT: Only show Parent links */}
            {role === "parent" && (
              <>
                <Link
                  href="/parent/dashboard"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-indigo-50 text-capy-primary"
                >
                  Tiến độ học của con
                </Link>
                <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-1 rounded-full">
                  Phụ huynh
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-3d text-xs font-bold px-3 py-1.5 rounded-xl btn-white gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </>
            )}

            {/* 3. STUDENT: Only show Student learning links */}
            {role === "student" && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    pathname === "/dashboard"
                      ? "bg-indigo-50 text-capy-primary"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  Góc học tập
                </Link>
                <Link
                  href="/mistakes"
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                    pathname === "/mistakes"
                      ? "bg-indigo-50 text-capy-primary"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  Sổ tay câu sai
                </Link>
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                  {currentUser?.name || "Học viên"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-3d text-xs font-bold px-3 py-1.5 rounded-xl btn-white gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </>
            )}

            {/* 4. PUBLIC (Not logged in): Show Public Landing links */}
            {!currentUser && (
              <>
                <Link
                  href="/#pricing"
                  className="text-ink-500 font-semibold px-3 py-2 hover:text-capy-primary transition-colors text-sm"
                >
                  Bảng giá
                </Link>
                <Link
                  href="/#faq"
                  className="text-ink-500 font-semibold px-3 py-2 hover:text-capy-primary transition-colors text-sm"
                >
                  Hỏi đáp
                </Link>
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
