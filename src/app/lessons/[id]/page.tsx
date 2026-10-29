"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestionRenderer } from "@/components/exercises/QuestionRenderer";
import { ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Volume2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getLessonById,
  getLessonsForUnit,
  getAdjacentLessons,
  LessonData,
} from "@/lib/curriculum/curriculumData";

export default function LessonPage() {
  const params = useParams();
  const rawId = typeof params?.id === "string" ? params.id : "unit-1-lesson-1";
  const lessonId = decodeURIComponent(rawId);

  // Lesson curriculum data
  const lesson: LessonData = getLessonById(lessonId);
  const { prevLesson, nextLesson, currentUnit } = getAdjacentLessons(lesson.id);
  const unitLessons = getLessonsForUnit(lesson.unitId);

  // State
  const [activeTab, setActiveTab] = useState<"video" | "vocab" | "grammar" | "exercises">("video");
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [gradingResults, setGradingResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [lessonNote, setLessonNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  // Current logged in student info
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: "student" | "parent" | "teacher" | "admin";
    grade: string;
    email?: string;
  } | null>(null);

  // Video URL override from Admin settings (if configured)
  const [videoUrl, setVideoUrl] = useState<string>(lesson.defaultVideoUrl);

  // Load user and check admin video overrides
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Học viên";
        const grade = user.user_metadata?.grade || "Lớp 6";
        const role = user.user_metadata?.role || "student";
        setCurrentUser({ name, grade, role, email: user.email });
      }
    });

    // Check localStorage for admin-assigned video for this unit/lesson
    try {
      const adminUnitVideo = localStorage.getItem(`lingo_admin_video_${lesson.unitId}`);
      const adminLessonVideo = localStorage.getItem(`lingo_admin_video_${lesson.id}`);
      if (adminLessonVideo) {
        setVideoUrl(adminLessonVideo);
      } else if (adminUnitVideo) {
        setVideoUrl(adminUnitVideo);
      } else {
        setVideoUrl(lesson.defaultVideoUrl);
      }
    } catch (e) {
      setVideoUrl(lesson.defaultVideoUrl);
    }

    // Load saved personal note
    try {
      const saved = localStorage.getItem(`lingo_notes_${lesson.id}`);
      if (saved) setLessonNote(saved);
      else setLessonNote("");
    } catch (e) {
      // ignore
    }

    // Reset grading when switching lessons
    setGradingResults(null);
    setUserAnswers({});
  }, [lesson.id, lesson.unitId, lesson.defaultVideoUrl]);

  // Handle note change with autosave
  const handleNoteChange = (text: string) => {
    setLessonNote(text);
    try {
      localStorage.setItem(`lingo_notes_${lesson.id}`, text);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (e) {
      // ignore
    }
  };

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
          exerciseId: `ex-${lesson.id}`,
          answers: userAnswers,
          questions: lesson.questions,
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
      <Navbar user={currentUser} />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-4 pb-16 flex flex-wrap gap-6 flex-1">
        {/* Left Column: Lesson Player, Tabs & Content */}
        <div className="flex-[2_1_560px] space-y-6">
          {/* Active Tab Content */}
          {activeTab === "video" && (
            <div>
              <VideoPlayer
                videoId={videoUrl}
                studentName={currentUser?.name}
                studentGrade={currentUser?.grade}
              />
            </div>
          )}

          {/* Heading */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-capy-primary bg-indigo-50 px-3 py-1 rounded-full">
                {lesson.grade} · {lesson.bookTitle}
              </span>
              <span className="text-xs font-semibold text-ink-500 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
                {lesson.unitCode}: {lesson.unitTitle}
              </span>
            </div>
            <h1 className="text-2xl md:text-[28px] font-extrabold text-ink-900 mt-2 mb-1">
              {lesson.unitCode} · {lesson.title}
            </h1>
            {lesson.subTitle && (
              <p className="text-sm font-medium text-ink-500">{lesson.subTitle}</p>
            )}
          </div>

          {/* Tabs Bar */}
          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab("video")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "video" ? "btn-pri" : "btn-white"
              }`}
            >
              Video bài giảng
            </button>
            <button
              onClick={() => setActiveTab("vocab")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "vocab" ? "btn-pri" : "btn-white"
              }`}
            >
              Từ vựng ({lesson.vocabulary.length})
            </button>
            <button
              onClick={() => setActiveTab("grammar")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl ${
                activeTab === "grammar" ? "btn-pri" : "btn-white"
              }`}
            >
              Ngữ pháp ({lesson.grammar.length})
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`btn-3d text-sm font-bold px-5 py-2.5 rounded-2xl relative ${
                activeTab === "exercises" ? "btn-pri" : "btn-white"
              }`}
            >
              Bài tập ({lesson.questions.length})
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
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="font-bold text-xl text-ink-900">
                  Từ vựng trọng tâm {lesson.unitCode}
                </h3>
                <span className="text-xs font-semibold text-capy-primary bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {lesson.vocabulary.length} từ mới
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.vocabulary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border-2 border-capy-border bg-white hover:border-indigo-300 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-lg text-capy-primary">{item.word}</b>
                      <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                        ({item.pos})
                      </span>
                    </div>
                    {item.phonetic && (
                      <p className="text-xs text-ink-500 font-mono mt-0.5">{item.phonetic}</p>
                    )}
                    <p className="text-sm font-semibold text-ink-900 mt-1.5">{item.meaning}</p>
                    <p className="text-xs text-ink-500 italic mt-1.5 bg-[#FFFDF9] p-2 rounded-xl border border-gray-100">
                      &ldquo;{item.example}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tab: Grammar */}
          {activeTab === "grammar" && (
            <Card className="space-y-4">
              <div className="border-b border-indigo-100 pb-3">
                <h3 className="font-bold text-xl text-ink-900">
                  Quy tắc ngữ pháp: {lesson.title}
                </h3>
              </div>
              <div className="space-y-4 text-sm text-ink-900">
                {lesson.grammar.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-2.5"
                  >
                    <b className="block text-capy-primary text-base font-bold">{g.title}</b>
                    {g.formula && (
                      <div className="font-mono bg-white p-3 rounded-xl text-xs font-bold text-indigo-900 border border-indigo-200">
                        {g.formula}
                      </div>
                    )}
                    <p className="text-ink-700 text-xs font-medium">{g.usage}</p>
                    {g.examples && g.examples.length > 0 && (
                      <div className="bg-white/80 p-3 rounded-xl space-y-1 text-xs text-ink-600">
                        {g.examples.map((ex, i) => (
                          <p key={i}>{ex}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tab: Exercises */}
          {activeTab === "exercises" && (
            <Card className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#E0E7FF] pb-4 flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-xl text-ink-900">
                    Bài tập củng cố ({lesson.title})
                  </h3>
                  <p className="text-xs text-ink-500">
                    Tự làm và nộp bài để hệ thống tự động chấm điểm tức thì
                  </p>
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
                {lesson.questions.map((q) => {
                  const qResult = gradingResults?.results?.find(
                    (r: any) => r.questionId === q.id
                  );
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border-2 border-capy-border bg-[#FFFDF9]"
                    >
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
            {prevLesson ? (
              <Link href={`/lessons/${prevLesson.id}`}>
                <Button variant="white" size="md">
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Bài trước ({prevLesson.title.split(":")[0]})
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="white" size="md">
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Về Dashboard
                </Button>
              </Link>
            )}

            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.id}`}>
                <Button variant="cta" size="md">
                  Bài tiếp theo ({nextLesson.title.split(":")[0]})
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="cta" size="md">
                  Hoàn thành Unit · Về Dashboard
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Aside: Lesson List & Notes */}
        <aside className="card-lingo flex-[1_1_300px] self-start space-y-5">
          <div className="border-b border-[#E0E7FF] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-capy-primary">
              {currentUnit.bookTitle}
            </span>
            <h3 className="font-bold text-lg text-ink-900 mt-1">
              {currentUnit.code}: {currentUnit.title}
            </h3>
          </div>

          <div className="space-y-2 text-sm">
            {unitLessons.map((l) => {
              const isCurrent = l.id === lesson.id;
              return isCurrent ? (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#EEF2FF] text-capy-primary font-bold border-2 border-[#C7D2FE] shadow-sm"
                >
                  <span className="truncate pr-2">▶ {l.title}</span>
                  <span className="text-xs shrink-0 font-medium">{l.durationMinutes} phút</span>
                </div>
              ) : (
                <Link
                  key={l.id}
                  href={`/lessons/${l.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-100 text-ink-700 font-semibold transition-colors border border-transparent hover:border-gray-200"
                >
                  <span className="truncate pr-2">{l.title}</span>
                  <span className="text-xs text-ink-500 shrink-0">{l.durationMinutes} phút</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E0E7FF]">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="lesson-note" className="block text-sm font-bold text-ink-900">
                Ghi chú của em
              </label>
              {noteSaved && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu
                </span>
              )}
            </div>
            <textarea
              id="lesson-note"
              rows={4}
              value={lessonNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Ghi lại từ mới, mẫu câu hoặc câu hỏi cần hỏi thầy cô..."
              className="w-full box-border border-2 border-[#C7D2FE] focus:border-capy-primary rounded-2xl p-3 font-sans text-sm focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-ink-500 mt-1">
              * Tự động lưu ghi chú riêng của bạn cho bài học này.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
