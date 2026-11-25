import type { Metadata, Viewport } from "next";
import { Sarabun, Prompt, Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import AppProviders from "@/components/providers/AppProviders";

// 1. Reading & Long-form text font: Sarabun (Official Thai standard, comfortable loops for reading)
const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

// 2. UI, Navigation, Buttons & Tabs font: Prompt (Clean, modern, crisp sans-serif)
const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

// 3. Book Titles, Cover Displays & Headings font: Kanit (Prominent, bold, high-contrast like MEB / Ookbee)
const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
    <html lang="th" className={`${sarabun.variable} ${prompt.variable} ${kanit.variable} overflow-x-hidden scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen flex flex-col bg-white text-[#1E293B] overflow-x-hidden w-full"
      >
        <AppProviders>
          <Navbar />
          <main className="flex-grow pb-20 lg:pb-0 w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
