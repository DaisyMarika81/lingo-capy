"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function MistakesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login?redirect=/mistakes");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single<{ role: string }>();

        const role = profile?.role || (user.user_metadata?.role as string);

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
      } catch {
        router.replace("/login");
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-capy-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
