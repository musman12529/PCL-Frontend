import { useEffect, useState, useRef } from "react";



const SignUp = ({user, socket, input, setInput, roomId}) => {
    const addUser = () => {
        user.current = {name: input, id: socket.id};
        socket.emit("new_user", {user: input});
        socket.emit("join_room", roomId);  // Emit join_room event here with roomId
        setInput("");
    };

    return (
        <div className="w-full h-full flex flex=col items-center justify-center">
            <div className="text-center grid grid-rows-3 gap-2 gradient p-8 rounded-md">
                <h1 className="text-6xl font-bold text-white">Team Meeting</h1>
                <h2 className="text-2xl text-white">Enter your name to join</h2>
                <input type="text" className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none" placeholder="..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addUser()}
                />
                <button className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md ${input ? "bg-sky-400" : "bg-slate-400"}`}
                    disabled={!input}
                    onClick={addUser}
                >Join Meeting</button>
            </div>
        </div>
    );
};

export default SignUp;
