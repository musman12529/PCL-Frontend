"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority?: string;
};

const OverdueTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { status } = useSession();

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) return;
        const response = await fetch("/api/overdueTask", {
          method: "GET",
          headers: {
            "user-email": userEmail,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch overdue tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOverdueTasks();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-cyan-400" />
          <div className="absolute inset-2 animate-spin-slower rounded-full border-4 border-transparent border-b-violet-500" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated")
    return (
      <p className="px-8 py-12 text-center text-zinc-300">
        You are not logged in.
      </p>
    );

  const daysOverdue = (due: string) => {
    const now = new Date();
    const d = new Date(due);
    const diff = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-7xl page-pad">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80">
            Alert
          </p>
          <h1 className="section-h1 mt-1">
            Overdue <span className="text-shimmer">tasks</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {tasks.length} task{tasks.length === 1 ? "" : "s"} past their due
            date — let&apos;s clear them.
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="app-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-400/30">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              You&apos;re all caught up
            </h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-400">
              No overdue tasks. Take a moment to celebrate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="app-card relative flex flex-col overflow-hidden p-5"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/15 blur-2xl" />
                <div className="flex items-center justify-between">
                  <span className="badge badge-rose">OVERDUE</span>
                  <span className="text-[11px] text-zinc-500">
                    {daysOverdue(task.dueDate)} day
                    {daysOverdue(task.dueDate) === 1 ? "" : "s"} late
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {task.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  <span className="text-zinc-500">Was due</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                {task.description && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {task.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueTasks;
