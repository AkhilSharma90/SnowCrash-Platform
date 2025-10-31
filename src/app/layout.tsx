import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileMenu } from "@/components/profile-menu";
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

const PRIMARY_NAV = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Signals", href: "/signals" },
  { label: "Datasets", href: "/datasets" },
  { label: "Supply chain", href: "/supply-chain" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Issue submission", href: "/issue-submission" },
  { label: "Bug bounty", href: "/bug-bounty" },
  { label: "Analytics", href: "/analytics" },
  { label: "API access", href: "/api-access" },
  { label: "About", href: "/about" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        <ThemeProvider>
          <header className="relative z-30 border-b border-slate-200/80 bg-white/90 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] backdrop-blur dark:border-slate-900/60 dark:bg-slate-950/70">
            <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-6 lg:px-8">
              <Link
                href="/"
                className="flex flex-col text-[11px] font-semibold uppercase leading-tight tracking-[0.28em] text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <span>Snowcrash</span>
                <span>Trust Centre</span>
              </Link>
              <nav className="flex w-full flex-wrap items-center justify-start gap-1 rounded-full border border-slate-200/70 bg-white/70 px-2 py-1.5 text-sm text-slate-500 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40 dark:text-slate-400 sm:justify-center">
                {PRIMARY_NAV.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-slate-900/5 hover:text-slate-900 dark:hover:bg-slate-900/70 dark:hover:text-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center justify-end gap-3">
                <ThemeToggle />
                <ProfileMenu />
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
