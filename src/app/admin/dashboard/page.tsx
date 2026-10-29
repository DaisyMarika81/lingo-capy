"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Upload,
  Sparkles,
  BookOpen,
  Video,
  CheckCircle2,
  AlertCircle,
  Play,
  Eye,
  Check,
  ExternalLink,
  Film,
  Layers,
} from "lucide-react";

interface UnitItem {
  id: string;
  code: string;
  name: string;
  videoUrl: string;
  duration?: string;
}

interface BookItem {
  id: string;
  title: string;
  grade: string;
  units: UnitItem[];
}

const INITIAL_BOOKS: BookItem[] = [
  {
    id: "g6-gs",
    title: "Tiếng Anh 6 - Global Success",
    grade: "Lớp 6",
    units: [
      { id: "u1", code: "Unit 1", name: "My New School", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "12:40" },
      { id: "u2", code: "Unit 2", name: "My House", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "15:20" },
      { id: "u3", code: "Unit 3", name: "My Friends", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "14:15" },
      { id: "u4", code: "Unit 4", name: "My Neighbourhood", videoUrl: "", duration: "" },
      { id: "u5", code: "Unit 5", name: "Natural Wonders of Viet Nam", videoUrl: "", duration: "" },
      { id: "u6", code: "Unit 6", name: "Our Tet Holiday", videoUrl: "", duration: "" },
    ],
  },
  {
    id: "g7-fp",
    title: "Tiếng Anh 7 - Friends Plus",
    grade: "Lớp 7",
    units: [
      { id: "u1", code: "Unit 1", name: "My Time", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "16:00" },
      { id: "u2", code: "Unit 2", name: "Communication", videoUrl: "", duration: "" },
      { id: "u3", code: "Unit 3", name: "The Past", videoUrl: "", duration: "" },
      { id: "u4", code: "Unit 4", name: "In The Picture", videoUrl: "", duration: "" },
    ],
  },
  {
    id: "g8-ilsw",
    title: "Tiếng Anh 8 - i-Learn Smart World",
    grade: "Lớp 8",
    units: [
      { id: "u1", code: "Unit 1", name: "Free Time", videoUrl: "", duration: "" },
      { id: "u2", code: "Unit 2", name: "Life In The Country", videoUrl: "", duration: "" },
      { id: "u3", code: "Unit 3", name: "Protecting The Environment", videoUrl: "", duration: "" },
    ],
  },
  {
    id: "g9-gs",
    title: "Tiếng Anh 9 - Global Success",
    grade: "Lớp 9",
    units: [
      { id: "u1", code: "Unit 1", name: "Local Community", videoUrl: "", duration: "" },
      { id: "u2", code: "Unit 2", name: "City Life", videoUrl: "", duration: "" },
      { id: "u3", code: "Unit 3", name: "Healthy Living For Teens", videoUrl: "", duration: "" },
    ],
  },
];

const LESSON_PARTS = [
  { id: "les-1", name: "Bài 1: Getting Started & Từ vựng (Vocabulary)" },
  { id: "les-2", name: "Bài 2: A Closer Look 1 (Ngữ âm & Phát âm)" },
  { id: "les-3", name: "Bài 3: A Closer Look 2 (Ngữ pháp - Grammar)" },
  { id: "les-4", name: "Bài 4: Communication & Skills (Kỹ năng)" },
  { id: "les-5", name: "Bài 5: Looking Back & Ôn tập cuối Unit" },
];

function getYouTubeEmbedId(urlOrId: string) {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "";
}

