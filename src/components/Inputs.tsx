import { useRef, useState } from "react";

const Inputs = ({ user, socket, setChat, roomId }: any) => {
  const [input, setInput] = useState("");
  const uploadInput = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (input) {
      const msg = { content: input, type: "text", user };
      socket.emit("send_message", msg, roomId);
      socket.emit("user_typing", { user: user.name, typing: false }, roomId);
      setInput("");
    } else {
      uploadInput.current?.click();
    }
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "image/jpeg" || file.type === "image/png") {
      const img = URL.createObjectURL(file);
      const msg = { content: img, type: "image", user };
      setChat((prev: any) => [...prev, msg]);
      socket.emit("send_message", msg, roomId);
    }
  };

  const userTyping = (e: any) => {
    setInput(e.target.value);
    socket.emit(
      "user_typing",
      { user: user.name, typing: e.target.value.length > 0 },
      roomId
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => uploadInput.current?.click()}
        className="btn-ghost inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
        title="Upload image"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
      </button>
      <input
        type="file"
        className="hidden"
        ref={uploadInput}
        onChange={handleImageUpload}
      />
      <input
        className="neon-input flex-1 rounded-full px-5 py-3 text-sm"
        type="text"
        placeholder="Type your message…"
        value={input}
        onChange={userTyping}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        disabled={!input}
        className="btn-neon inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full disabled:opacity-50"
        title="Send"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
};

export default Inputs;
