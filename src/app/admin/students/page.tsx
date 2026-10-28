"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Search,
  Plus,
  Flame,
  ShieldAlert,
  UserCheck,
  KeyRound,
  X,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  enrolledBook: string;
  progressPct: number;
  streakDays: number;
  lastActive: string;
  parentName: string;
  parentPhone: string;
  status: "active" | "expired" | "pending";
}

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch real students from Supabase
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/admin/students", { headers });
      const data = await res.json();
      if (res.ok && data.students) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Form state for adding new student
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "Lớp 6",
    enrolledBook: "Tiếng Anh 6 - Global Success",
    parentName: "",
    parentPhone: "",
  });

  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    tempPassword: string;
    name: string;
  } | null>(null);
  const [submittingUser, setSubmittingUser] = useState(false);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Không thể cấp tài khoản học viên");
        setSubmittingUser(false);
        return;
      }

      const tempPass = data.user.tempPassword;
      const created: Student = {
        id: data.user.id,
        name: newStudent.name,
        email: newStudent.email,
        grade: newStudent.grade,
        enrolledBook: newStudent.enrolledBook,
        progressPct: 0,
        streakDays: 0,
        lastActive: "Mới cấp tài khoản",
        parentName: newStudent.parentName || "Chưa cập nhật",
        parentPhone: newStudent.parentPhone || "Chưa cập nhật",
        status: "active",
      };

      setStudents([created, ...students]);
      setIsModalOpen(false);
      fetchStudents();
      setCreatedCredentials({
        name: newStudent.name,
        email: newStudent.email,
        tempPassword: tempPass,
      });

      setNewStudent({
        name: "",
        email: "",
        grade: "Lớp 6",
        enrolledBook: "Tiếng Anh 6 - Global Success",
        parentName: "",
        parentPhone: "",
      });
    } catch (err: any) {
      alert("Lỗi kết nối máy chủ khi tạo tài khoản");
    } finally {
      setSubmittingUser(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      <Navbar />

      <main className="max-w-[1180px] w-full mx-auto px-6 py-6 pb-20 flex-1 space-y-6">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">
              <Link href="/admin/dashboard" className="hover:text-capy-primary transition-colors">
                Admin Studio
              </Link>
              <span>/</span>
              <span className="text-capy-primary">Quản lý học viên</span>
            </div>
            <h1 className="text-3xl font-extrabold text-ink-900 tracking-tight flex items-center gap-3">
              Quản lý tài khoản học viên
              <span className="text-xs bg-indigo-100 text-capy-primary px-3 py-1 rounded-full font-bold">
                {filteredStudents.length} học viên
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="cta"
              size="md"
              onClick={() => setIsModalOpen(true)}
              className="gap-2 shadow-btn-accent"
            >
              <Plus className="w-5 h-5" />
              Thêm học viên mới
            </Button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Tổng học viên</p>
              <p className="text-3xl font-extrabold text-ink-900 mt-1">{students.length}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">✓ 100% tài khoản xác thực</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-capy-primary flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Hoạt động hôm nay</p>
              <p className="text-3xl font-extrabold text-ink-900 mt-1">3</p>
              <p className="text-xs text-indigo-600 font-semibold mt-1">Chiếm 60% tổng sĩ số</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Chuỗi streak cao nhất</p>
              <p className="text-3xl font-extrabold text-[#B45309] mt-1">22 ngày 🔥</p>
              <p className="text-xs text-ink-500 font-medium mt-1">Hoàng Yến (Lớp 8)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-ink-500 tracking-wider">Cần nhắc nhở</p>
              <p className="text-3xl font-extrabold text-rose-600 mt-1">1</p>
              <p className="text-xs text-rose-600 font-medium mt-1">Đã nghỉ học &gt; 7 ngày</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, email, phụ huynh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-capy-border text-sm font-medium text-ink-900 focus:outline-none focus:border-capy-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Grade Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-500 uppercase">Khối:</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-capy-border text-sm font-bold text-ink-900 focus:outline-none focus:border-capy-primary bg-white cursor-pointer"
                >
                  <option value="all">Tất cả khối</option>
                  <option value="Lớp 6">Lớp 6</option>
                  <option value="Lớp 7">Lớp 7</option>
                  <option value="Lớp 8">Lớp 8</option>
                  <option value="Lớp 9">Lớp 9</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink-500 uppercase">Trạng thái:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border-2 border-capy-border text-sm font-bold text-ink-900 focus:outline-none focus:border-capy-primary bg-white cursor-pointer"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang học</option>
                  <option value="expired">Hết hạn</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="p-0 overflow-hidden border border-[#E0E7FF]/70">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#EEF2FF]/60 text-ink-700 font-bold border-b border-[#E0E7FF] text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Học viên</th>
                  <th className="py-4 px-4">Khối lớp</th>
                  <th className="py-4 px-4">Sách & Tiến độ</th>
                  <th className="py-4 px-4">Streak 🔥</th>
                  <th className="py-4 px-4">Hoạt động gần nhất</th>
                  <th className="py-4 px-4">Phụ huynh liên hệ</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7FF]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-ink-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-capy-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-bold text-sm text-ink-700">Đang tải danh sách học viên từ Supabase...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-ink-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <LingoCapy size={64} mood="sleepy" />
                        <p className="font-bold text-base text-ink-900">Không tìm thấy học viên phù hợp</p>
                        <p className="text-xs">Hãy thử đổi từ khóa tìm kiếm hoặc bỏ bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-indigo-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(s)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-capy-primary font-bold flex items-center justify-center text-sm shadow-sm">
                            {s.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(-2)
                              .join("")}
                          </div>
                          <div>
                            <div className="font-bold text-ink-900">{s.name}</div>
                            <div className="text-xs text-ink-500">{s.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-xs bg-[#E0E7FF] text-[#3730A3] px-2.5 py-1 rounded-lg">
                          {s.grade}
                        </span>
                      </td>

                      {/* Book & Progress */}
                      <td className="py-4 px-4">
                        <div className="w-48 space-y-1.5">
                          <div className="text-xs font-semibold text-ink-900 truncate">
                            {s.enrolledBook}
                          </div>
                          <div className="flex items-center gap-2">
                            <ProgressBar progress={s.progressPct} height={8} className="flex-1" />
                            <span className="text-xs font-bold text-ink-700">{s.progressPct}%</span>
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-4 px-4">
                        <span
                          className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                            s.streakDays > 0
                              ? "bg-amber-100 text-[#B45309]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {s.streakDays} ngày 🔥
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 text-xs font-medium text-ink-500">
                        {s.lastActive}
                      </td>

                      {/* Parent Info */}
                      <td className="py-4 px-4">
                        <div className="text-xs">
                          <p className="font-bold text-ink-900">{s.parentName}</p>
                          <p className="text-ink-500">{s.parentPhone}</p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(s);
                          }}
                          className="btn-3d text-xs font-bold px-3 py-1.5 rounded-xl btn-white"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal: Thêm học viên mới */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 space-y-5 bg-white relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 text-ink-500 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <LingoCapy size={44} mood="celebrating" />
                <div>
                  <h3 className="font-extrabold text-xl text-ink-900">Thêm học viên mới</h3>
                  <p className="text-xs text-ink-500">Tạo tài khoản và gán sách giáo khoa kích hoạt ban đầu</p>
                </div>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                    Họ và tên học sinh *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Minh An"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-capy-border focus:border-capy-primary text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                    Email đăng nhập *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="minhan@gmail.com"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-capy-border focus:border-capy-primary text-sm font-medium focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                      Khối lớp
                    </label>
                    <select
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-capy-border text-sm font-bold focus:outline-none bg-white"
                    >
                      <option value="Lớp 6">Lớp 6</option>
                      <option value="Lớp 7">Lớp 7</option>
                      <option value="Lớp 8">Lớp 8</option>
                      <option value="Lớp 9">Lớp 9</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                      Sách giáo khoa
                    </label>
                    <select
                      value={newStudent.enrolledBook}
                      onChange={(e) => setNewStudent({ ...newStudent, enrolledBook: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-capy-border text-sm font-bold focus:outline-none bg-white"
                    >
                      <option value="Tiếng Anh 6 - Global Success">Global Success</option>
                      <option value="Tiếng Anh 6 - Friends Plus">Friends Plus</option>
                      <option value="Tiếng Anh 6 - i-Learn Smart World">i-Learn Smart World</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                      Họ tên phụ huynh
                    </label>
                    <input
                      type="text"
                      placeholder="Phụ huynh"
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-capy-border focus:border-capy-primary text-sm font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink-700 uppercase mb-1">
                      Số điện thoại phụ huynh
                    </label>
                    <input
                      type="tel"
                      placeholder="0912..."
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-capy-border focus:border-capy-primary text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="white"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" variant="cta" size="sm" disabled={submittingUser}>
                    {submittingUser ? "Đang cấp tài khoản..." : "Cấp tài khoản"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Modal: Thông tin tài khoản vừa cấp */}
        {createdCredentials && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 space-y-5 bg-white relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-2xl shadow-sm">
                  ✓
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-ink-900">Đã cấp tài khoản thành công!</h3>
                  <p className="text-xs text-ink-500">Thông tin đăng nhập dành cho học sinh</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-[#C7D2FE] space-y-2.5 text-xs text-ink-900">
                <div className="flex justify-between">
                  <span className="font-semibold text-ink-500">Họ và tên:</span>
                  <b>{createdCredentials.name}</b>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-ink-500">Email:</span>
                  <b className="font-mono text-capy-primary">{createdCredentials.email}</b>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-indigo-200/60">
                  <span className="font-semibold text-ink-500">Mật khẩu ban đầu:</span>
                  <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-indigo-300 text-indigo-900 text-sm">
                    {createdCredentials.tempPassword}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="cta"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Tài khoản Lingo Capy của bạn:\nEmail: ${createdCredentials.email}\nMật khẩu: ${createdCredentials.tempPassword}\nĐăng nhập tại: http://localhost:3000/login`
                    );
                    alert("Đã sao chép thông tin tài khoản vào Clipboard!");
                  }}
                >
                  Sao chép thông tin
                </Button>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setCreatedCredentials(null)}
                >
                  Đóng
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Drawer / Detail Modal for Selected Student */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 space-y-6 bg-white relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="absolute right-5 top-5 text-ink-500 hover:text-ink-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-capy-primary font-extrabold flex items-center justify-center text-xl shadow-sm">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(-2)
                    .join("")}
                </div>
                <div>
                  <h3 className="font-extrabold text-2xl text-ink-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-ink-500">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#EEF2FF]/60 border border-[#C7D2FE]">
                <div>
                  <span className="text-xs font-bold text-ink-500 block">Khối lớp</span>
                  <span className="font-bold text-sm text-ink-900">{selectedStudent.grade}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-ink-500 block">Chuỗi ngày học liên tục</span>
                  <span className="font-bold text-sm text-[#B45309]">
                    {selectedStudent.streakDays} ngày 🔥
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#C7D2FE]/60">
                  <span className="text-xs font-bold text-ink-500 block">Sách đang học</span>
                  <span className="font-bold text-sm text-ink-900 block mb-1">
                    {selectedStudent.enrolledBook}
                  </span>
                  <ProgressBar progress={selectedStudent.progressPct} height={10} />
                  <span className="text-xs text-ink-500 block text-right mt-1">
                    Đã hoàn thành {selectedStudent.progressPct}% sách
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-ink-900">Thông tin phụ huynh bảo trợ</h4>
                <div className="p-3.5 rounded-xl border border-capy-border text-xs space-y-1">
                  <p>
                    <b>Họ và tên:</b> {selectedStudent.parentName}
                  </p>
                  <p>
                    <b>Số điện thoại:</b> {selectedStudent.parentPhone}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Đã gửi email khôi phục mật khẩu đến: ${selectedStudent.email}`)}
                >
                  <KeyRound className="w-4 h-4 mr-1.5" />
                  Đặt lại mật khẩu
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                >
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
