import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keep using sleek fonts
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#275b91",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // user-scalable=no
};

export const metadata: Metadata = {
  title: "AIDA",
  description: "人と人の間をつなぐ会話促進型質問アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AIDA",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
