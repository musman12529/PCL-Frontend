const Message = ({ content, type, own, user }: any) => {
  return (
    <div
      className={`message my-2 flex items-end gap-2 px-2 ${
        own ? "justify-end" : "justify-start"
      }`}
    >
      {!own && (
        <span
          className={`logo inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white ring-2 ring-[#070815] ${
            type === "text" ? "my-auto" : "self-end"
          }`}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span
        className={`max-w-[80%] rounded-2xl text-sm leading-relaxed shadow ${
          type === "text" ? "px-4 py-2" : "p-2"
        } ${
          own
            ? "bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white"
            : "border border-white/10 bg-white/[0.05] text-zinc-100"
        }`}
      >
        {type === "text" ? (
          content
        ) : (
          <img src={content} className="rounded-md" alt="attachment" />
        )}
      </span>
    </div>
  );
};

export default Message;
