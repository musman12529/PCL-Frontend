"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: (
      <path d="M3 11l9-8 9 8M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10" />
    ),
  },
  {
    href: "/myProjects",
    label: "Projects",
    icon: <path d="M3 7h6v10H3zM10 7h11v4H10zM10 13h11v4H10z" />,
  },
  {
    href: "/myTeam",
    label: "Team",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 8v6M23 11h-6" />
      </>
    ),
  },
  {
    href: "/completedProject",
    label: "Completed",
    icon: <path d="M20 6L9 17l-5-5" />,
  },
  {
    href: "/overdueTask",
    label: "Overdue",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </>
    ),
  },
];

const SlidingMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100 app-overlay"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[320px] transform border-l border-white/10 bg-[#0a0b1e]/90 backdrop-blur-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Workspace
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                <span className="text-shimmer">Quick</span> navigation
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-full"
              aria-label="Close menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "border border-fuchsia-400/30 bg-fuchsia-500/10 text-white"
                      : "border border-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.7)]"
                        : "bg-white/5 text-zinc-300 group-hover:bg-white/10"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_2px_rgba(232,121,249,0.7)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/5 pt-6 text-center text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} Project Management Platform
          </div>
        </div>
      </aside>
    </>
  );
};

export default SlidingMenu;
