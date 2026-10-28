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
  const [videoId, setVideoId] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [videoSource, setVideoSource] = useState<"youtube" | "file" | "bunny">("youtube");
  const [videoSaved, setVideoSaved] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoId(file.name);
    }
  };

  const handleSaveVideo = () => {
    setVideoSaved(true);
    setTimeout(() => setVideoSaved(false), 3000);
  };

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

        {/* Video Upload & Linking Manager */}
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E7FF] pb-3">
            <div>
              <b className="text-lg text-ink-900 block">Gắn Video bài giảng cho Unit</b>
              <span className="text-xs text-ink-500">
                Chọn phương thức gắn video phù hợp với bài học
              </span>
            </div>

            {/* Source switch pills */}
            <div className="flex bg-[#EEF2FF] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setVideoSource("youtube")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  videoSource === "youtube" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                }`}
              >
                Link YouTube
              </button>
              <button
                type="button"
                onClick={() => setVideoSource("file")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  videoSource === "file" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                }`}
              >
                Upload file MP4
              </button>
              <button
                type="button"
                onClick={() => setVideoSource("bunny")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  videoSource === "bunny" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                }`}
              >
                Bunny / Cloudflare ID
              </button>
            </div>
          </div>

          {videoSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
              ✓ Đã lưu video thành công cho Unit 3 · Bài 2! Học sinh có thể xem ngay trên phòng học.
            </div>
          )}

          {videoSource === "youtube" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink-700 uppercase">
                Dán đường link hoặc ID video YouTube (Khuyên dùng chế độ Không công khai - Unlisted):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ hoặc dQw4w9WgXcQ"
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-semibold focus:outline-none focus:border-capy-primary"
                />
                <Button variant="primary" size="sm" onClick={handleSaveVideo}>
                  Lưu & Xem thử
                </Button>
              </div>
              <p className="text-[11px] text-ink-500">
                💡 <b>Mẹo:</b> Tải video bài giảng lên kênh YouTube của bạn, chọn chế độ <b>"Không công khai" (Unlisted)</b> để chỉ học sinh trên web mới xem được, hoàn toàn miễn phí băng thông.
              </p>
            </div>
          )}

          {videoSource === "file" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink-700 uppercase">
                Chọn file video bài giảng (.mp4, .webm) từ máy tính:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleFileUpload}
                  className="text-xs text-ink-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-capy-primary hover:file:bg-indigo-100 cursor-pointer"
                />
                <Button variant="primary" size="sm" onClick={handleSaveVideo}>
                  Lưu Video
                </Button>
              </div>
            </div>
          )}

          {videoSource === "bunny" && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink-700 uppercase">
                Nhập Video ID từ Bunny Stream hoặc Cloudflare Stream:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="Ví dụ: bunny_vid_94829 hoặc Cloudflare Stream UID"
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-semibold focus:outline-none focus:border-capy-primary"
                />
                <Button variant="primary" size="sm" onClick={handleSaveVideo}>
                  Lưu Video
                </Button>
              </div>
              <p className="text-[11px] text-ink-500">
                Dành cho gói thương mại: Hỗ trợ DRM chống tải lậu, chống quay màn hình và chèn watermark bản quyền.
              </p>
            </div>
          )}
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
