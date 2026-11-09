import type { Metadata } from "next";
import { Inter, Mitr } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const mitr = Mitr({ weight: ['300', '400', '500', '600', '700'], subsets: ["thai"], variable: "--font-mitr" });

export const metadata: Metadata = {
  title: "Thanavuddho Digital Library",
  description: "รวบรวมองค์ความรู้และผลงานของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) เพื่อการศึกษาและพัฒนาจิตใจ",
};

import AppProviders from "@/components/providers/AppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${mitr.variable} font-sans antialiased min-h-screen flex flex-col bg-[#F0F8FD]/40 text-[#243447]`}
      >
        <AppProviders>
          <Navbar />
          <main className="flex-grow pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
