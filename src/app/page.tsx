import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* ------- Background fx ------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="absolute -top-40 -left-32 h-[480px] w-[480px] rounded-full bg-fuchsia-600/30 blur-3xl animate-blob" />
        <div className="absolute -top-20 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/25 blur-3xl animate-blob delay-2s" />
        <div className="absolute top-[40rem] left-1/3 h-[520px] w-[520px] rounded-full bg-violet-700/25 blur-3xl animate-blob delay-4s" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* ============== HERO ============== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="rise text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              v2.0 — AI assisted workflows are live
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ship projects at the
              <br />
              <span className="text-shimmer">speed of thought.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
              The all-in-one Project Management Platform for high-velocity
              teams. Tasks, sprints, chat and AI in one calm, focused workspace.
              No bloat. No tabs. Just flow.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="btn-neon inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
              >
                Start free
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 17l5-5-5-5M4 12h11" />
                </svg>
                Sign in
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-zinc-400">
              <div className="flex -space-x-2">
                {[
                  "from-fuchsia-500 to-pink-500",
                  "from-cyan-400 to-blue-500",
                  "from-lime-400 to-emerald-500",
                  "from-amber-400 to-orange-500",
                ].map((c, i) => (
                  <span
                    key={i}
                    className={`inline-block h-8 w-8 rounded-full bg-gradient-to-br ${c} ring-2 ring-[#070815]`}
                  />
                ))}
              </div>
              <span>
                <span className="font-semibold text-white">12,400+</span> teams
                shipping faster
              </span>
            </div>
          </div>

          {/* ------- Right: app mockup card ------- */}
          <div className="relative rise rise-2">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/30 via-violet-500/20 to-cyan-400/30 blur-2xl" />
            <div className="gradient-border rounded-3xl">
              <div className="glass rounded-3xl p-5 sm:p-6">
                {/* fake window chrome */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="rounded-md bg-white/5 px-3 py-1 text-xs text-zinc-400">
                    project-platform / sprint-24
                  </div>
                  <div className="text-xs text-zinc-500">⌘K</div>
                </div>

                {/* kanban columns */}
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  {[
                    {
                      name: "Backlog",
                      color: "bg-zinc-400",
                      tasks: [
                        { t: "Design auth flow", tag: "Design", pri: "low" },
                        { t: "Audit Stripe webhook", tag: "Billing", pri: "med" },
                      ],
                    },
                    {
                      name: "In Progress",
                      color: "bg-amber-400",
                      tasks: [
                        { t: "Realtime chat sockets", tag: "Backend", pri: "high" },
                        { t: "Refactor Navbar", tag: "Frontend", pri: "med" },
                        { t: "AI summary chips", tag: "AI", pri: "high" },
                      ],
                    },
                    {
                      name: "Shipped",
                      color: "bg-emerald-400",
                      tasks: [
                        { t: "OAuth onboarding", tag: "Auth", pri: "low" },
                        { t: "Dark mode v2", tag: "UI", pri: "med" },
                      ],
                    },
                  ].map((col, idx) => (
                    <div key={col.name} className="rounded-xl bg-white/[0.03] p-3">
                      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-zinc-300">
                        <span className={`h-2 w-2 rounded-full ${col.color}`} />
                        {col.name}
                      </div>
                      <div className="space-y-2">
                        {col.tasks.map((task, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border border-white/5 bg-[#0b0d1f]/80 p-3 ${
                              idx === 1 && i === 0 ? "animate-float" : ""
                            }`}
                          >
                            <div className="text-[13px] font-medium text-white">
                              {task.t}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
                                {task.tag}
                              </span>
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  task.pri === "high"
                                    ? "bg-rose-400"
                                    : task.pri === "med"
                                    ? "bg-amber-400"
                                    : "bg-zinc-500"
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* mini AI bar */}
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-xs font-bold text-white">
                    AI
                  </span>
                  <div className="flex-1">
                    <div className="h-2 w-3/4 rounded-full bg-white/10" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-white/5" />
                  </div>
                  <button className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">
                    Summarize
                  </button>
                </div>
              </div>
            </div>

            {/* floating stat chips */}
            <div className="absolute -right-4 -top-4 hidden rounded-2xl border border-white/10 bg-[#0a0b1e]/90 px-4 py-3 text-sm shadow-xl backdrop-blur lg:block animate-float">
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                Throughput
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-white">
                <span className="text-lg font-semibold">+42%</span>
                <span className="text-emerald-400 text-xs">▲ this sprint</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/10 bg-[#0a0b1e]/90 px-4 py-3 text-sm shadow-xl backdrop-blur lg:block animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">
                On-time delivery
              </div>
              <div className="mt-0.5 text-white text-lg font-semibold">
                98.6%
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ============== FEATURES ============== */}
      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">
            Why this platform
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything your team needs.
            <br />
            <span className="text-shimmer">Nothing it doesn&apos;t.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Real-time boards",
              desc: "Drag, drop, ship. Boards sync across the whole team in milliseconds with no refresh.",
              icon: (
                <path d="M3 7h6v10H3zM10 7h11v4H10zM10 13h11v4H10z" />
              ),
              g: "from-fuchsia-500/30 to-pink-500/10",
            },
            {
              title: "AI co-pilot",
              desc: "Summarize threads, draft updates, auto-tag tasks. Your AI teammate that never sleeps.",
              icon: (
                <path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2M12 8a4 4 0 100 8 4 4 0 000-8z" />
              ),
              g: "from-cyan-400/30 to-blue-500/10",
            },
            {
              title: "Team chat baked in",
              desc: "No more context-switching to Slack. Threads attached to every task and project.",
              icon: (
                <path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-5A7.8 7.8 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              ),
              g: "from-violet-500/30 to-indigo-500/10",
            },
            {
              title: "Sprint analytics",
              desc: "See velocity, burndown and bottlenecks at a glance. Decisions backed by data.",
              icon: (
                <path d="M3 3v18h18M7 15l4-4 4 4 6-6" />
              ),
              g: "from-emerald-400/30 to-teal-500/10",
            },
            {
              title: "Lightning fast",
              desc: "Built on the edge. Sub-100ms interactions worldwide. It feels like local.",
              icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
              g: "from-amber-400/30 to-orange-500/10",
            },
            {
              title: "Enterprise grade",
              desc: "SSO, SCIM, audit logs, region pinning. Security-first from the foundation up.",
              icon: (
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              ),
              g: "from-rose-400/30 to-fuchsia-500/10",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${f.g} blur-2xl opacity-0 group-hover:opacity-100 transition`}
              />
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== WORKFLOW STEPS ============== */}
      <section id="workflow" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            From idea to <span className="text-shimmer">production</span> in three moves.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Plan",
              d: "Capture ideas, group them into sprints, assign owners with one click.",
            },
            {
              n: "02",
              t: "Build",
              d: "Live boards, threaded discussions and AI summaries keep everyone in sync.",
            },
            {
              n: "03",
              t: "Ship",
              d: "Mark it shipped. Auto-generate release notes. Celebrate (or move on).",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8"
            >
              <div className="text-6xl font-bold tracking-tighter text-white/10">
                {s.n}
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-zinc-400">{s.d}</p>
              <div className="pointer-events-none absolute right-6 top-6 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_20px_4px_rgba(232,121,249,0.55)]" />
            </div>
          ))}
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0d1027] via-[#11122b] to-[#0d1027] p-10 sm:p-16">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your team, but <span className="text-shimmer">10x</span>.
              </h3>
              <p className="mt-3 max-w-xl text-zinc-300">
                Free for the first 5 seats. No credit card. Set it up in under
                two minutes.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="btn-neon inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
