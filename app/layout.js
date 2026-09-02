import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "./PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sahasra - Voting Platform",
  description: "University Team Management & Voting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#05060a] text-slate-100 selection:bg-amber-500 selection:text-slate-950" suppressHydrationWarning>
        {/* ලින්ක් එකක් ක්ලික් කරන සෑම අවස්ථාවකම ක්‍රියාත්මක වන Global Page Loader */}
        <PageLoader />
        
        {children}
      </body>
    </html>
  );
}
