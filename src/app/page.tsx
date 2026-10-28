import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { LingoCapy } from "@/components/mascot/LingoCapy";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#FFFBF5]">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-[1160px] mx-auto px-6 py-10 md:py-16 flex flex-wrap items-center gap-12">
        <div className="flex-1 min-w-[320px] md:min-w-[440px]">
          <span className="inline-block bg-[#E0E7FF] text-[#3730A3] font-bold px-4 py-2 rounded-full text-sm mb-5">
            Dành cho học sinh lớp 6–9
          </span>
          <h1 className="text-4xl md:text-[52px] leading-[1.15] font-extrabold text-ink-900 mb-5">
            Biến sách giấy thành lớp học tiếng Anh vui mỗi ngày
          </h1>
          <p className="text-ink-500 text-lg md:text-xl leading-relaxed mb-8">
            Video bài giảng, từ vựng, ngữ pháp và bài tập theo đúng từng Unit trong sách. Phụ huynh theo dõi tiến độ dễ dàng.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard">
              <Button variant="cta" size="lg">
                Học thử miễn phí
              </Button>
            </Link>
            <Link href="/lessons/demo">
              <Button variant="white" size="lg">
                Xem bài mẫu
              </Button>
            </Link>
          </div>
        </div>

        {/* Mascot & Preview Card */}
        <div className="flex-1 min-w-[300px] md:min-w-[360px]">
          <Card variant="gradient" className="text-center p-8 md:p-10 border border-[#E0E7FF]/60">
            <div className="flex justify-center mb-4">
              <LingoCapy size={130} />
            </div>
            <h3 className="text-2xl font-bold text-ink-900 mb-2">Unit 3 · Hobbies</h3>
            <ProgressBar progress={64} height={12} className="my-4" />
            <p className="text-ink-500 font-medium text-sm">
              Chuỗi 7 ngày liên tiếp · 64% hoàn thành
            </p>
          </Card>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-[1160px] mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card className="hover:shadow-card-lg transition-shadow">
          <h3 className="text-xl font-bold text-ink-900">Bám sát sách giáo khoa</h3>
          <p className="text-ink-500 mt-2 leading-relaxed text-[15px]">
            Mỗi bài học tương ứng một phần trong sách giấy của con, chuẩn kiến thức chương trình GDPT.
          </p>
        </Card>

        <Card className="hover:shadow-card-lg transition-shadow">
          <h3 className="text-xl font-bold text-ink-900">Học như chơi game</h3>
          <p className="text-ink-500 mt-2 leading-relaxed text-[15px]">
            Chuỗi ngày học, huy hiệu và mục tiêu hằng ngày cùng Capybara giữ con luôn hào hứng.
          </p>
        </Card>

        <Card className="hover:shadow-card-lg transition-shadow">
          <h3 className="text-xl font-bold text-ink-900">Phụ huynh yên tâm</h3>
          <p className="text-ink-500 mt-2 leading-relaxed text-[15px]">
            Xem thời gian học, điểm số, kỹ năng mạnh và yếu của con mỗi tuần với báo cáo rõ ràng.
          </p>
        </Card>
      </section>

      {/* 3 Simple Steps */}
      <section className="max-w-[1160px] mx-auto px-6 py-14 w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-ink-900 mb-10">
          Bắt đầu chỉ với 3 bước
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-capy-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-btn-primary mb-4">
              1
            </div>
            <p className="font-bold text-lg text-ink-900">Tạo tài khoản cho con</p>
            <p className="text-ink-500 text-sm mt-1">Đăng ký tài khoản nhanh chóng chỉ trong 1 phút</p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-capy-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-btn-primary mb-4">
              2
            </div>
            <p className="font-bold text-lg text-ink-900">Chọn Unit trong sách</p>
            <p className="text-ink-500 text-sm mt-1">Mở sách bài tập ra và chọn đúng bài trên hệ thống</p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-capy-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-btn-primary mb-4">
              3
            </div>
            <p className="font-bold text-lg text-ink-900">Xem video, làm bài, nhận quà</p>
            <p className="text-ink-500 text-sm mt-1">Học sinh tự giác làm bài và xem ngay giải thích chi tiết</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1160px] mx-auto px-6 py-10 w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-ink-900 mb-8">
          Bảng giá linh hoạt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-ink-700">Học thử</h3>
              <p className="text-4xl font-extrabold text-ink-900 my-3">0đ</p>
              <p className="text-ink-500 text-sm">Trải nghiệm miễn phí 2 Unit đầu tiên kèm bài tập tương tác có giải thích.</p>
            </div>
            <Link href="/register" className="mt-6">
              <Button variant="outline" className="w-full">Bắt đầu học thử</Button>
            </Link>
          </Card>

          <Card className="border-[3px] border-capy-primary relative flex flex-col justify-between shadow-card-lg">
            <div className="absolute -top-3.5 right-6 bg-capy-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Phổ biến nhất
            </div>
            <div>
              <h3 className="font-bold text-lg text-capy-primary">Gói học kỳ</h3>
              <p className="text-4xl font-extrabold text-ink-900 my-3">149.000đ<span className="text-base font-normal text-ink-500">/tháng</span></p>
              <p className="text-ink-500 text-sm">Toàn quyền truy cập tất cả video bài giảng, hệ thống bài tập tự chấm và hỗ trợ giải đáp.</p>
            </div>
            <Link href="/register" className="mt-6">
              <Button variant="cta" className="w-full">Chọn gói này</Button>
            </Link>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-ink-700">Gói cả năm</h3>
              <p className="text-4xl font-extrabold text-ink-900 my-3">99.000đ<span className="text-base font-normal text-ink-500">/tháng</span></p>
              <p className="text-ink-500 text-sm">Tiết kiệm 35%, tặng kèm bộ đề thi học kỳ 1 và 2 bám sát đề thi thật.</p>
            </div>
            <Link href="/register" className="mt-6">
              <Button variant="primary" className="w-full">Đăng ký năm</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-[800px] mx-auto px-6 py-12 w-full">
        <h2 className="text-3xl font-extrabold text-center text-ink-900 mb-8">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-4">
          <Card className="p-5">
            <b className="text-lg text-ink-900 block mb-2">Con tôi cần có sách giấy không?</b>
            <p className="text-ink-500 text-[15px] leading-relaxed">
              Có. Hệ thống được thiết kế để học sinh mở sách giấy bên cạnh màn hình, làm bài bám sát sách và kiểm tra ngay kết quả tự động trên web.
            </p>
          </Card>

          <Card className="p-5">
            <b className="text-lg text-ink-900 block mb-2">Có thể hủy gói hoặc đổi lớp bất cứ lúc nào không?</b>
            <p className="text-ink-500 text-[15px] leading-relaxed">
              Bạn hoàn toàn có thể hủy gia hạn bất kỳ lúc nào chỉ với một cú nhấp chuột trong tài khoản phụ huynh, hoặc đổi lớp theo khối học hiện tại của con.
            </p>
          </Card>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-capy-primary text-white text-center py-16 px-6 mt-auto">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Sẵn sàng cùng chú capybara học tiếng Anh?
          </h2>
          <Link href="/register">
            <Button variant="cta" size="lg" className="min-h-[56px] text-lg">
              Đăng ký miễn phí ngay
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
