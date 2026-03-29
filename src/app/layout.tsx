import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
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
  title: "OSRS Account Stats",
  description:
    "Track your Old School RuneScape progress. View skills, bosses, collection log, quests, diaries, and more.",
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
      <body className="min-h-full flex flex-col text-gray-100">
        <AnimatedBackground />

        {/* Glass Navbar */}
        <nav className="sticky top-0 z-50 glass border-b border-white/5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-osrs-gold hover:text-osrs-gold-light transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              OSRS Stats
            </Link>
            <form
              action="/search"
              method="GET"
              className="hidden sm:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="Search player..."
                  className="rounded-xl glass-light px-4 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-osrs-gold/50 focus:ring-1 focus:ring-osrs-gold/30 transition-all w-56"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
          </div>
        </nav>

        {/* Main content */}
        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 glass border-t border-white/5 py-4 text-center text-xs text-gray-500">
          OSRS Stats Tracker &mdash; Not affiliated with Jagex Ltd.
        </footer>
      </body>
    </html>
  );
}
