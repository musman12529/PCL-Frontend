import { Message, ServerMessage, Typing } from "./Messages";
import { useEffect, useRef } from "react";

const Chat = ({ chat, user, typing }: any) => {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scroller.current) return;
    scroller.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chat]);

  return (
    <div className="h-full w-full overflow-y-auto rounded-2xl bg-white/[0.02] p-3 pt-4">
      {chat.length === 0 && !typing[0] && (
        <div className="flex h-full items-center justify-center text-center">
          <div className="text-zinc-500">
            <p className="text-sm">No messages yet.</p>
            <p className="mt-1 text-xs text-zinc-600">
              Say hi to get the conversation started.
            </p>
          </div>
        </div>
      )}
      {chat.map((message: any, index: number) => {
        message = { ...message, own: message.user?.id === user.id };
        return message.type === "server" ? (
          <ServerMessage key={index} {...message} />
        ) : (
          <Message key={index} {...message} />
        );
      })}
      {typing[0] && <Typing user={typing[0]} />}
      <div ref={scroller} className="pb-2" />
    </div>
  );
};

export default Chat;
