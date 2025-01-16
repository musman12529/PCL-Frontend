"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const OverdueTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOverdueTasks = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        const response = await fetch("/api/overdueTask", {
          method: "GET",
          headers: {
            "user-email": userEmail,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch overdue tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOverdueTasks();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (status === "unauthenticated") return <p>You are not logged in.</p>;

  return (
    <div className="p-8 ">
      <h1 className="text-center text-4xl font-bold mb-6 text-blue-500">Overdue Tasks</h1>
      <div className="flex flex-wrap gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition w-[300px]"
            >
              <p className="text-red-500 font-semibold">OVERDUE</p>
              <h3 className="font-bold text-xl">{task.title}</h3>
              <p className="text-sm text-gray-500">
                <strong>Due:</strong>{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Description:</strong> {task.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No overdue tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default OverdueTasks;
