# Lingo Capy – Biến sách giấy tiếng Anh thành lớp học online

Nền tảng web giáo dục tương tác giúp biến sách tiếng Anh THCS (lớp 6–9) thành bài giảng video sinh động, hệ thống bài tập tự chấm điểm thông minh và dashboard theo dõi tiến độ dành cho học sinh, phụ huynh và giáo viên.

---

## 1. Kiến trúc hệ thống & Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Framer Motion
- **Design Tokens:** Lấy cảm hứng từ Duolingo + linh vật Capybara dễ thương (`#FFFBF5` cream, `#4F46E5` indigo, `#FBBF24` amber CTA, font *Be Vietnam Pro*).
- **Backend / Database / Auth:** Supabase (Postgres, Auth, Storage, Row Level Security - RLS)
- **AI Processing:** Google Gemini API (Structured JSON extraction) cho pipeline trích xuất sách và sinh bài tập tại trang Admin.
- **Video:** Bunny Stream / Cloudflare Stream / Mux / YouTube embed.

---

## 2. Checklist triển khai (Bước 0 - 10)

- [x] **Bước 0** – Chuẩn bị nội dung, bản quyền & cấu trúc bài học
- [ ] **Bước 1** – Thiết kế giao diện (Design System tokens & linh vật Capy)
- [x] **Bước 2** – Khởi tạo dự án Next.js 14, cấu trúc thư mục, môi trường
- [x] **Bước 3** – Database Schema, Row Level Security (RLS), Supabase SSR Client & Middleware phân quyền theo Role
- [x] **Bước 4** – Trang học sinh (Dashboard, Bài giảng, Video Player kèm debounce tiến độ)
- [x] **Bước 5** – Engine làm bài & chấm điểm Server-side (MCQ, Fill in blank, True/False, Matching, Reorder)
- [ ] **Bước 6** – Tracking tiến độ (Streak ngày học, % hoàn thành unit, danh sách câu sai)
- [ ] **Bước 7** – Admin Pipeline số hóa Gemini trích xuất sách sang JSON + màn hình duyệt
- [ ] **Bước 8** – Dashboard phụ huynh & giáo viên
- [ ] **Bước 9** – Test RLS, kiểm thử thực tế và deploy Vercel
- [ ] **Bước 10** – Tích hợp cổng thanh toán (PayOS / VNPay) và mở rộng sách mới

---

## 3. Cấu hình biến môi trường (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-never-expose-to-client
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
