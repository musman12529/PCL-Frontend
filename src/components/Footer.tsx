"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 shadow-[0_0_20px_-5px_rgba(168,85,247,0.6)]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16M4 12h10M4 17h16" />
              </svg>
            </span>
            <span className="text-base font-semibold text-white">
              Project <span className="text-shimmer">Management</span> Platform
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-zinc-400">
            The all-in-one platform for high-velocity teams. Plan, build and
            ship without the bloat.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#workflow" className="hover:text-white">Workflow</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Account</h4>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/register" className="hover:text-white">Create account</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Project Management Platform. All rights reserved.</p>
          <p className="font-mono">Crafted in the dark with neon &amp; caffeine.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
