"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestionRenderer } from "@/components/exercises/QuestionRenderer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SAMPLE_QUESTIONS = [
  {
    id: "q1",
    type: "mcq" as const,
    content: {
      prompt: "1. She usually ______ to the music club on Sunday mornings.",
      options: ["go", "goes", "going", "went"],
    },
  },
  {
    id: "q2",
    type: "fill_blank" as const,
    content: {
      prompt: "2. My brother [blank] swimming every afternoon. (love)",
    },
  },
  {
    id: "q3",
    type: "true_false" as const,
    content: {
      statement: "3. We use Present Simple to describe permanent truths or daily routines.",
    },
  },
  {
    id: "q4",
    type: "matching" as const,
    content: {
      left: ["Listen to", "Play", "Read"],
      right: ["books", "music", "football"],
    },
  },
  {
    id: "q5",
    type: "reorder" as const,
    content: {
      tokens: ["plays", "piano", "the", "He", "everyday."],
    },
  },
];

export default function LessonPage() {
  const [activeTab, setActiveTab] = useState<"video" | "vocab" | "grammar" | "exercises">("video");
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [gradingResults, setGradingResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, setVideoProgress] = useState(0);

  const handleAnswerChange = (questionId: string, val: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleGradeSubmission = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/exercises/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: "ex-unit-3-lesson-2",
          answers: userAnswers,
        }),
      });
      const data = await res.json();
      setGradingResults(data);
    } catch (err) {
      console.error("Grading failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar user={{ name: "Minh An", role: "student" }} />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-4 pb-16 flex flex-wrap gap-6 flex-1">
        {/* Left Column: Lesson Player, Tabs & Content */}
        <div className="flex-[2_1_560px] space-y-6">
          {/* Active Tab Content */}
          {activeTab === "video" && (
            <div>
              <VideoPlayer
                videoId="sample-lesson"
                onProgressUpdate={(pct) => setVideoProgress(pct)}
              />
            </div>
          )}

          {/* Heading */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-capy-primary bg-indigo-50 px-3 py-1 rounded-full">
              Chương trình lớp 6
            </span>
            <h1 className="text-2xl md:text-[28px] font-extrabold text-ink-900 mt-2 mb-3">
              Unit 3 · Bài 2: Present Simple (Hiện tại đơn)
            </h1>
          </div>

          {/* Tabs Bar */}
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab("video")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "video" ? "btn-pri" : "btn-white"
              }`}
            >
              Video
            </button>
            <button
              onClick={() => setActiveTab("vocab")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "vocab" ? "btn-pri" : "btn-white"
              }`}
            >
              Từ vựng
            </button>
            <button
              onClick={() => setActiveTab("grammar")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "grammar" ? "btn-pri" : "btn-white"
              }`}
            >
              Ngữ pháp
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl relative ${
                activeTab === "exercises" ? "btn-pri" : "btn-white"
              }`}
            >
              Bài tập
              {gradingResults && (
                <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {gradingResults.score}%
                </span>
              )}
            </button>
          </div>

          {/* Tab: Vocabulary */}
          {activeTab === "vocab" && (
            <Card className="space-y-4">
              <h3 className="font-bold text-xl text-ink-900">Từ vựng trọng tâm Unit 3</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { word: "Hobby", pos: "n", meaning: "Sở thích", example: "Playing chess is my favorite hobby." },
                  { word: "Collecting", pos: "n", meaning: "Sưu tầm", example: "He loves collecting stamps." },
                  { word: "Outdoor", pos: "adj", meaning: "Ngoài trời", example: "Football is an outdoor activity." },
                  { word: "Patient", pos: "adj", meaning: "Kiên nhẫn", example: "You need to be patient when making pottery." },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border-2 border-capy-border bg-white">
                    <div className="flex items-center justify-between">
                      <b className="text-lg text-capy-primary">{item.word}</b>
                      <span className="text-xs bg-gray-100 text-ink-500 font-bold px-2 py-0.5 rounded">({item.pos})</span>
                    </div>
                    <p className="text-sm font-medium text-ink-900 mt-1">{item.meaning}</p>
                    <p className="text-xs text-ink-500 italic mt-1.5">&ldquo;{item.example}&rdquo;</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tab: Grammar */}
          {activeTab === "grammar" && (
            <Card className="space-y-4">
              <h3 className="font-bold text-xl text-ink-900">Quy tắc ngữ pháp: Present Simple</h3>
              <div className="space-y-3 text-sm text-ink-900">
                <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
                  <b className="block text-capy-primary mb-1">1. Cấu trúc câu khẳng định (+)</b>
                  <p className="font-mono bg-white p-2 rounded-xl text-xs font-bold text-indigo-900 my-1">
                    S + V(s/es) + O
                  </p>
                  <p className="text-ink-500 text-xs">
                    • I / You / We / They + V-nguyên thể (Ví dụ: I play football.)<br />
                    • He / She / It / Danh từ số ít + V-s/es (Ví dụ: She plays tennis.)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE]">
                  <b className="block text-capy-primary mb-1">2. Dấu hiệu nhận biết</b>
                  <p className="text-ink-500 text-xs">
                    Trạng từ chỉ tần suất: Always, Usually, Often, Sometimes, Never, Every day/week...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Tab: Exercises */}
          {activeTab === "exercises" && (
            <Card className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#E0E7FF] pb-4">
                <div>
                  <h3 className="font-bold text-xl text-ink-900">Bài tập củng cố (Tự chấm điểm)</h3>
                  <p className="text-xs text-ink-500">Hoàn thành các câu hỏi để kiểm tra mức độ nắm vững bài học</p>
                </div>
                {gradingResults && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink-500 block">Kết quả</span>
                    <span className="text-2xl font-extrabold text-capy-primary">
                      {gradingResults.score}/100đ
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {SAMPLE_QUESTIONS.map((q) => {
                  const qResult = gradingResults?.results?.find(
                    (r: any) => r.questionId === q.id
                  );
                  return (
                    <div key={q.id} className="p-5 rounded-2xl border-2 border-capy-border bg-[#FFFDF9]">
                      <QuestionRenderer
                        question={q}
                        value={userAnswers[q.id]}
                        onChange={(val) => handleAnswerChange(q.id, val)}
                        result={qResult}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                {gradingResults ? (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setGradingResults(null);
                      setUserAnswers({});
                    }}
                  >
                    Làm lại bài này
                  </Button>
                ) : (
                  <Button
                    variant="cta"
                    size="lg"
                    disabled={submitting}
                    onClick={handleGradeSubmission}
                  >
                    {submitting ? "Đang chấm..." : "Nộp bài tự động"}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Navigation between lessons */}
          <div className="flex justify-between items-center pt-4">
            <Link href="/lessons/unit-3-lesson-1">
              <Button variant="white" size="md">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Bài trước
              </Button>
            </Link>
            <Link href="/lessons/unit-3-lesson-3">
              <Button variant="cta" size="md">
                Bài tiếp theo
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Aside: Lesson List & Notes */}
        <aside className="card-lingo flex-[1_1_300px] self-start space-y-5">
          <h3 className="font-bold text-lg text-ink-900">Danh sách bài học</h3>

          <div className="space-y-2 text-sm">
            <Link
              href="/lessons/unit-3-lesson-1"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-emerald-50 text-[#15803D] font-semibold transition-colors border border-transparent hover:border-emerald-200"
            >
              <span>✓ Bài 1 · Từ vựng</span>
              <span className="text-xs">6 phút</span>
            </Link>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EEF2FF] text-capy-primary font-bold border border-[#C7D2FE]">
              <span>▶ Bài 2 · Present Simple</span>
              <span className="text-xs">8 phút</span>
            </div>

            <Link
              href="/lessons/unit-3-lesson-3"
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-100 text-ink-500 font-medium transition-colors"
            >
              <span>Bài 3 · Luyện nói</span>
              <span className="text-xs">5 phút</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E0E7FF]">
            <label htmlFor="lesson-note" className="block text-sm font-bold text-ink-900 mb-2">
              Ghi chú của em
            </label>
            <textarea
              id="lesson-note"
              rows={4}
              placeholder="Ghi lại từ mới hoặc công thức cần nhớ..."
              className="w-full box-border border-2 border-[#C7D2FE] focus:border-capy-primary rounded-2xl p-3 font-sans text-sm focus:outline-none transition-colors"
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
