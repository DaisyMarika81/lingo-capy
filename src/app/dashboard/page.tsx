"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Trophy, AlertCircle, ArrowRight, X } from "lucide-react";

interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progressText?: string;
}

export default function StudentDashboard() {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [userName, setUserName] = useState("bạn");
  const [streakDays, setStreakDays] = useState(0);
  const [enrolledBook, setEnrolledBook] = useState("Tiếng Anh 6 - Global Success");
  const [mistakesList, setMistakesList] = useState<any[]>([]);
  const [bookProgressPct, setBookProgressPct] = useState(0);

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

        const meta = user.user_metadata || {};
        if (meta.enrolledBook) setEnrolledBook(meta.enrolledBook);

        // Fetch real mistakes for this user
        const { data: userAttempts } = await supabase
          .from("attempts")
          .select("id")
          .eq("user_id", user.id);

        if (userAttempts && userAttempts.length > 0) {
          const attemptIds = userAttempts.map((a: any) => a.id);
          const { data: wrongAnswers } = await supabase
            .from("attempt_answers")
            .select("question_id, is_correct")
            .in("attempt_id", attemptIds)
            .eq("is_correct", false);

          if (wrongAnswers && wrongAnswers.length > 0) {
            setMistakesList(wrongAnswers);
          }
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
    { day: "CN", active: streakDays > 0, today: true },
  ];

  // Dynamic Badges based on real user achievements
  const badges: UserBadge[] = [
    {
      id: "badge-rookie",
      title: "Tân binh Capy",
      description: "Đăng nhập và bắt đầu lộ trình học",
      icon: "🌱",
      unlockedAt: "Đã mở khóa",
    },
    {
      id: "badge-streak-7",
      title: "Chăm chỉ 7 ngày",
      description: "Học liên tục 7 ngày không gián đoạn",
      icon: "🔥",
      unlockedAt: streakDays >= 7 ? "Đã mở khóa" : null,
      progressText: `${streakDays}/7 ngày`,
    },
    {
      id: "badge-perfect-1",
      title: "Điểm 100 tuyệt đối",
      description: "Đạt 100/100 điểm ở bài tập bất kỳ",
      icon: "🌟",
      unlockedAt: null,
      progressText: "Chưa hoàn thành",
    },
    {
      id: "badge-mistake-solver",
      title: "Chiến binh sửa sai",
      description: "Làm đúng lại các câu trong sổ tay",
      icon: "🛡️",
      unlockedAt: null,
      progressText: "0 câu đã sửa",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlockedAt).length;
  const featuredBadge = badges[0]; // Tan binh Capy

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
              {mistakesList.length > 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  Sổ tay {mistakesList.length} câu sai cần sửa
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Sổ tay: Chưa có câu sai
                </>
              )}
            </span>
          </Link>
        </div>

        {/* Top Row: Continue Learning Hero & Daily Streak with 7-Day Tracker */}
        <div className="flex flex-wrap gap-6">
          {/* Main Action Banner */}
          <div className="rounded-3xl p-6 md:p-8 flex-[2_1_480px] bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center gap-6 flex-wrap relative overflow-hidden shadow-card-lg">
            <div className="shrink-0">
              <LingoCapy size={96} mood="happy" />
            </div>
            <div className="flex-[1_1_220px]">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 backdrop-blur-sm">
                {enrolledBook}
              </span>
              <h2 className="text-2xl md:text-[26px] font-bold mb-4 text-white">
                Unit 1 · Bài 1: My New School
              </h2>
              <Link href="/lessons/unit-1-lesson-1">
                <Button variant="cta" size="md">
                  {streakDays > 0 ? "Tiếp tục học" : "Bắt đầu học ngay"}
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
              {streakDays > 0
                ? "Giữ vững nhé! Chỉ cần học 1 bài mỗi ngày để không ngắt chuỗi."
                : "Học 1 bài hôm nay để bắt đầu chuỗi ngọn lửa đầu tiên!"}
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="flex flex-wrap gap-6">
          {/* Daily Goal */}
          <Card className="flex-[1_1_300px]">
            <h3 className="font-bold text-lg text-ink-900">Mục tiêu hôm nay</h3>
            <div className="my-4">
              <ProgressBar progress={streakDays > 0 ? 100 : 0} height={12} />
            </div>
            <p className="text-ink-500 font-medium text-sm">
              {streakDays > 0 ? "15/15 phút · Đã hoàn thành mục tiêu hôm nay! ✓" : "0/15 phút · Học tối thiểu 15 phút mỗi ngày"}
            </p>
          </Card>

          {/* Book Completion */}
          <Card className="flex-[1_1_300px]">
            <h3 className="font-bold text-lg text-ink-900">Hoàn thành sách</h3>
            <div className="my-4">
              <ProgressBar progress={bookProgressPct} height={12} />
            </div>
            <p className="text-ink-500 font-medium text-sm">
              {bookProgressPct}% · {enrolledBook}
            </p>
          </Card>

          {/* Badges Preview */}
          <Card
            className="flex-[1_1_300px] cursor-pointer hover:border-capy-primary transition-all"
            onClick={() => setShowBadgeModal(true)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-ink-900">Huy hiệu đạt được</h3>
              <span className="text-xs font-bold text-capy-primary hover:underline">
                Xem tất cả ({unlockedCount}/{badges.length})
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-200 shadow-sm">
                {featuredBadge.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-ink-900">{featuredBadge.title}</p>
                <p className="text-xs text-ink-500">
                  {featuredBadge.unlockedAt ? `Đã mở khóa · ${featuredBadge.description}` : "Chưa mở khóa"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mistake Review Callout Section */}
        <Card className="space-y-4 border-2 border-rose-100 bg-gradient-to-br from-rose-50/40 to-white">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${mistakesList.length > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                <h3 className="font-bold text-xl text-ink-900">Sổ tay câu sai</h3>
              </div>
              <p className="text-xs text-ink-500 mt-0.5">
                {mistakesList.length > 0
                  ? "Ôn luyện lại các câu từng làm sai để khắc phục lỗ hổng kiến thức trước bài kiểm tra"
                  : "Nơi tự động lưu lại các câu bạn từng làm sai trong quá trình làm bài tập để ôn luyện lại"}
              </p>
            </div>
            {mistakesList.length > 0 && (
              <Link href="/mistakes">
                <Button variant="cta" size="sm" className="gap-1.5 shadow-btn-accent">
                  Vào phòng luyện sửa sai
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {mistakesList.length === 0 ? (
            <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2.5">
              <LingoCapy size={64} mood="celebrating" />
              <p className="font-extrabold text-base text-ink-900">
                Sổ tay đang trống · Bạn chưa có câu sai nào! 🌟
              </p>
              <p className="text-xs text-ink-500 max-w-md">
                Khi bạn làm bài tập trên Lingo Capy, mọi câu trả lời chưa chính xác sẽ tự động được ghi nhận tại đây để giúp bạn ôn tập trước khi thi.
              </p>
              <Link href="/lessons/unit-1-lesson-1" className="mt-2">
                <Button variant="cta" size="sm">
                  Làm bài tập Unit 1 ngay
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E0E7FF]/70">
              {mistakesList.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <div>
                      <span className="font-bold text-ink-900 text-sm block">
                        {m.title || `Câu hỏi cần ôn tập #${idx + 1}`}
                      </span>
                      <span className="text-xs text-ink-500">
                        {m.prompt || "Bấm luyện lại để làm lại câu này"}
                      </span>
                    </div>
                  </div>
                  <Link href="/mistakes">
                    <Button variant="outline" size="sm" className="min-h-[36px] px-3 text-xs">
                      Luyện lại
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
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
                          : "border-gray-200 bg-gray-50/40 text-gray-400 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{b.icon}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isUnlocked
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {isUnlocked ? "Đã đạt" : "Chưa đạt"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="font-bold text-xs text-ink-900">{b.title}</p>
                        <p className="text-[10px] text-ink-500 mt-0.5">{b.description}</p>
                        {b.progressText && !isUnlocked && (
                          <p className="text-[10px] font-semibold text-capy-primary mt-1">
                            Tiến độ: {b.progressText}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
