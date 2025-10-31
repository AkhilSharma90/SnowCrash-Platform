"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const USER_PROFILE = {
  name: "Akhil Sharma",
  email: "akhil@snowcrash.ai",
  role: "Security Lead",
  location: "San Francisco, USA",
};

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/40",
          open ? "ring-2 ring-indigo-500/40 ring-offset-2 ring-offset-white dark:ring-offset-slate-950" : "",
        )}
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <ProfileAvatar name={USER_PROFILE.name} />
          <span className="hidden sm:flex sm:flex-col">
            <span className="font-semibold text-slate-900 dark:text-white">{USER_PROFILE.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{USER_PROFILE.role}</span>
          </span>
        </span>
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white/95 p-4 text-sm text-slate-600 shadow-[0_24px_48px_rgba(15,23,42,0.18)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <ProfileAvatar name={USER_PROFILE.name} size="lg" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{USER_PROFILE.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{USER_PROFILE.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{USER_PROFILE.location}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <nav className="space-y-1">
            <ProfileLink href="/account/profile" label="Profile overview" description="Update contact info, organisation context." />
            <ProfileLink href="/account/settings" label="Account settings" description="Regional preferences, notifications, API keys." />
            <ProfileLink href="/account/security" label="Password & security" description="Rotate secrets, configure MFA, review sessions." />
            <ProfileLink href="/account/preferences" label="Workspace preferences" description="Theme, beta features, personalised digests." />
          </nav>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Programme status</p>
              <p>Enterprise · Joined Mar 2024 · Tier: Gold</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="w-full rounded-full"
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(" ")
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const baseClasses =
    size === "lg"
      ? "h-12 w-12 text-base"
      : "h-9 w-9 text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 font-semibold text-white shadow-inner",
        baseClasses,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

interface ProfileLinkProps {
  href: string;
  label: string;
  description: string;
}

function ProfileLink({ href, label, description }: ProfileLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-slate-900 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-950/40 dark:hover:text-white"
    >
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </Link>
  );
}
