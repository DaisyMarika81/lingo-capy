"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<Record<string, boolean>>({});
  const [videoId, setVideoId] = useState("bunny_vid_94829");

  const handleSimulateExtract = async () => {
    setExtracting(true);
    try {
      const res = await fetch("/api/admin/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: "book01_unit04.pdf" }),
      });
      const data = await res.json();
      setExtractedData(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setExtracting(false);
    }
  };

  const handlePublish = (qId: string) => {
    setPublishedStatus((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar user={{ name: "Cô Thuỷ (Admin)", role: "admin" }} />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-6 pb-16 flex-1 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-900">
              Quản trị số hóa sách (Admin Studio)
            </h1>
            <p className="text-ink-500 text-sm mt-1">
              Trích xuất câu hỏi từ bản scan sách bằng Gemini AI & phê duyệt trước khi Publish cho học sinh.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/students">
              <Button variant="primary" size="sm">
                Quản lý học viên
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="white" size="sm">
                Xem giao diện học sinh
              </Button>
            </Link>
          </div>
        </div>

        {/* Upload & Gemini AI Trigger */}
        <Card className="border-2 border-dashed border-capy-primary/40 bg-indigo-50/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-capy-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <b className="text-base text-ink-900 block">
                  Tải lên PDF/Ảnh Unit trong sách giáo khoa
                </b>
                <span className="text-xs text-ink-500">
                  Hỗ trợ định dạng PDF, JPG, PNG (khuyên dùng độ phân giải &ge; 200 DPI)
                </span>
              </div>
            </div>

            <Button
              variant="cta"
              size="md"
              disabled={extracting}
              onClick={handleSimulateExtract}
              className="w-full md:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {extracting ? "Gemini đang trích xuất..." : "Trích xuất câu hỏi với Gemini"}
            </Button>
          </div>
        </Card>

        {/* Video Linking */}
        <Card className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <b className="text-base text-ink-900 block">Gắn Video bài giảng cho Unit</b>
            <span className="text-xs text-ink-500">
              Hỗ trợ Bunny Stream, Cloudflare Stream, Mux hoặc YouTube unlisted ID
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Nhập video_id hoặc signed URL..."
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-semibold focus:outline-none focus:border-capy-primary"
            />
            <Button variant="primary" size="sm">
              Lưu Video
            </Button>
          </div>
        </Card>

        {/* Review & Publish Table */}
        {extractedData && (
          <Card className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E0E7FF] pb-4">
              <div>
                <span className="text-xs font-bold text-capy-primary bg-indigo-50 px-3 py-1 rounded-full uppercase">
                  Đã trích xuất thành công
                </span>
                <h2 className="text-xl font-bold text-ink-900 mt-2">
                  {extractedData.unit_title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-ink-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterNeedsReview}
                    onChange={(e) => setFilterNeedsReview(e.target.checked)}
                    className="w-4 h-4 rounded text-capy-primary"
                  />
                  Chỉ hiện câu cần duyệt (needs_review)
                </label>
              </div>
            </div>

            {/* List of Exercises & Questions */}
            <div className="space-y-6">
              {extractedData.exercises.map((ex: any, exIdx: number) => (
                <div key={exIdx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        ex.source === "book"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {ex.source === "book" ? "📖 Từ sách SGK" : "🤖 Gemini sinh thêm"}
                    </span>
                    <h3 className="font-bold text-base text-ink-900">{ex.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {ex.questions
                      .filter((q: any) => !filterNeedsReview || q.needs_review)
                      .map((q: any, qIdx: number) => {
                        const qId = `${exIdx}-${qIdx}`;
                        const isPublished = publishedStatus[qId];

                        return (
                          <div
                            key={qIdx}
                            className="p-4 rounded-2xl border-2 border-capy-border bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-ink-700 uppercase">
                                  {q.type}
                                </span>
                                {q.needs_review && !isPublished && (
                                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                    Cần giáo viên duyệt
                                  </span>
                                )}
                                {isPublished && (
                                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                    ✓ Đã Publish
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-ink-900 text-sm">
                                {q.content.prompt}
                              </p>
                              <p className="text-xs text-ink-500">
                                <b>Giải thích:</b> {q.explanation}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant={isPublished ? "white" : "cta"}
                                size="sm"
                                disabled={isPublished}
                                onClick={() => handlePublish(qId)}
                              >
                                {isPublished ? "Đã duyệt" : "Duyệt & Publish"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
