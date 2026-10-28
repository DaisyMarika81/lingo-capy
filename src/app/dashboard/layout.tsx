"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LingoCapy } from "@/components/mascot/LingoCapy";

export const dynamic = "force-dynamic";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function checkStudentAuth() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.replace("/login?redirect=/dashboard");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single<{ role: string }>();

        const role = profile?.role || (user.user_metadata?.role as string);

        // If admin tries to enter student dashboard, send them back to admin studio!
        if (role === "admin" || role === "teacher") {
          router.replace("/admin/dashboard");
          return;
        }
        if (role === "parent") {
          router.replace("/parent/dashboard");
          return;
        }

        if (isMounted) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Student guard check error:", err);
        router.replace("/login");
      }
    }

    checkStudentAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setAuthorized(false);
        setLoading(true);
        window.location.href = "/login";
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-capy-primary border-t-transparent rounded-full animate-spin mb-4" />
        <LingoCapy size={64} mood="thinking" />
        <h2 className="font-extrabold text-xl text-ink-900 mt-4">
          Đang vào Góc học tập...
        </h2>
      </div>
    );
  }

  return <>{children}</>;
}