export default function AdminDashboard() {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [filterNeedsReview, setFilterNeedsReview] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<Record<string, boolean>>({});

  // Video Management State
  const [books, setBooks] = useState<BookItem[]>(INITIAL_BOOKS);
  const [selectedBookId, setSelectedBookId] = useState("g6-gs");
  const [selectedUnitId, setSelectedUnitId] = useState("u3");
  const [selectedLessonId, setSelectedLessonId] = useState("les-3");
  const [videoSource, setVideoSource] = useState<"youtube" | "file" | "bunny">("youtube");
  const [videoId, setVideoId] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [videoSavedInfo, setVideoSavedInfo] = useState<string | null>(null);
  const [videoSubTab, setVideoSubTab] = useState<"form" | "overview">("form");

  const currentBook = books.find((b) => b.id === selectedBookId) || books[0];
  const currentUnit = currentBook.units.find((u) => u.id === selectedUnitId) || currentBook.units[0];
  const currentLesson = LESSON_PARTS.find((l) => l.id === selectedLessonId) || LESSON_PARTS[0];

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    const book = books.find((b) => b.id === bookId) || books[0];
    if (book && book.units.length > 0) {
      setSelectedUnitId(book.units[0].id);
      setVideoId(book.units[0].videoUrl || "");
    }
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnitId(unitId);
    const unit = currentBook.units.find((u) => u.id === unitId);
    if (unit) {
      setVideoId(unit.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoId(file.name);
    }
  };

  const handleSaveVideo = () => {
    // Update video for the current unit
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id !== selectedBookId) return b;
        return {
          ...b,
          units: b.units.map((u) => {
            if (u.id !== selectedUnitId) return u;
            return {
              ...u,
              videoUrl: videoId,
              duration: "15:00",
            };
          }),
        };
      })
    );

    // Persist to localStorage so student lessons immediately sync with this video
    try {
      localStorage.setItem(`lingo_admin_video_${selectedUnitId}`, videoId);
      const normalizedUnitId = selectedUnitId.replace(/^u(\d+)$/, "unit-$1");
      localStorage.setItem(`lingo_admin_video_${normalizedUnitId}`, videoId);
    } catch (e) {
      console.warn("Could not save video to localStorage", e);
    }

    setVideoSavedInfo(
      `✓ Đã gắn video thành công cho [${currentBook.title}] ➔ [${currentUnit.code}: ${currentUnit.name}] ➔ [${currentLesson.name}]`
    );
    setTimeout(() => setVideoSavedInfo(null), 5000);
  };

  const youtubeEmbedId = getYouTubeEmbedId(videoId);

  const unitsWithVideoCount = currentBook.units.filter((u) => Boolean(u.videoUrl)).length;
  const videoProgressPct = Math.round((unitsWithVideoCount / currentBook.units.length) * 100);

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
      <Navbar />

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

        {/* Video Upload & Linking Manager with Clear Unit/Lesson Selector */}
        <Card className="space-y-5 border-2 border-indigo-100 shadow-sm">
          {/* Header & Sub-Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E7FF] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-capy-primary flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <b className="text-lg text-ink-900 block">Quản lý & Gắn Video bài giảng cho Unit</b>
                <span className="text-xs text-ink-500">
                  Chỉ định chính xác Sách &rarr; Unit &rarr; Phần bài học cần gắn video, có khung xem thử trực tiếp
                </span>
              </div>
            </div>

            {/* Sub Tabs: Form vs Overview Checklist */}
            <div className="flex bg-[#EEF2FF] p-1 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setVideoSubTab("form")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  videoSubTab === "form" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                Gắn video & Xem thử
              </button>
              <button
                type="button"
                onClick={() => setVideoSubTab("overview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  videoSubTab === "overview" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Tiến độ Unit ({unitsWithVideoCount}/{currentBook.units.length})
              </button>
            </div>
          </div>

          {videoSavedInfo && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{videoSavedInfo}</span>
            </div>
          )}

          {/* TAB 1: FORM GẮN VIDEO */}
          {videoSubTab === "form" && (
            <div className="space-y-5">
              {/* BƯỚC 1: BỘ CHỌN SÁCH, UNIT VÀ BÀI HỌC */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-capy-primary text-white text-[11px] flex items-center justify-center font-bold">1</span>
                    Bước 1: Chọn bài học cần gắn video
                  </span>
                  <span className="text-[11px] font-semibold text-capy-primary bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {Boolean(currentUnit.videoUrl) ? "✓ Unit này đã có video" : "Chưa có video"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Select Book */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-500 mb-1">
                      1. Bộ sách giáo khoa:
                    </label>
                    <select
                      value={selectedBookId}
                      onChange={(e) => handleSelectBook(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-capy-border text-xs font-bold text-ink-900 bg-white focus:outline-none focus:border-capy-primary"
                    >
                      {books.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Unit */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-500 mb-1">
                      2. Chọn Unit trong sách:
                    </label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => handleSelectUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-capy-border text-xs font-bold text-ink-900 bg-white focus:outline-none focus:border-capy-primary"
                    >
                      {currentBook.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.code}: {u.name} {u.videoUrl ? "(✓ Đã có video)" : "(Chưa có)"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Lesson Part */}
                  <div>
                    <label className="block text-[11px] font-bold text-ink-500 mb-1">
                      3. Phần bài học cụ thể (Lesson):
                    </label>
                    <select
                      value={selectedLessonId}
                      onChange={(e) => setSelectedLessonId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border-2 border-capy-border text-xs font-bold text-ink-900 bg-white focus:outline-none focus:border-capy-primary"
                    >
                      {LESSON_PARTS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Breadcrumb Info Bar */}
                <div className="pt-1 text-xs text-ink-600 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-ink-500">Đang chọn:</span>
                  <span className="font-bold text-capy-primary">{currentBook.title}</span>
                  <span>&rarr;</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    {currentUnit.code}: {currentUnit.name}
                  </span>
                  <span>&rarr;</span>
                  <span className="font-bold text-ink-900 bg-white px-2 py-0.5 rounded-lg border border-[#CBD5E1]">
                    {currentLesson.name}
                  </span>
                </div>
              </div>

              {/* BƯỚC 2: CHỌN NGUỒN VIDEO & NHẬP LINK */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-ink-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-capy-primary text-white text-[11px] flex items-center justify-center font-bold">2</span>
                    Bước 2: Cung cấp nguồn Video & Lưu
                  </span>

                  {/* Source Switcher */}
                  <div className="flex bg-[#EEF2FF] p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setVideoSource("youtube")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        videoSource === "youtube" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                      }`}
                    >
                      Link YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSource("file")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        videoSource === "file" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                      }`}
                    >
                      Upload file MP4
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSource("bunny")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        videoSource === "bunny" ? "bg-white text-capy-primary shadow-sm" : "text-ink-500"
                      }`}
                    >
                      Bunny / Cloudflare ID
                    </button>
                  </div>
                </div>

                {videoSource === "youtube" && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ hoặc ID)"
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-semibold text-ink-900 focus:outline-none focus:border-capy-primary"
                      />
                      <Button variant="primary" size="md" onClick={handleSaveVideo} className="shrink-0 gap-1.5">
                        <Check className="w-4 h-4" />
                        Lưu video cho Unit này
                      </Button>
                    </div>
                    <p className="text-[11px] text-ink-500">
                      💡 <b>Khuyên dùng:</b> Tải video bài giảng lên YouTube và để chế độ <b>"Không công khai" (Unlisted)</b>. Chỉ học sinh trên website mới xem được, tiết kiệm 100% chi phí lưu trữ & băng thông máy chủ.
                    </p>
                  </div>
                )}

                {videoSource === "file" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleFileUpload}
                        className="text-xs text-ink-700 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-capy-primary hover:file:bg-indigo-100 cursor-pointer"
                      />
                      <Button variant="primary" size="md" onClick={handleSaveVideo} className="shrink-0">
                        Lưu Video
                      </Button>
                    </div>
                  </div>
                )}

                {videoSource === "bunny" && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        placeholder="Ví dụ: bunny_vid_94829 hoặc Cloudflare Stream UID"
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-semibold focus:outline-none focus:border-capy-primary"
                      />
                      <Button variant="primary" size="md" onClick={handleSaveVideo} className="shrink-0">
                        Lưu Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* BƯỚC 3: MÀN HÌNH XEM THỬ TRỰC TIẾP (LIVE PREVIEW) */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Khung xem thử: Học sinh sẽ thấy video này trên phòng học
                    </span>
                  </div>
                  {youtubeEmbedId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${youtubeEmbedId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1"
                    >
                      Mở trên YouTube
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="w-full aspect-video max-w-[640px] mx-auto rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-700 shadow-lg">
                  {videoSource === "youtube" && youtubeEmbedId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeEmbedId}`}
                      title="Xem thử video bài giảng"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoSource === "file" && videoId ? (
                    <div className="p-6 text-center text-slate-400">
                      <Film className="w-12 h-12 mx-auto text-indigo-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-200">File đã chọn: {videoId}</p>
                      <p className="text-xs text-slate-500 mt-1">Sẵn sàng tải lên máy chủ khi bạn bấm Lưu</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500">
                      <Play className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                      <p className="text-xs font-medium">Chưa có video. Hãy dán link YouTube hoặc chọn file ở trên.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BẢNG TIẾN ĐỘ & DANH SÁCH TỔNG QUAN THEO TỪNG UNIT */}
          {videoSubTab === "overview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <b className="text-sm text-ink-900 block">
                    Tiến độ số hóa video cho: {currentBook.title}
                  </b>
                  <span className="text-xs text-ink-500">
                    Đã hoàn thành {unitsWithVideoCount}/{currentBook.units.length} Unit ({videoProgressPct}%)
                  </span>
                </div>
                {/* Book switch in overview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink-500">Đổi sách:</span>
                  <select
                    value={selectedBookId}
                    onChange={(e) => handleSelectBook(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-capy-border text-xs font-bold text-ink-900 bg-white"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unit Table */}
              <div className="border border-[#E0E7FF] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EEF2FF]/70 text-ink-700 font-bold uppercase tracking-wider border-b border-[#E0E7FF]">
                    <tr>
                      <th className="py-3 px-4">Mã Unit</th>
                      <th className="py-3 px-4">Tên chủ đề Unit</th>
                      <th className="py-3 px-4">Thời lượng</th>
                      <th className="py-3 px-4">Trạng thái Video</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E0E7FF]">
                    {currentBook.units.map((u) => {
                      const hasVideo = Boolean(u.videoUrl);
                      const isCurrent = u.id === selectedUnitId;
                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-indigo-50/40 transition-colors ${
                            isCurrent ? "bg-indigo-50/70" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-bold text-capy-primary">
                            {u.code}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-ink-900">
                            {u.name}
                          </td>
                          <td className="py-3.5 px-4 text-ink-500">
                            {u.duration || "--:--"}
                          </td>
                          <td className="py-3.5 px-4">
                            {hasVideo ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Đã có video
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                Chưa có video
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectUnit(u.id);
                                setVideoSubTab("form");
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-ink-900 hover:border-capy-primary hover:text-capy-primary transition-all shadow-sm"
                            >
                              {hasVideo ? "Sửa video" : "+ Gắn video ngay"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
