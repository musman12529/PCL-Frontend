"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agree, setAgree] = useState(true);
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/MyTasks");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (val: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(val);
  };

  const isValidUsername = (val: string) => val.length >= 3;

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0-4
  }, [password]);

  const strengthMeta = [
    { label: "Too weak", color: "from-rose-500 to-rose-400", w: "w-1/5" },
    { label: "Weak", color: "from-orange-500 to-amber-400", w: "w-2/5" },
    { label: "Okay", color: "from-amber-400 to-yellow-300", w: "w-3/5" },
    { label: "Strong", color: "from-lime-400 to-emerald-400", w: "w-4/5" },
    { label: "Excellent", color: "from-emerald-400 to-cyan-400", w: "w-full" },
  ][Math.min(strength, 4)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidUsername(username)) {
      setError("Username must be at least 3 characters long");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!agree) {
      setError("You need to agree to the Terms to continue");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.log(err);
    } finally {
      setLoading(false);
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
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl animate-blob" />
        <div className="absolute top-40 left-0 h-80 w-80 rounded-full bg-fuchsia-600/25 blur-3xl animate-blob delay-2s" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-violet-700/25 blur-3xl animate-blob delay-4s" />
        <div className="absolute inset-0 noise" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
        {/* Left: form */}
        <div className="mx-auto w-full max-w-md rise">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>

          <div className="gradient-border rounded-3xl">
            <div className="glass relative overflow-hidden rounded-3xl p-8">
              <div className="pointer-events-none absolute -top-24 -left-10 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  <span className="h-px w-6 bg-zinc-700" />
                  Create account
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Join the <span className="text-shimmer">future</span> of work
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Already with us?{" "}
                  <Link href="/login" className="text-cyan-300 hover:text-white">
                    Sign in
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-zinc-300">
                      Username
                    </span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="neon-input w-full rounded-xl py-3 pl-10 pr-3 text-sm"
                        placeholder="superdev"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </label>

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
                    <span className="mb-1.5 block text-xs font-medium text-zinc-300">
                      Password
                    </span>
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
                        placeholder="At least 8 characters"
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

                    {/* Strength meter */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full bg-gradient-to-r ${strengthMeta.color} ${
                            password ? strengthMeta.w : "w-0"
                          } transition-all duration-300`}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Password strength</span>
                        <span
                          className={
                            strength <= 1
                              ? "text-rose-300"
                              : strength === 2
                              ? "text-amber-300"
                              : strength === 3
                              ? "text-lime-300"
                              : "text-emerald-300"
                          }
                        >
                          {password ? strengthMeta.label : "—"}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 pt-1 text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="text-zinc-200 underline decoration-dotted hover:text-white">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-zinc-200 underline decoration-dotted hover:text-white">
                        Privacy Policy
                      </a>
                      .
                    </span>
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
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right: showcase */}
        <div className="hidden flex-col gap-8 lg:flex rise rise-2">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Spin up your workspace
            <br />
            in <span className="text-shimmer">60 seconds.</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-300">
            One account, infinite projects, zero setup. Invite your team and
            you&apos;re already shipping.
          </p>

          <ul className="mt-2 space-y-4">
            {[
              {
                t: "Free forever for small teams",
                d: "Up to 5 seats, unlimited tasks, unlimited projects.",
              },
              {
                t: "Bring your stack",
                d: "GitHub, Slack, Linear, Figma, Stripe — all wired in.",
              },
              {
                t: "AI from day one",
                d: "Summarize standups, draft updates, auto-prioritize backlog.",
              },
              {
                t: "Bank-grade security",
                d: "SOC2, SSO, SCIM and region pinning. Your data stays yours.",
              },
            ].map((f) => (
              <li
                key={f.t}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur transition hover:bg-white/[0.05]"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/80 to-cyan-400/80 text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.6)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{f.t}</div>
                  <div className="text-sm text-zinc-400">{f.d}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5">
            <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-2xl" />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white">
                AI
              </span>
              <div className="text-sm">
                <div className="font-semibold text-white">AI Copilot</div>
                <div className="text-zinc-400">
                  Ready to help on day one — yes, even on the free plan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
