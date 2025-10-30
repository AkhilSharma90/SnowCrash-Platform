import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
  metadataBase: new URL("https://snowcrash.example"),
  title: {
    default: "Snowcrash Trust Center",
    template: "%s · Snowcrash Trust Center",
  },
  description:
    "Snowcrash Trust Center surfaces live security posture indicators, advisories, and compliance signals for frontier AI models.",
  keywords: ["LLM", "security", "Snowcrash", "trust center", "AI risk", "governance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        <ThemeProvider>
          <header className="border-b border-slate-200/80 bg-white/90 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur dark:border-slate-900/60 dark:bg-slate-950/70">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold uppercase tracking-[0.32em] text-slate-700 shadow-sm dark:border-slate-900 dark:bg-slate-950 dark:text-slate-200">
                  SC
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em]">Snowcrash</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">LLM Security Trust Center</p>
                </div>
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Link
                    href="#models"
                    className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900/70 dark:hover:text-slate-100"
                  >
                    Models
                  </Link>
                  <Link
                    href="#about"
                    className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900/70 dark:hover:text-slate-100"
                  >
                    About
                  </Link>
                </nav>
                <ThemeToggle />
                <Button variant="outline" size="sm" className="rounded-full border-slate-200 px-4 text-xs dark:border-slate-800" asChild>
                  <Link href="mailto:security@snowcrash.ai">Report issue</Link>
                </Button>
              </div>
            </div>
          </header>
          <div className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">{children}</div>
          </div>
          <footer id="about" className="border-t border-slate-200/80 bg-white/90 py-10 text-sm text-slate-500 dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-400">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
                  Snowcrash Security Research
                </p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Shared intelligence for safer AI model integration.
                </p>
                <p className="leading-6">
                  We benchmark security controls, track advisories, and publish objective posture assessments for frontier models so teams can integrate responsibly.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Need to talk?</span>
                <a href="mailto:trust@snowcrash.ai" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">
                  trust@snowcrash.ai
                </a>
                <a href="mailto:security@snowcrash.ai" className="text-sm text-slate-500 underline-offset-4 hover:underline dark:text-slate-300">
                  security@snowcrash.ai
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
