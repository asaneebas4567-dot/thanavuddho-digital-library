import type { Metadata, Viewport } from "next";
import { Inter, Mitr } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const mitr = Mitr({ weight: ['300', '400', '500', '600', '700'], subsets: ["thai"], variable: "--font-mitr" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#073B65",
};

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
    <html lang="th" className="overflow-x-hidden">
      <body
        className={`${inter.variable} ${mitr.variable} font-sans antialiased min-h-screen flex flex-col bg-[#F0F8FD]/40 text-[#243447] overflow-x-hidden w-full`}
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
