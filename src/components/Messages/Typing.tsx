const Typing = ({ user }: any) => {
  return (
    <div className="my-2 flex items-end gap-2 px-2">
      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white ring-2 ring-[#070815]">
        {user.charAt(0).toUpperCase()}
      </span>
      <div className="loader rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Typing;
