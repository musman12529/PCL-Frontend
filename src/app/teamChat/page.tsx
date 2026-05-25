"use client";

import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp } from "@/components";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import "@/styles/teamChat.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatMessage = {
  content: string;
  type: string;
  user?: { id: string; name: string };
};

export default function TeamChat() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useRef<{ id: string; name: string } | null>(null);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const socket = io("https://pcl-backend-pi.vercel.app");

  const genAI = new GoogleGenerativeAI(
    "AIzaSyC4Gaf5lLcHrpTacOol8xnD4JcRSInQEYM"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "project-id": roomId || "",
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
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    socket.emit("join_room", roomId);
    socket.on("recieve_message", (msg) => {
      if (!user.current) return;
      setChat((prev) => [...prev, msg]);
    });
    socket.on("user_typing", (data) => {
      if (!user.current) return;
      setTyping((prev) =>
        data.typing
          ? [...new Set([...prev, data.user])]
          : prev.filter((u) => u !== data.user)
      );
    });
    socket.on("new_user", (newUser) => {
      if (!user.current) return;
      setChat((prev) => [
        ...prev,
        { content: `${newUser} joined`, type: "server" },
      ]);
    });
    return () => {
      socket.off("recieve_message");
      socket.off("user_typing");
      socket.off("new_user");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send_message", input, roomId);
      setInput("");
    }
  };

  const analyzeMeetingNotes = async () => {
    const notes = chat.map((m) => m.content).join("\n");
    const taskDescriptions = tasks.map((t) => t.description).join("\n");
    const combinedInput = `Chat Notes (only relevant discussions):\n${notes}\n\nExisting Tasks:\n${taskDescriptions}\n\nPlease provide only actionable insights, excluding any unrelated or off-topic conversations.`;
    setLoading(true);
    try {
      const result = await model.generateContent(combinedInput);
      const response = await result.response;
      setAnalysisResult(response.text());
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error analyzing meeting notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAnalysisResult(null);
  };

  return (
    <main className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute -top-32 left-10 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-blob delay-2s" />
      </div>

      <div className="mx-auto w-full max-w-5xl page-pad">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/80">
              Live session
            </p>
            <h1 className="section-h1 mt-1">
              Team <span className="text-shimmer">meeting</span>
            </h1>
            {roomId && (
              <p className="mt-2 text-sm text-zinc-400">
                Room <span className="font-mono text-zinc-300">{roomId}</span>
              </p>
            )}
          </div>
          {user.current && (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Joined as{" "}
              <span className="font-semibold text-white">
                {user.current.name}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-cyan-400" />
              <div className="absolute inset-2 animate-spin-slower rounded-full border-4 border-transparent border-b-violet-500" />
            </div>
          </div>
        ) : user.current ? (
          <div className="gradient-border rounded-3xl">
            <div className="glass relative flex h-[70vh] flex-col overflow-hidden rounded-3xl p-4 sm:p-6">
              <div className="relative flex-1 overflow-hidden">
                <Chat user={user.current} chat={chat} typing={typing} />
              </div>
              <div className="relative mt-2 border-t border-white/5 pt-3">
                <Inputs
                  setChat={setChat}
                  user={user.current}
                  socket={socket}
                  sendMessage={sendMessage}
                  input={input}
                  setInput={setInput}
                  roomId={roomId}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10">
            <div className="gradient-border w-full max-w-md rounded-3xl">
              <div className="glass relative overflow-hidden rounded-3xl p-8">
                <SignUp
                  user={user}
                  socket={socket}
                  input={input}
                  setInput={setInput}
                  roomId={roomId}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
          <div className="app-modal w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6 rise">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white">
                  AI
                </span>
                <h2 className="text-xl font-semibold text-white">
                  Actionable <span className="text-shimmer">insights</span>
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              {analysisResult ? (
                <ul className="space-y-2 text-sm leading-relaxed text-zinc-200">
                  {analysisResult
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((item, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-400">No insights available.</p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={analyzeMeetingNotes}
        title="Analyze Meeting Notes"
        className="group fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.7)] transition hover:scale-105 glow-pulse"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 opacity-50 blur-md group-hover:opacity-80 transition" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </main>
  );
}
