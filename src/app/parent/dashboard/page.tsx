"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { createClient } from "@/lib/supabase/client";
import {
  Clock,
  Award,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Calendar,
  Heart,
  Plus,
  ShieldCheck,
  ChevronDown,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function ParentDashboardPage() {
  const [selectedChild, setSelectedChild] = useState("minhan");
  const [childName, setChildName] = useState("Minh An");
  const [childGrade, setChildGrade] = useState("Lớp 6");
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [kudosSent, setKudosSent] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildGrade, setNewChildGrade] = useState("Lớp 6");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        // Query children linked to this parent
        const { data: children } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("parent_id", user.id)
          .returns<{ id: string; full_name: string }[]>();

        if (children && children.length > 0) {
          setChildName(children[0].full_name || "Bé");
        }
      }
    });
  }, []);

  // Daily study minutes for the week
  const weeklyStudyData = [
    { day: "Thứ 2", mins: 25, height: "60%" },
    { day: "Thứ 3", mins: 30, height: "75%" },
    { day: "Thứ 4", mins: 15, height: "40%" },
    { day: "Thứ 5", mins: 35, height: "85%" },
    { day: "Thứ 6", mins: 20, height: "50%" },
    { day: "Thứ 7", mins: 40, height: "100%" },
    { day: "Chủ nhật", mins: 20, height: "50%" },
  ];

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Ngay,Bai_hoc,Diem,Thoi_gian_hoc_phut,Trang_thai\n" +
      "2026-10-28,Unit 3 - Lesson 2: Present Simple,90,20,Hoan thanh\n" +
      "2026-10-27,Unit 3 - Lesson 1: Vocabulary,100,25,Hoan thanh\n" +
      "2026-10-26,Unit 2 - Lesson 3: Family Review,85,30,Hoan thanh\n" +
      "2026-10-25,Unit 2 - Lesson 2: Grammar,80,15,Hoan thanh\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_hoc_tap_Minh_An_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendKudos = () => {
    setKudosSent(true);
    setTimeout(() => setKudosSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar />

      <main className="max-w-[1160px] w-full mx-auto px-6 py-6 pb-20 flex-1 space-y-6">
        {/* Top Header: Child Switcher & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">
              <span>Báo cáo phụ huynh</span>
              <span>/</span>
              <span className="text-capy-primary">Đồng hành cùng con</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-ink-900 tracking-tight">
                Tiến độ học tập của {childName}
              </h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                Lớp 6 · Đang tích cực
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="white"
              size="sm"
              onClick={handleExportCSV}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Xuất báo cáo (CSV)
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={() => setIsConsentModalOpen(true)}
              className="gap-1.5 shadow-btn-accent"
            >
              <Plus className="w-4 h-4" />
              Thêm tài khoản con
            </Button>
          </div>
        </div>

        {/* Kudos alert notification */}
        {kudosSent && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <b className="text-sm block">Đã gửi lời động viên kèm sticker Capybara đến Minh An!</b>
                <span className="text-xs text-amber-700">Lời khen sẽ xuất hiện ngay khi con mở ứng dụng.</span>
              </div>
            </div>
            <button onClick={() => setKudosSent(false)} className="text-amber-800">✕</button>
          </div>
        )}

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Thời gian tuần này</p>
              <p className="text-3xl font-extrabold text-ink-900 mt-1">185 phút</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">✓ Vượt 120% mục tiêu tuần</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-capy-primary flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Điểm bài tập TB</p>
              <p className="text-3xl font-extrabold text-capy-primary mt-1">88/100</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Đạt chuẩn Học lực Tốt</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Chuỗi ngày học</p>
              <p className="text-3xl font-extrabold text-[#B45309] mt-1">7 ngày 🔥</p>
              <p className="text-xs text-ink-500 font-medium mt-1">Học đều đặn mỗi tối</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Câu sai đã sửa</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">6 câu</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Chủ động vào phòng sửa sai</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Study Time Chart & Skill Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Time Bar Chart */}
          <Card className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-ink-900">Biểu đồ thời lượng học trong tuần</h3>
                <p className="text-xs text-ink-500">Mục tiêu khuyến nghị: 15–20 phút/ngày để duy trì phản xạ</p>
              </div>
              <span className="text-xs font-bold text-capy-primary bg-indigo-50 px-3 py-1 rounded-full">
                Tuần này: 185 phút
              </span>
            </div>

            {/* Visual Bar Graph */}
            <div className="pt-6 pb-2">
              <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-gray-200">
                {weeklyStudyData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold text-ink-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.mins}p
                    </span>
                    <div
                      className="w-full max-w-[42px] bg-indigo-500 rounded-t-xl group-hover:bg-indigo-600 transition-all shadow-sm"
                      style={{ height: item.height }}
                    />
                    <span className="text-xs font-semibold text-ink-700 mt-2">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-500 pt-1">
              <span>Đỉnh điểm: Thứ 7 (40 phút luyện bài tập SGK)</span>
              <button
                onClick={handleSendKudos}
                className="text-capy-primary font-bold hover:underline flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                Gửi lời khen cho con
              </button>
            </div>
          </Card>

          {/* Skill Breakdown Card */}
          <Card className="space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-ink-900">Năng lực theo kỹ năng</h3>
              <p className="text-xs text-ink-500">Đánh giá dựa trên kết quả các bài tự chấm</p>

              <div className="space-y-3.5 mt-5">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-ink-900">Ngữ pháp (Grammar)</span>
                    <span className="text-emerald-600 font-extrabold">90% · Vững</span>
                  </div>
                  <ProgressBar progress={90} height={8} color="bg-emerald-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-ink-900">Từ vựng (Vocabulary)</span>
                    <span className="text-indigo-600 font-extrabold">85% · Tốt</span>
                  </div>
                  <ProgressBar progress={85} height={8} color="bg-indigo-600" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-ink-900">Bài tập đọc & điền từ</span>
                    <span className="text-amber-600 font-extrabold">75% · Khá</span>
                  </div>
                  <ProgressBar progress={75} height={8} color="bg-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-ink-900">Nghe & Phát âm</span>
                    <span className="text-rose-600 font-extrabold">65% · Cần rèn</span>
                  </div>
                  <ProgressBar progress={65} height={8} color="bg-rose-500" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <b>Lời khuyên từ giáo viên:</b> Minh An nắm ngữ pháp rất nhanh, phụ huynh nhắc con xem lại video phát âm Unit 3 để nói tự nhiên hơn.
            </div>
          </Card>
        </div>

        {/* Recent Learning History Table */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-ink-900">Lịch sử bài làm gần đây</h3>
            <span className="text-xs font-bold text-ink-500">Hiển thị 4 bài gần nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EEF2FF]/60 text-ink-700 font-bold border-b border-[#E0E7FF] text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Bài học</th>
                  <th className="py-3 px-4">Thời gian học</th>
                  <th className="py-3 px-4">Thời lượng</th>
                  <th className="py-3 px-4">Điểm số</th>
                  <th className="py-3 px-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7FF]">
                <tr>
                  <td className="py-3 px-4 font-bold text-ink-900">Unit 3 · Bài 2: Present Simple</td>
                  <td className="py-3 px-4 text-xs text-ink-500">Hôm nay, 15:30</td>
                  <td className="py-3 px-4 text-xs">20 phút</td>
                  <td className="py-3 px-4 font-extrabold text-capy-primary">100/100</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      ✓ Đạt chuẩn
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-ink-900">Unit 3 · Bài 1: Từ vựng Sở thích</td>
                  <td className="py-3 px-4 text-xs text-ink-500">Hôm qua, 20:10</td>
                  <td className="py-3 px-4 text-xs">25 phút</td>
                  <td className="py-3 px-4 font-extrabold text-capy-primary">85/100</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      ✓ Đạt chuẩn
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-ink-900">Unit 2 · Luyện sửa câu sai Family</td>
                  <td className="py-3 px-4 text-xs text-ink-500">26/10/2026</td>
                  <td className="py-3 px-4 text-xs">15 phút</td>
                  <td className="py-3 px-4 font-extrabold text-capy-primary">90/100</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      ✓ Đã sửa sai
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-ink-900">Unit 2 · Bài 2: Grammar to be</td>
                  <td className="py-3 px-4 text-xs text-ink-500">25/10/2026</td>
                  <td className="py-3 px-4 text-xs">30 phút</td>
                  <td className="py-3 px-4 font-extrabold text-capy-primary">80/100</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                      ✓ Đạt chuẩn
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Thêm tài khoản con kèm Điều khoản bảo vệ dữ liệu trẻ em */}
        {isConsentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 space-y-5 bg-white relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                className="absolute right-5 top-5 text-ink-500 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-capy-primary flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-ink-900">Thêm tài khoản con</h3>
                  <p className="text-xs text-ink-500">Được bảo vệ theo Nghị định bảo vệ dữ liệu cá nhân trẻ em</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Đã tạo tài khoản cho con: ${newChildName} (${newChildGrade})!`);
                  setIsConsentModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                    Họ và tên của con *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Bảo Châu"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-medium focus:outline-none focus:border-capy-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                    Khối lớp hiện tại *
                  </label>
                  <select
                    value={newChildGrade}
                    onChange={(e) => setNewChildGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-capy-border text-sm font-bold focus:outline-none bg-white"
                  >
                    <option value="Lớp 6">Lớp 6 (SGK Global Success / Friends Plus)</option>
                    <option value="Lớp 7">Lớp 7 (SGK Global Success / Friends Plus)</option>
                    <option value="Lớp 8">Lớp 8 (SGK Global Success / Smart World)</option>
                    <option value="Lớp 9">Lớp 9 (SGK Global Success / Smart World)</option>
                  </select>
                </div>

                {/* Legal Consent Checkbox (Nghị định 13/2023) */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-[#C7D2FE] text-xs text-ink-700 space-y-2">
                  <p className="font-bold text-capy-primary">
                    Cam kết bảo vệ dữ liệu trẻ em:
                  </p>
                  <p className="text-[11px] leading-relaxed text-ink-500">
                    Lingo Capy thu thập dữ liệu tối thiểu (chỉ lưu tiến độ học và kết quả bài tập), không chia sẻ với bên thứ ba, không quảng cáo và toàn quyền thuộc quyền quản lý của cha mẹ.
                  </p>
                  <label className="flex items-start gap-2 pt-1 font-semibold text-ink-900 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 rounded text-capy-primary"
                    />
                    <span>Tôi là phụ huynh/người giám hộ hợp pháp và đồng ý tạo tài khoản cho con.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="white"
                    size="sm"
                    onClick={() => setIsConsentModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="cta"
                    size="sm"
                    disabled={!consentAgreed || !newChildName}
                  >
                    Tạo tài khoản cho con
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
