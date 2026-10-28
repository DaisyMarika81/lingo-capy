"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  user?: {
    name: string;
    role: "student" | "parent" | "teacher" | "admin";
  } | null;
}

export function Navbar({ user = { name: "Minh An", role: "student" } }: NavbarProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="w-full bg-[#FFFBF5]/90 backdrop-blur-sm sticky top-0 z-40 border-b border-[#E0E7FF]/60">
      <div className="max-w-[1160px] mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[22px] text-ink-900 group">
          <div className="transform transition-transform group-hover:scale-105 group-hover:rotate-2">
            <LingoCapy size={44} />
          </div>
          <span>Lingo Capy</span>
        </Link>

        {/* Navigation links & User actions */}
        {!isAuthPage && (
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-ink-500 font-semibold px-3 py-2 hover:text-capy-primary transition-colors text-[15px]"
            >
              Bảng giá
            </Link>
            <Link
              href="/parent/dashboard"
              className="text-ink-500 font-semibold px-3 py-2 hover:text-capy-primary transition-colors text-[15px]"
            >
              Phụ huynh
            </Link>
            <Link
              href="/faq"
              className="text-ink-500 font-semibold px-3 py-2 hover:text-capy-primary transition-colors text-[15px]"
            >
              Hỏi đáp
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    {user.name}
                  </Button>
                </Link>
                {user.role === "admin" && (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/admin/students"
                      className="text-xs font-bold text-capy-primary hover:underline px-2 hidden sm:inline-block"
                    >
                      Học viên
                    </Link>
                    <Link href="/admin/dashboard">
                      <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                        Admin Studio
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
