import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo Capy – Biến sách giấy tiếng Anh thành lớp học online",
  description: "Nền tảng học tiếng Anh cấp 2 bám sát SGK với video bài giảng, bài tập tương tác tự chấm điểm và đồng hành cùng linh vật Capybara.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#1E1B4B]">
        {children}
      </body>
    </html>
  );
}
