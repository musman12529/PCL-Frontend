"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Project = {
  _id: string;
  projectName: string;
  dueDate: string;
  status: string;
  userEmail: string;
  createdAt: string;
  assignedTo: string[];
  teammateUsernames?: string[];
};

const avatarPalette = [
  "from-fuchsia-500 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-amber-400 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-rose-400 to-fuchsia-500",
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="app-card group relative flex flex-col p-5">
      <span className="badge badge-emerald w-fit">
        {project.status.toUpperCase()}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-white">
        {project.projectName}
      </h3>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <dt className="text-zinc-500">Due</dt>
          <dd className="mt-0.5 text-zinc-200">
            {new Date(project.dueDate).toLocaleDateString()}
          </dd>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <dt className="text-zinc-500">Created</dt>
          <dd className="mt-0.5 text-zinc-200">
            {new Date(project.createdAt).toLocaleDateString()}
          </dd>
        </div>
        <div className="col-span-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <dt className="text-zinc-500">Owner</dt>
          <dd className="mt-0.5 truncate text-zinc-200">{project.userEmail}</dd>
        </div>
      </dl>

      <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <p className="text-xs uppercase tracking-wider text-zinc-500">
        Assigned teammates
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.teammateUsernames && project.teammateUsernames.length > 0 ? (
          project.teammateUsernames.map((username, index) => (
            <div
              key={index}
              className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${
                avatarPalette[index % avatarPalette.length]
              } text-xs font-bold text-white ring-2 ring-[#070815]`}
            >
              {username.charAt(0).toUpperCase()}
              <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0d1027] px-2 py-1 text-[10px] text-white group-hover:block">
                {username}
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-zinc-500">No teammates</span>
        )}
      </div>

      <div className="mt-6">
        <Link href={`/MyTasks?id=${project._id}`}>
          <button className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium">
            View tasks
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

const CompletedProjectsPage = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) return;
      try {
        const response = await fetch("/api/getProject", {
          method: "GET",
          headers: {
            "user-email": userEmail,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const projectsData = await response.json();

        const enhancedProjects: Project[] = await Promise.all(
          projectsData.map(async (project: Project) => {
            const teammates = await Promise.all(
              (project.assignedTo || []).map(async (email) => {
                try {
                  const r = await fetch("/api/getUsername", {
                    method: "GET",
                    headers: { "user-email": email },
                  });
                  if (!r.ok) throw new Error("Failed to fetch username");
                  const { username } = await r.json();
                  return username;
                } catch (err) {
                  console.error(`Error fetching username for ${email}:`, err);
                  return "Unknown";
                }
              })
            );
            return { ...project, teammateUsernames: teammates };
          })
        );
        setProjects(enhancedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [session]);

  const completed = projects.filter((p) => p.status === "Completed");

  return (
    <div className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-7xl page-pad">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
            Archive
          </p>
          <h1 className="section-h1 mt-1">
            Completed <span className="text-shimmer">projects</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {completed.length} shipped — nice work.
          </p>
        </div>

        {completed.length === 0 ? (
          <div className="app-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-400/30">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Nothing shipped yet
            </h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-400">
              Once a project is marked completed, it will live here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {completed.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedProjectsPage;
