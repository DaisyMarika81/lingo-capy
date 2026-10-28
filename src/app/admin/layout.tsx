"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LingoCapy } from "@/components/mascot/LingoCapy";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function checkAdminAuth() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login?redirect=/admin/dashboard");
          return;
        }

        // Fetch user profile to verify role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single<{ role: string }>();

        const role = profile?.role || (user.user_metadata?.role as string);

        if (role !== "admin" && role !== "teacher") {
          // If logged in as student or parent, redirect to their home
          if (role === "parent") {
            router.replace("/parent/dashboard");
          } else {
            router.replace("/dashboard");
          }
          return;
        }

        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin guard check error:", err);
        router.replace("/login");
      }
    }

    checkAdminAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-capy-primary border-t-transparent rounded-full animate-spin mb-4" />
        <LingoCapy size={64} mood="thinking" />
        <h2 className="font-extrabold text-xl text-ink-900 mt-4">
          Đang xác thực quyền Quản trị viên...
        </h2>
        <p className="text-xs text-ink-500 mt-1">
          Khu vực bảo mật chỉ dành cho Giáo viên và Admin của Lingo Capy.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
