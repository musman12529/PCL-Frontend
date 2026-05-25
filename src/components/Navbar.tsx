"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import SlidingMenu from "./SlidingMenu";

const Navbar = () => {
  const { data: session }: any = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("email"));
    }
  }, [session]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#070815]/70 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_0_25px_-5px_rgba(168,85,247,0.7)]">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 blur-md opacity-60 group-hover:opacity-90 transition" />
            <svg
              viewBox="0 0 24 24"
              className="relative h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M4 12h10M4 17h16" />
            </svg>
          </span>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Project <span className="text-shimmer">Management</span> Platform
          </span>
          <span className="text-lg font-semibold tracking-tight text-white sm:hidden">
            <span className="text-shimmer">PMP</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
          >
            Home
          </Link>
          <a
            href="#features"
            className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
          >
            Workflow
          </a>
          <a
            href="#pricing"
            className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm text-zinc-200 hover:text-white sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-neon inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              >
                Get started
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-zinc-300 sm:inline">
                {email || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: `/` })}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
              <SlidingMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
