import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-osrs-gold hover:text-osrs-gold-light transition-colors"
            >
              OSRS Stats
            </Link>
            <form action="/search" method="GET" className="hidden sm:block">
              <input
                type="text"
                name="q"
                placeholder="Search player..."
                className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-osrs-gold focus:ring-1 focus:ring-osrs-gold transition-colors w-48"
              />
            </form>
          </div>
        </nav>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
          OSRS Stats Tracker — Not affiliated with Jagex Ltd.
        </footer>
      </body>
    </html>
  );
}
