"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const [email, setEmail] = useState("testing@gmail.com");
  const [password, setPassword] = useState("testing@gmail.com");
  const [showPwd, setShowPwd] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const isValidEmail = (val: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      setLoading(false);
      return;
    }
    if (!password || password.length < 8) {
      setError("Password is invalid");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("email", email);
    }

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      setError("");
      setLoading(false);
      if (res?.url) router.replace("/");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-cyan-400" />
          <div className="absolute inset-2 animate-spin-slower rounded-full border-4 border-transparent border-b-violet-500" />
        </div>
      </div>
    );
  }

  if (sessionStatus === "authenticated") return null;

  return (
    <div className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background fx */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-fuchsia-600/30 blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl animate-blob delay-2s" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-700/25 blur-3xl animate-blob delay-4s" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* Toast */}
      {showNotification && (
        <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rise">
          <div className="gradient-border rounded-full">
            <div className="flex items-center gap-3 rounded-full bg-[#0a0b1e] px-5 py-2.5 text-sm text-zinc-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]" />
              Demo credentials are pre-filled. Just hit Sign in.
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        {/* Left: hero panel */}
        <div className="hidden flex-col gap-8 lg:flex rise">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Welcome back.
            <br />
            <span className="text-shimmer">Let&apos;s build.</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-300">
            Pick up where you left off. Your boards, sprints and AI threads are
            already warming up.
          </p>

          {/* Stat card */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { v: "12.4k", l: "teams" },
              { v: "1.2M", l: "tasks shipped" },
              { v: "99.99%", l: "uptime" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-semibold text-white">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Quote card */}
          <div className="rise rise-3 relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-2xl" />
            <p className="text-zinc-200">
              <span className="text-2xl text-fuchsia-400">&ldquo;</span>
              The first project tool that actually feels like an extension of
              the team. Velocity is way up.
              <span className="text-2xl text-cyan-400">&rdquo;</span>
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-block h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
              <div>
                <div className="text-sm font-semibold text-white">Lina Park</div>
                <div className="text-xs text-zinc-400">Head of Eng · Orbital</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="mx-auto w-full max-w-md rise rise-2">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>

          <div className="gradient-border rounded-3xl">
            <div className="glass relative overflow-hidden rounded-3xl p-8">
              <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  <span className="h-px w-6 bg-zinc-700" />
                  Sign in
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-fuchsia-300 hover:text-white">
                    Create one
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-zinc-300">
                      Email address
                    </span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 6h16v12H4z" />
                          <path d="M4 6l8 7 8-7" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="neon-input w-full rounded-xl py-3 pl-10 pr-3 text-sm"
                        placeholder="you@team.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-300">
                        Password
                      </span>
                      <button
                        type="button"
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="10" rx="2" />
                          <path d="M7 11V8a5 5 0 0110 0v3" />
                        </svg>
                      </span>
                      <input
                        type={showPwd ? "text" : "password"}
                        className="neon-input w-full rounded-xl py-3 pl-10 pr-12 text-sm"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-white"
                      >
                        {showPwd ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.77 19.77 0 014.16-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.77 19.77 0 01-3.16 4.66M1 1l22 22" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-neon flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign in
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    new here?
                  </span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <Link
                  href="/register"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  Create an account
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            By signing in you agree to our{" "}
            <a className="underline decoration-dotted hover:text-white" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="underline decoration-dotted hover:text-white" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
