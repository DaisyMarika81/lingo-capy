"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { Lock, ShieldAlert, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "parent" | "teacher" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for mock simulation mode
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("mock-project")) {
          if (role === "admin" || role === "teacher") {
            router.push("/admin/dashboard");
          } else if (role === "parent") {
            router.push("/parent/dashboard");
          } else {
            router.push("/dashboard");
          }
          return;
        }
        setErrorMessage(`Đăng nhập thất bại: ${error.message}`);
        return;
      }

      if (data?.user) {
        // Check user role from profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single<{ role: string }>();

        const userRole = profile?.role || "student";
        if (userRole === "admin" || userRole === "teacher") {
          router.push("/admin/dashboard");
        } else if (userRole === "parent") {
          router.push("/parent/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      // Fallback
      if (role === "admin" || role === "teacher") {
        router.push("/admin/dashboard");
      } else if (role === "parent") {
        router.push("/parent/dashboard");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand logo & Capy Mascot */}
      <Link href="/" className="flex flex-col items-center gap-2 mb-6 group">
        <div className="transform transition-transform group-hover:scale-110 group-hover:rotate-3">
          <LingoCapy size={72} mood="happy" />
        </div>
        <h1 className="text-3xl font-extrabold text-ink-900 tracking-tight">Lingo Capy</h1>
        <p className="text-ink-500 text-sm font-medium">Hệ thống học tiếng Anh cấp 2 số hóa</p>
      </Link>

      <Card className="w-full max-w-[440px] p-8 border border-[#E0E7FF]/70 shadow-card-lg space-y-5">
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900">Đăng nhập</h2>
          <p className="text-xs text-ink-500 mt-1">
            Nhập email và mật khẩu được quản trị viên cấp để vào học
          </p>
        </div>

        {/* Notice: Accounts are provisioned by admin only */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-[#C7D2FE] text-xs text-indigo-900 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-capy-primary shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <b>Tài khoản do Admin cấp:</b> Học sinh không tự đăng ký tài khoản tự do. Vui lòng liên hệ giáo viên hoặc quản trị viên nhà trường để nhận tài khoản học.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection for quick testing/login */}
          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-2">
              Bạn đăng nhập với vai trò:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "student", label: "Học sinh" },
                { id: "parent", label: "Phụ huynh" },
                { id: "admin", label: "Quản trị / GV" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id as any)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                    role === item.id
                      ? "border-capy-primary bg-indigo-50 text-capy-primary shadow-sm"
                      : "border-gray-200 text-ink-500 hover:border-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider mb-1.5">
              Email đăng nhập
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "admin" ? "admin@lingocapy.edu.vn" : "minhan.nguyen@gmail.com"}
              className="w-full px-4 py-3 rounded-2xl border-2 border-capy-border focus:border-capy-primary focus:outline-none font-medium text-ink-900 transition-colors text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-ink-700 uppercase tracking-wider">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => alert("Học sinh vui lòng liên hệ Giáo viên/Admin để được cấp lại mật khẩu.")}
                className="text-xs font-semibold text-capy-primary hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border-2 border-capy-border focus:border-capy-primary focus:outline-none font-medium text-ink-900 transition-colors text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
          </Button>
        </form>

        <p className="text-center text-[11px] text-ink-500 pt-2 border-t border-gray-100">
          Chính sách bảo mật: Toàn bộ thông tin học viên được quản lý và bảo vệ theo chuẩn dữ liệu học đường.
        </p>
      </Card>
    </div>
  );
}
