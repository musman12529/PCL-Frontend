const SignUp = ({ user, socket, input, setInput, roomId }: any) => {
  const addUser = () => {
    user.current = { name: input, id: socket.id };
    socket.emit("new_user", { user: input });
    socket.emit("join_room", roomId);
    setInput("");
  };

  return (
    <div className="relative text-center">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="relative">
        <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
          <span className="h-px w-6 bg-zinc-700" />
          Join room
        </div>
        <h2 className="text-3xl font-bold text-white">
          Team <span className="text-shimmer">meeting</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your name and join the live chat.
        </p>

        <input
          type="text"
          className="neon-input mt-6 w-full rounded-xl px-3 py-3 text-center text-base text-white"
          placeholder="Your name…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && input && addUser()}
        />

        <button
          disabled={!input}
          onClick={addUser}
          className={`btn-neon mt-4 w-full rounded-xl py-3 text-sm font-semibold ${
            input ? "" : "opacity-50"
          }`}
        >
          Join meeting
        </button>
      </div>
    </div>
  );
};

export default SignUp;
