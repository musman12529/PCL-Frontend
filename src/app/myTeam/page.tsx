"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Teammate = {
  teammateEmail: string;
  username?: string;
  role?: string;
  status?: string;
};

const avatarPalette = [
  "from-fuchsia-500 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-amber-400 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-rose-400 to-fuchsia-500",
];

const TeamsPage = () => {
  const { status } = useSession();
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teammateEmail, setTeammateEmail] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchTeammates = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) return;
        const response = await fetch("/api/getTeammate", {
          method: "GET",
          headers: {
            "user-email": userEmail,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch teammates");
        const teammatesData = await response.json();
        const enhanced = await Promise.all(
          teammatesData.map(async (teammate: Teammate) => {
            try {
              const r = await fetch("/api/getUsername", {
                method: "GET",
                headers: { "user-email": teammate.teammateEmail },
              });
              if (!r.ok) throw new Error();
              const usernameData = await r.json();
              return { ...teammate, username: usernameData.username };
            } catch {
              return { ...teammate, username: "Unknown" };
            }
          })
        );
        setTeammates(enhanced);
      } catch (err) {
        console.error("Error fetching teammates:", err);
      }
    };
    fetchTeammates();
  }, []);

  const handleAddTeammate = async () => {
    setError("");
    if (!teammateEmail) {
      setError("Enter an email first");
      return;
    }
    try {
      setAdding(true);
      const userEmail = localStorage.getItem("email");
      const response = await fetch("/api/addTeammate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail || "",
        },
        body: JSON.stringify({ teammateEmail }),
      });
      if (!response.ok) throw new Error("Email does not exist");
      const data = await response.json();
      setTeammates((prev) => [...prev, data]);
      setIsModalOpen(false);
      setTeammateEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error adding teammate:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteTeammate = async (email: string) => {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await fetch("/api/deleteTeammate", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail || "",
          "teammate-email": email,
        },
      });
      if (!response.ok) throw new Error("Failed to delete teammate");
      setTeammates((prev) => prev.filter((t) => t.teammateEmail !== email));
    } catch (err: any) {
      alert(err.message);
      console.error("Error deleting teammate:", err);
    }
  };

  if (status === "unauthenticated")
    return (
      <p className="px-8 py-12 text-center text-zinc-300">
        You are not logged in.
      </p>
    );

  return (
    <div className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-7xl page-pad">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/80">
              Workspace
            </p>
            <h1 className="section-h1 mt-1">
              Your <span className="text-shimmer">team</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {teammates.length} member{teammates.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            Add teammate
          </button>
        </div>

        {teammates.length === 0 ? (
          <div className="app-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/30">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              No teammates yet
            </h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-400">
              Build your team and start collaborating.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-neon mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
            >
              Invite first teammate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teammates.map((teammate, idx) => (
              <div key={idx} className="app-card flex flex-col p-5">
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                      avatarPalette[idx % avatarPalette.length]
                    } text-base font-bold text-white ring-2 ring-[#070815]`}
                  >
                    {(teammate.username || teammate.teammateEmail)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-white">
                      {teammate.username || "—"}
                    </h2>
                    <p className="truncate text-xs text-zinc-400">
                      {teammate.teammateEmail}
                    </p>
                  </div>
                  <span className="badge badge-emerald">Active</span>
                </div>

                <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                    <dt className="text-zinc-500">Role</dt>
                    <dd className="mt-0.5 text-zinc-200">
                      {teammate.role || "Member"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                    <dt className="text-zinc-500">Status</dt>
                    <dd className="mt-0.5 text-zinc-200">
                      {teammate.status || "Active"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => handleDeleteTeammate(teammate.teammateEmail)}
                    className="btn-danger inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-md rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Invite a <span className="text-shimmer">teammate</span>
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                  }}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Teammate email
              </label>
              <input
                type="email"
                placeholder="them@team.com"
                value={teammateEmail}
                onChange={(e) => setTeammateEmail(e.target.value)}
                className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
              />
              {error && (
                <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                  }}
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeammate}
                  disabled={adding}
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {adding ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Adding…
                    </>
                  ) : (
                    "Add teammate"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
