import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Spotlight from "@/components/ui/Spotlight";
import CommandPalette from "@/components/ui/CommandPalette";
import Terminal from "@/components/ui/Terminal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rohan Patil — Portfolio",
    template: "%s | Rohan Patil",
  },
  description:
    "Personal portfolio of Rohan Patil — software engineer, ML enthusiast, and builder.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rohanpatil.dev",
    siteName: "Rohan Patil",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ScrollProgress />
        <Spotlight />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <Terminal />
      </body>
    </html>
  );
}
