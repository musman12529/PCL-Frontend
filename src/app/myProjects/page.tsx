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

type Teammate = { teammateEmail: string };

const avatarPalette = [
  "from-fuchsia-500 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-amber-400 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-rose-400 to-fuchsia-500",
];

const statusBadge = (s: string) =>
  s === "Completed" ? "badge badge-emerald" : "badge badge-amber";

const ProjectCard = ({
  project,
  onEditClick,
  onDeleteClick,
  onAddTeammatesClick,
}: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ready = project.projectName && project.dueDate && project.status;

  return (
    <div className="app-card group relative flex flex-col p-5">
      <button
        onClick={() => setIsDropdownOpen((s) => !s)}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-3 top-12 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0d1027]/95 text-sm shadow-2xl backdrop-blur">
          <button
            onClick={() => {
              onEditClick(project);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-zinc-200 hover:bg-white/5"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onAddTeammatesClick(project);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-zinc-200 hover:bg-white/5"
          >
            Add Teammates
          </button>
          <button
            onClick={() => {
              onDeleteClick(project._id);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-rose-300 hover:bg-rose-500/10"
          >
            Delete
          </button>
        </div>
      )}

      <div className="pr-10">
        <span className={statusBadge(project.status)}>
          {ready ? project.status.toUpperCase() : "LOADING"}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-white">
          {ready ? project.projectName : "Loading…"}
        </h3>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <dt className="text-zinc-500">Due</dt>
          <dd className="mt-0.5 text-zinc-200">
            {ready ? new Date(project.dueDate).toLocaleDateString() : "—"}
          </dd>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
          <dt className="text-zinc-500">Created</dt>
          <dd className="mt-0.5 text-zinc-200">
            {ready ? new Date(project.createdAt).toLocaleDateString() : "—"}
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
          project.teammateUsernames.map((username: string, index: number) => (
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
          <span className="text-xs text-zinc-500">No teammates yet</span>
        )}
      </div>

      <div className="mt-6">
        <Link href={`/MyTasks?id=${project._id}`}>
          <button className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold">
            Open
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const { status, data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    projectName: "",
    status: "In progress",
    dueDate: "",
  });
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [isTeammatesModalOpen, setIsTeammatesModalOpen] = useState(false);

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
            const teammateNames = await Promise.all(
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
            return { ...project, teammateUsernames: teammateNames };
          })
        );
        setProjects(enhancedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [session]);

  const handleAddProject = async () => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) return;
    try {
      const response = await fetch("/api/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail,
        },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) throw new Error("Failed to create project");
      const data = await response.json();
      setProjects((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewProject({ projectName: "", status: "In progress", dueDate: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProject = async () => {
    if (!currentProject) return;
    const updatedProject = {
      ...currentProject,
      projectName: newProject.projectName,
      status: newProject.status,
      dueDate: newProject.dueDate,
    };
    try {
      const response = await fetch("/api/updateProject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          id: currentProject._id,
        },
        body: JSON.stringify(updatedProject),
      });
      if (response.ok) {
        const data = await response.json();
        setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentProject(null);
      } else throw new Error("Failed to update project");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/deleteProject?id=${projectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      }
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const openEditModal = (project: Project) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setCurrentProject(project);
    setNewProject({
      projectName: project.projectName,
      status: project.status,
      dueDate: project.dueDate,
    });
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setNewProject({ projectName: "", status: "In progress", dueDate: "" });
  };

  const fetchTeammates = async () => {
    try {
      const userEmail = localStorage.getItem("email");
      const response = await fetch("/api/getTeammate", {
        method: "GET",
        headers: {
          "user-email": userEmail || "",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch teammates");
      const data = await response.json();
      setTeammates(data);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleAddTeammates = async () => {
    if (!currentProject) return;
    const projectId = currentProject._id;
    try {
      const response = await fetch("/api/addProjectTeammate", {
        method: "PUT",
        headers: { id: projectId, "Content-Type": "application/json" },
        body: JSON.stringify({ teammateEmail: selectedTeammates }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Something went wrong");
        return;
      }
      const updatedProject = await response.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
      );
      setIsTeammatesModalOpen(false);
      setSelectedTeammates([]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleTeammatesModalOpen = (project: Project) => {
    setCurrentProject(project);
    fetchTeammates();
    setIsTeammatesModalOpen(true);
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
        <div className="absolute -top-32 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-7xl page-pad">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/80">
              Workspace
            </p>
            <h1 className="section-h1 mt-1">
              Your <span className="text-shimmer">projects</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {projects.length} project{projects.length === 1 ? "" : "s"} in
              your workspace
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="app-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/30">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7h6v10H3zM10 7h11v4H10zM10 13h11v4H10z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">
              No projects yet
            </h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-400">
              Spin up your first project and start shipping today.
            </p>
            <button
              onClick={openAddModal}
              className="btn-neon mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
            >
              Create project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEditClick={openEditModal}
                onDeleteClick={handleDeleteProject}
                onAddTeammatesClick={handleTeammatesModalOpen}
              />
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-md rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {isEditMode ? "Edit" : "New"}{" "}
                  <span className="text-shimmer">project</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                    Project name
                  </label>
                  <input
                    type="text"
                    value={newProject.projectName}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        projectName: e.target.value,
                      })
                    }
                    className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                    placeholder="e.g. Sprint 24"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                      Due date
                    </label>
                    <input
                      type="date"
                      value={
                        newProject.dueDate
                          ? newProject.dueDate.toString().slice(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          dueDate: e.target.value,
                        })
                      }
                      className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                      Status
                    </label>
                    <select
                      value={newProject.status}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          status: e.target.value,
                        })
                      }
                      className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                    >
                      <option value="In progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={isEditMode ? handleEditProject : handleAddProject}
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  {isEditMode ? "Save changes" : "Create project"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isTeammatesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-md rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Add <span className="text-shimmer">teammates</span>
                </h3>
                <button
                  onClick={() => setIsTeammatesModalOpen(false)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {teammates.length === 0 && (
                  <p className="text-sm italic text-zinc-500">
                    No teammates available. Add some on the Team page first.
                  </p>
                )}
                {teammates.map((teammate) => {
                  const checked = selectedTeammates.includes(
                    teammate.teammateEmail
                  );
                  return (
                    <label
                      key={teammate.teammateEmail}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                        checked
                          ? "border-fuchsia-400/40 bg-fuchsia-500/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const email = teammate.teammateEmail;
                          setSelectedTeammates((prev) =>
                            e.target.checked
                              ? [...prev, email]
                              : prev.filter((em) => em !== email)
                          );
                        }}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-fuchsia-500 focus:ring-fuchsia-500"
                      />
                      {teammate.teammateEmail}
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsTeammatesModalOpen(false)}
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeammates}
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Add teammates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
