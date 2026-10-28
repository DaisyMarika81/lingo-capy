"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { QuestionRenderer } from "@/components/exercises/QuestionRenderer";
import { INITIAL_MISTAKES, MistakeItem } from "@/lib/tracking/progress";
import { createClient } from "@/lib/supabase/client";
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Sparkles,
  Trophy,
  Filter,
} from "lucide-react";

export default function MistakeReviewPage() {
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePracticeIndex, setActivePracticeIndex] = useState<number | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState<any>(undefined);
  const [practiceResult, setPracticeResult] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      try {
        if (user) {
          const { data: userAttempts } = await supabase
            .from("attempts")
            .select("id")
            .eq("user_id", user.id);

          if (userAttempts && userAttempts.length > 0) {
            setMistakes([]);
          } else {
            setMistakes([]);
          }
        }
      } catch (err) {
        console.error("Error loading mistakes:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedCategory === "all") return true;
    return m.category === selectedCategory;
  });

  const masteredCount = mistakes.filter((m) => m.mastered).length;
  const progressPct = mistakes.length > 0 ? Math.round((masteredCount / mistakes.length) * 100) : 100;

  const currentPracticeItem =
    activePracticeIndex !== null ? filteredMistakes[activePracticeIndex] : null;

  const handleStartPractice = (index: number) => {
    setActivePracticeIndex(index);
    setPracticeAnswer(undefined);
    setPracticeResult(null);
    setShowCelebration(false);
  };

  const handleCheckPractice = async () => {
    if (!currentPracticeItem) return;

    try {
      const res = await fetch("/api/exercises/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: "mistake-review",
          answers: {
            [currentPracticeItem.questionId]: practiceAnswer,
          },
        }),
      });

      const data = await res.json();
      const questionGraded = data.results?.[0];

      if (questionGraded) {
        setPracticeResult(questionGraded);

        if (questionGraded.isCorrect) {
          setShowCelebration(true);
          // Mark as mastered in local state
          setMistakes((prev) =>
            prev.map((item) =>
              item.id === currentPracticeItem.id
                ? { ...item, mastered: true }
                : item
            )
          );
        }
      } else {
        // Fallback simple check
        const isCorrect = practiceAnswer === currentPracticeItem.answer.correct;
        setPracticeResult({
          isCorrect,
          correctAnswer: currentPracticeItem.answer,
          explanation: currentPracticeItem.explanation,
        });
        if (isCorrect) {
          setShowCelebration(true);
          setMistakes((prev) =>
            prev.map((item) =>
              item.id === currentPracticeItem.id
                ? { ...item, mastered: true }
                : item
            )
          );
        }
      }
    } catch {
      // Fallback
      setPracticeResult({
        isCorrect: true,
        correctAnswer: currentPracticeItem.answer,
        explanation: currentPracticeItem.explanation,
      });
      setShowCelebration(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-6 pb-20 flex-1 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-500 hover:text-capy-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Bảng điều khiển
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            <span>🛡️ Sổ tay câu sai thông minh</span>
          </div>
        </div>

        {/* Hero Card: Mistake stats & Mascot */}
        <div className="card-lingo bg-gradient-to-r from-[#4F46E5] to-[#3730A3] text-white flex flex-wrap items-center justify-between gap-6 p-6 md:p-8">
          <div className="space-y-3 flex-1 min-w-[300px]">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full">
              Khắc phục lỗ hổng kiến thức
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Phòng ôn tập & Sửa câu sai
            </h1>
            <p className="text-indigo-100 text-sm max-w-lg leading-relaxed">
              Làm lại các câu em từng chọn chưa đúng để hiểu sâu bản chất, tích lũy kinh nghiệm và giữ vững chuỗi ngày học!
            </p>

            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-xs font-bold text-indigo-100 mb-1.5">
                <span>Tiến độ khắc phục</span>
                <span>{masteredCount}/{mistakes.length} câu đã sửa</span>
              </div>
              <div className="h-3 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-capy-accent transition-all duration-300 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <LingoCapy size={100} mood={masteredCount > 0 ? "celebrating" : "thinking"} />
          </div>
        </div>

        {/* Practice Modal / Full View when a question is active */}
        {currentPracticeItem ? (
          <Card className="space-y-6 border-2 border-capy-primary/40 bg-white p-6 md:p-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E0E7FF] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-capy-primary bg-indigo-50 px-3 py-1 rounded-full">
                  {currentPracticeItem.unitTitle} · {currentPracticeItem.lessonTitle}
                </span>
                <h3 className="font-bold text-xl text-ink-900 mt-2">
                  Luyện lại câu số #{activePracticeIndex! + 1}
                </h3>
              </div>
              <Button
                variant="white"
                size="sm"
                onClick={() => setActivePracticeIndex(null)}
              >
                Đóng bài tập
              </Button>
            </div>

            {/* Question renderer */}
            <div className="p-5 rounded-2xl bg-[#FFFDF9] border-2 border-capy-border">
              <QuestionRenderer
                question={{
                  id: currentPracticeItem.questionId,
                  type: currentPracticeItem.type,
                  content: currentPracticeItem.content,
                }}
                value={practiceAnswer}
                onChange={(val) => setPracticeAnswer(val)}
                result={practiceResult}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-ink-500 font-medium">
                {currentPracticeItem.mastered ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành sửa sai câu này!
                  </span>
                ) : (
                  "Hãy đọc kỹ đề bài và chọn lại phương án chính xác"
                )}
              </span>

              <div className="flex items-center gap-3">
                {practiceResult ? (
                  <Button
                    variant="cta"
                    size="md"
                    onClick={() => {
                      // Move to next unmastered question
                      const nextIdx = filteredMistakes.findIndex(
                        (m, i) => i > activePracticeIndex! && !m.mastered
                      );
                      if (nextIdx !== -1) {
                        handleStartPractice(nextIdx);
                      } else {
                        setActivePracticeIndex(null);
                      }
                    }}
                  >
                    Câu tiếp theo →
                  </Button>
                ) : (
                  <Button
                    variant="cta"
                    size="md"
                    disabled={practiceAnswer === undefined}
                    onClick={handleCheckPractice}
                  >
                    Kiểm tra đáp án
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          /* Mistake List */
          <div className="space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                {[
                  { id: "all", label: "Tất cả câu sai" },
                  { id: "vocabulary", label: "Từ vựng (Vocabulary)" },
                  { id: "grammar", label: "Ngữ pháp (Grammar)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`btn-3d text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === tab.id
                        ? "btn-pri"
                        : "btn-white text-ink-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-ink-500">
                Tìm thấy {filteredMistakes.length} câu cần ôn lại
              </span>
            </div>

            {/* Cards List or Empty state */}
            {filteredMistakes.length === 0 ? (
              <Card className="py-12 px-6 text-center flex flex-col items-center justify-center gap-4 border-2 border-dashed border-emerald-200 bg-emerald-50/20">
                <LingoCapy size={80} mood="celebrating" />
                <div>
                  <h3 className="font-extrabold text-xl text-ink-900">
                    Sổ tay đang sạch bóng · Bạn chưa có câu sai nào! 🌟
                  </h3>
                  <p className="text-xs text-ink-500 max-w-md mx-auto mt-1">
                    Khi bạn làm bài tập trên Lingo Capy, các câu chưa đúng sẽ tự động lưu vào đây để bạn luyện lại trước kỳ thi.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
                  <Link href="/lessons/unit-1-lesson-1">
                    <Button variant="cta" size="sm">
                      Bắt đầu làm bài tập Unit 1
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMistakes(INITIAL_MISTAKES)}
                  >
                    Luyện thử 4 câu hỏi mẫu
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMistakes.map((item, idx) => (
                  <Card
                    key={item.id}
                    className={`p-5 flex flex-col justify-between transition-all hover:shadow-card-lg border-2 ${
                      item.mastered
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-capy-border bg-white"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-capy-primary bg-indigo-50 px-2.5 py-1 rounded-lg">
                          {item.unitTitle}
                        </span>
                        {item.mastered ? (
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã khắc phục
                          </span>
                        ) : (
                          <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Sai {item.wrongCount} lần
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-ink-500 font-semibold mb-1">
                          {item.lessonTitle}
                        </p>
                        <h4 className="font-bold text-ink-900 text-base leading-snug">
                          {item.prompt}
                        </h4>
                      </div>

                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-ink-700 space-y-1">
                        <p>
                          <b>💡 Lời giải ngắn gọn:</b> {item.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-500 uppercase">
                        Dạng: {item.type}
                      </span>
                      <Button
                        variant={item.mastered ? "white" : "cta"}
                        size="sm"
                        onClick={() => handleStartPractice(idx)}
                        className="gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {item.mastered ? "Luyện lại" : "Làm lại câu này"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
