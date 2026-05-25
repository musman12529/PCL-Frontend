"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type Task = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low" | string;
  status: "pending" | "in-progress" | "completed" | string;
  assignedTo?: string[];
};

const priorityBadge = (p: string) => {
  const pUp = (p || "").toUpperCase();
  if (pUp === "HIGH") return "badge badge-rose";
  if (pUp === "MEDIUM") return "badge badge-amber";
  if (pUp === "LOW") return "badge badge-emerald";
  return "badge badge-zinc";
};

const statusBadge = (s: string) => {
  if (s === "pending") return "badge badge-cyan";
  if (s === "in-progress") return "badge badge-amber";
  if (s === "completed") return "badge badge-emerald";
  return "badge badge-zinc";
};

const avatarColors = [
  "from-fuchsia-500 to-pink-500",
  "from-cyan-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-amber-400 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-rose-400 to-fuchsia-500",
];

const TaskCard = ({
  task,
  onEditClick,
  onDeleteClick,
  onHistoryClick,
  isList,
}: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="app-card group relative p-4">
      <button
        onClick={() => setIsDropdownOpen((s) => !s)}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
        aria-label="open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="currentColor"
        >
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-2 top-10 z-20 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#0d1027]/95 text-sm shadow-2xl backdrop-blur">
          <button
            onClick={() => {
              onEditClick(task);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-zinc-200 hover:bg-white/5"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onHistoryClick(task._id);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-zinc-200 hover:bg-white/5"
          >
            History
          </button>
          <button
            onClick={() => {
              onDeleteClick(task._id);
              setIsDropdownOpen(false);
            }}
            className="block w-full px-4 py-2 text-left text-rose-300 hover:bg-rose-500/10"
          >
            Delete
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pr-10">
        <span className={priorityBadge(task.priority)}>
          {(task.priority || "").toUpperCase()} PRIORITY
        </span>
        {isList && (
          <span className={statusBadge(task.status)}>
            {(task.status || "").toUpperCase()}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-base font-semibold text-white">{task.title}</h3>
      <p className="mt-1 text-xs text-zinc-400">
        <span className="text-zinc-500">Due</span>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
      </p>
      {task.description && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          {task.description}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        {Array.isArray(task.assignedTo) &&
          task.assignedTo.map((initials: string, index: number) => (
            <span
              key={index}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${
                avatarColors[index % avatarColors.length]
              } text-xs font-semibold text-white ring-2 ring-[#070815]`}
              title={initials}
            >
              {initials}
            </span>
          ))}
      </div>
    </div>
  );
};

const TaskColumn = ({
  title,
  color,
  tasks,
  onEditClick,
  onDeleteClick,
  onHistoryClick,
}: any) => {
  const dotColor =
    color === "blue"
      ? "bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]"
      : color === "yellow"
      ? "bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.6)]"
      : color === "green"
      ? "bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]"
      : "bg-zinc-400";

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
          {title}
        </h2>
        <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur">
        <div className="flex flex-col gap-4">
          {tasks.length > 0 ? (
            tasks.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onHistoryClick={onHistoryClick}
                isList={false}
              />
            ))
          ) : (
            <p className="text-sm italic text-zinc-500">No tasks here yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean;
    history: any[];
  }>({ isOpen: false, history: [] });

  const { status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<"Board" | "List">("Board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: [] as string[],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "project-id": id || "",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, [id]);

  const handleAddTask = async () => {
    try {
      const response = await fetch("/api/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "project-id": id || "",
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error("Failed to add task");
      const data = await response.json();
      setTasks((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: [],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTask = async () => {
    try {
      const _id = selectedTask._id;
      const response = await fetch("/api/updateTask/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", id: _id },
        body: JSON.stringify(selectedTask),
      });
      if (!response.ok) throw new Error("Failed to edit task");
      const data = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === data._id ? { ...t, ...data } : t))
      );
      setIsEditing(false);
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditing(true);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/deleteTask/`, {
        method: "DELETE",
        headers: { id },
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleHistoryClick = async (taskId: string) => {
    try {
      const response = await fetch(`/api/history`, {
        method: "GET",
        headers: { id: taskId },
      });
      if (!response.ok) throw new Error("Failed to fetch task history");
      const history = await response.json();
      setHistoryModal({ isOpen: true, history });
    } catch (error) {
      console.error(error);
    }
  };

  const closeHistoryModal = () =>
    setHistoryModal({ isOpen: false, history: [] });

  const pendingTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "pending")
    : [];
  const inProgressTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "in-progress")
    : [];
  const completedTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "completed")
    : [];

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

  return (
    <div className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-7xl page-pad">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/80">
              Workspace
            </p>
            <h1 className="section-h1 mt-1">
              Your <span className="text-shimmer">tasks</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              <button
                onClick={() => setView("Board")}
                className={`rounded-full px-4 py-1.5 transition ${
                  view === "Board"
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setView("List")}
                className={`rounded-full px-4 py-1.5 transition ${
                  view === "List"
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                List
              </button>
            </div>
            <Link href={`/teamChat?id=${id}`}>
              <button className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 21l1.8-5A7.8 7.8 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Meeting
              </button>
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-neon inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Task
            </button>
          </div>
        </div>

        {view === "Board" ? (
          <div className="grid gap-6 md:grid-cols-3">
            <TaskColumn
              title="Pending"
              color="blue"
              tasks={pendingTasks}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteTask}
              onHistoryClick={handleHistoryClick}
            />
            <TaskColumn
              title="In-Progress"
              color="yellow"
              tasks={inProgressTasks}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteTask}
              onHistoryClick={handleHistoryClick}
            />
            <TaskColumn
              title="Completed"
              color="green"
              tasks={completedTasks}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteTask}
              onHistoryClick={handleHistoryClick}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  isList
                  key={task._id}
                  task={task}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteTask}
                  onHistoryClick={handleHistoryClick}
                />
              ))
            ) : (
              <p className="italic text-zinc-500">No tasks available.</p>
            )}
          </div>
        )}

        {/* History Modal */}
        {historyModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-lg rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Task <span className="text-shimmer">History</span>
                </h3>
                <button
                  onClick={closeHistoryModal}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              {historyModal.history.length > 0 ? (
                <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {historyModal.history.map((item: any, index: number) => (
                    <li
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300"
                    >
                      <p>
                        <span className="text-zinc-500">Title:</span>{" "}
                        <span className="text-white">{item.title}</span>
                      </p>
                      <p>
                        <span className="text-zinc-500">Description:</span>{" "}
                        {item.description}
                      </p>
                      <p>
                        <span className="text-zinc-500">Priority:</span>{" "}
                        {item.priority}
                      </p>
                      <p>
                        <span className="text-zinc-500">Status:</span>{" "}
                        {item.status}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Updated{" "}
                        {new Date(item.updatedAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-400">No history available.</p>
              )}
              <button
                onClick={closeHistoryModal}
                className="btn-neon mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-lg rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Add new <span className="text-shimmer">task</span>
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
                <input
                  type="text"
                  className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <textarea
                  className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Description"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                  <select
                    className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
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
                  onClick={handleAddTask}
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Add task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {isEditing && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
            <div className="app-modal w-full max-w-lg rounded-2xl p-6 rise">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Edit <span className="text-shimmer">task</span>
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Task title"
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                />
                <textarea
                  className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Description"
                  rows={3}
                  value={selectedTask.description}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  value={
                    selectedTask.dueDate
                      ? selectedTask.dueDate.toString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      dueDate: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedTask.priority}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        priority: e.target.value,
                      })
                    }
                    className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: e.target.value,
                      })
                    }
                    className="neon-input w-full rounded-xl px-3 py-2.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTask}
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
