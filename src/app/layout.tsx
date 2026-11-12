import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppProviders from "@/components/providers/AppProviders";

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#073B65",
};

export const metadata: Metadata = {
  title: "Thanavuddho Digital Library | หอสมุดดิจิทัล พระครูปลัดสุวัฒนโพธิคุณ",
  description: "รวบรวมองค์ความรู้และผลงานของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) เพื่อการศึกษาและพัฒนาจิตใจ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} overflow-x-hidden scroll-smooth`}>
      <body
        className={`${prompt.variable} font-sans antialiased min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] overflow-x-hidden w-full`}
      >
        <AppProviders>
          <Navbar />
          <main className="flex-grow pb-24 lg:pb-0 w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
