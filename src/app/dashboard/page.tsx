"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { INITIAL_BADGES, Badge } from "@/lib/tracking/progress";
import { createClient } from "@/lib/supabase/client";
import { Flame, CheckCircle, Trophy, BookOpen, AlertCircle, ArrowRight, X } from "lucide-react";

export default function StudentDashboard() {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [userName, setUserName] = useState("bạn");
  const [streakDays, setStreakDays] = useState(0);
  const badges: Badge[] = INITIAL_BADGES;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, streak_days")
          .eq("id", user.id)
          .single<{ full_name: string; streak_days: number }>();

        if (profile?.full_name) {
          const parts = profile.full_name.trim().split(" ");
          setUserName(parts[parts.length - 1]);
        } else if (user.email) {
          setUserName(user.email.split("@")[0]);
        }
        if (profile?.streak_days !== undefined) {
          setStreakDays(profile.streak_days);
        }
      }
    });
  }, []);

  const weekStreak = [
    { day: "T2", active: streakDays >= 6 },
    { day: "T3", active: streakDays >= 5 },
    { day: "T4", active: streakDays >= 4 },
    { day: "T5", active: streakDays >= 3 },
    { day: "T6", active: streakDays >= 2 },
    { day: "T7", active: streakDays >= 1 },
    { day: "CN", active: true, today: true },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-6 pb-20 flex-1 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl md:text-[34px] font-extrabold text-ink-900 tracking-tight">
            Chào {userName}, hôm nay học gì nào?
          </h1>
          <Link href="/mistakes">
            <span className="btn-3d text-xs font-bold px-3 py-1.5 rounded-xl btn-white flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              Sổ tay 4 câu sai cần sửa
            </span>
          </Link>
        </div>

        {/* Top Row: Continue Learning Hero & Daily Streak with 7-Day Tracker */}
        <div className="flex flex-wrap gap-6">
          {/* Main Action Banner */}
          <div className="card-lingo flex-[2_1_480px] bg-capy-primary text-white flex items-center gap-6 flex-wrap relative overflow-hidden shadow-card-lg">
            <div className="shrink-0">
              <LingoCapy size={96} mood="happy" />
            </div>
            <div className="flex-[1_1_220px]">
              <p className="opacity-90 font-medium text-sm text-indigo-100">Unit 3 · Bài 2</p>
              <h2 className="text-2xl md:text-[26px] font-bold mt-1 mb-4 text-white">
                Present Simple: Sở thích
              </h2>
              <Link href="/lessons/unit-3-lesson-2">
                <Button variant="cta" size="md">
                  Tiếp tục học
                </Button>
              </Link>
            </div>
          </div>

          {/* Streak Card with 7-Day Bubble Tracker */}
          <div className="card-lingo flex-[1_1_260px] flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-ink-500 font-bold text-xs uppercase tracking-wider">Chuỗi ngày học</p>
                <span className="text-xs bg-amber-100 text-[#B45309] font-bold px-2 py-0.5 rounded-full">
                  {streakDays > 0 ? `Kỷ lục: ${streakDays} ngày` : "Khởi động ngay"}
                </span>
              </div>
              <p className="text-4xl md:text-[40px] font-extrabold text-[#B45309] my-1">
                {streakDays} ngày 🔥
              </p>
            </div>

            {/* 7-Day Calendar Dots */}
            <div className="my-2">
              <div className="flex justify-between items-center gap-1">
                {weekStreak.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-ink-500">{item.day}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        item.active
                          ? "bg-amber-400 text-ink-900 shadow-sm ring-2 ring-amber-300"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.active ? "🔥" : "·"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-ink-500 font-medium text-xs">
              Giữ vững nhé! Chỉ cần học 1 bài mỗi ngày để không ngắt chuỗi.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="flex flex-wrap gap-6">
          {/* Daily Goal */}
          <Card className="flex-[1_1_300px]">
            <h3 className="font-bold text-lg text-ink-900">Mục tiêu hôm nay</h3>
            <div className="my-4">
              <ProgressBar progress={66} height={12} />
            </div>
            <p className="text-ink-500 font-medium text-sm">10/15 phút</p>
          </Card>

          {/* Book Completion */}
          <Card className="flex-[1_1_300px]">
            <h3 className="font-bold text-lg text-ink-900">Hoàn thành sách</h3>
            <div className="my-4">
              <ProgressBar progress={38} height={12} />
            </div>
            <p className="text-ink-500 font-medium text-sm">38% · 3/8 Unit (Global Success 6)</p>
          </Card>

          {/* Badges Preview */}
          <Card
            className="flex-[1_1_300px] cursor-pointer hover:border-capy-primary transition-all"
            onClick={() => setShowBadgeModal(true)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-ink-900">Huy hiệu đạt được</h3>
              <span className="text-xs font-bold text-capy-primary hover:underline">
                Xem tất cả ({badges.filter((b) => b.unlockedAt).length}/{badges.length})
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                🏆
              </div>
              <div>
                <p className="font-bold text-sm text-ink-900">Chăm chỉ 7 ngày</p>
                <p className="text-xs text-ink-500">Mở khóa hôm nay · Click để xem bộ sưu tập</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mistake Review Callout Section */}
        <Card className="space-y-4 border-2 border-rose-100 bg-gradient-to-br from-rose-50/40 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-bold text-xl text-ink-900">Cần ôn lại (Sổ tay câu sai)</h3>
              </div>
              <p className="text-xs text-ink-500 mt-0.5">
                Ôn luyện lại các câu từng làm sai để khắc phục lỗ hổng kiến thức trước bài kiểm tra
              </p>
            </div>
            <Link href="/mistakes">
              <Button variant="cta" size="sm" className="gap-1.5 shadow-btn-accent">
                Vào phòng luyện sửa sai
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-[#E0E7FF]/70">
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <div>
                  <span className="font-bold text-ink-900 text-sm block">Unit 2 · Từ vựng: Family</span>
                  <span className="text-xs text-ink-500">My father's sister, cousin, nephew...</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <b className="text-[#B91C1C] font-bold text-sm">2 câu sai</b>
                <Link href="/mistakes">
                  <Button variant="outline" size="sm" className="min-h-[36px] px-3 text-xs">
                    Luyện lại
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <div>
                  <span className="font-bold text-ink-900 text-sm block">Unit 1 · Ngữ pháp: To be & Have</span>
                  <span className="text-xs text-ink-500">Chia động từ to be, trật tự câu khẳng định...</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <b className="text-[#B45309] font-bold text-sm">2 câu sai</b>
                <Link href="/mistakes">
                  <Button variant="outline" size="sm" className="min-h-[36px] px-3 text-xs">
                    Luyện lại
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Modal: Badges Collection Showcase */}
        {showBadgeModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 space-y-6 bg-white relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowBadgeModal(false)}
                className="absolute right-5 top-5 text-ink-500 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <LingoCapy size={48} mood="celebrating" />
                <div>
                  <h3 className="font-extrabold text-2xl text-ink-900">Bộ sưu tập huy hiệu</h3>
                  <p className="text-xs text-ink-500">Tích lũy huy hiệu qua các mốc học tập cùng Capy</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((b) => {
                  const isUnlocked = !!b.unlockedAt;
                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                        isUnlocked
                          ? "border-amber-200 bg-amber-50/40 text-ink-900"
                          : "border-gray-200 bg-gray-50/50 text-gray-400 opacity-60"
                      }`}
                    >
                      <div>
                        <span className="text-3xl block mb-2">{b.icon}</span>
                        <h4 className="font-bold text-sm">{b.title}</h4>
                        <p className="text-xs mt-1 text-ink-500">{b.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200/60 text-[11px] font-bold">
                        {isUnlocked ? (
                          <span className="text-emerald-600">✓ Đã đạt: {b.unlockedAt}</span>
                        ) : (
                          <span className="text-gray-400">🔒 Chưa mở khóa</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={() => setShowBadgeModal(false)}>
                  Đóng
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
