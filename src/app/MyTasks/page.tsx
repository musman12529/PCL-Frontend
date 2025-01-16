"use client";
import Link from 'next/link';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';



// TaskCard Component
const TaskCard = ({ task, onEditClick, onDeleteClick, onHistoryClick, isList  }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = () => {
    onEditClick(task);
    setIsDropdownOpen(false); // Close dropdown when Edit is clicked
  };

  const handleDeleteClick = () => {
    onDeleteClick(task._id); // Call the delete function with task ID
    setIsDropdownOpen(false); // Close dropdown
  };
  const handleHistoryClick = () => {
    onHistoryClick(task._id); // Pass task ID to fetch history
    setIsDropdownOpen(false); // Close dropdown
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-md hover:shadow-lg transition relative z-1">
      <div className="absolute top-2 right-2 cursor-pointer">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleDropdownToggle}
        >
          ...
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-md rounded-lg w-32">
            <ul className="text-sm">
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={handleEditClick}
              >
                Edit
              </li>
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={handleHistoryClick}
              >
                History
              </li>
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={handleDeleteClick}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>

      <p
        className={`text-sm font-semibold ${
          task.priority === "High"
            ? "text-red-500"
            : task.priority === "Medium"
            ? "text-yellow-500"
            : task.priority === "Low"
            ? "text-green-500"
            : ""
        }`}
      >
        {task.priority.toUpperCase()} PRIORITY
      </p>
      <h3 className="font-bold text-xl">{task.title}</h3>
      {isList ? (
        <p className="text-sm text-gray-500 mb-2">
          <strong>Status:</strong> {task.status}
        </p>
        ) : null}
      <p className="text-sm text-gray-500 mb-2">
        <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Description:</strong> {task.description}
      </p>
      <div className="flex space-x-2 mt-4">
        {Array.isArray(task.assignedTo) &&
          task.assignedTo.map((initials, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm"
            >
              {initials}
            </div>
          ))}
      </div>
    </div>
  );
};


// TaskColumn Component
const TaskColumn = ({ title, color, tasks, onEditClick, onDeleteClick, onHistoryClick, isList }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-4">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            color === "blue"
              ? "bg-blue-500"
              : color === "yellow"
              ? "bg-yellow-500"
              : color === "green"
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
        ></span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex-1">
        <div className="flex flex-col items-stretch space-y-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEditClick={onEditClick} onDeleteClick={onDeleteClick} onHistoryClick={onHistoryClick} isList={false}/>
            ))
          ) : (
            <p className="text-gray-500 italic">No tasks in this column.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main TasksPage Component
const TasksPage = () => {
  const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Get the 'id' parameter
  
  const [historyModal, setHistoryModal] = useState({ isOpen: false, history: [] });

  const { data: session, status } = useSession();
  const [isList, setIsList] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("Board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing a task
  const [selectedTask, setSelectedTask] = useState(null); // Store the task being edited
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        

        const response = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "project-id": id,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      
      const response = await fetch("/api/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "project-id": id,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data]);
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
        headers: {
          "Content-Type": "application/json",
          "id": _id,

        },
        body: JSON.stringify(selectedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to edit task");
      }

      const data = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === data._id ? { ...task, ...data } : task  // Compare with _id
        )
      );
      setIsEditing(false); // Close the edit modal
      setSelectedTask(null); // Clear selected task
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`/api/deleteTask/`, {
        method: "DELETE",
        headers: { id }, // Send the ID as a header
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove the deleted task from state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleHistoryClick = async (taskId) => {
    try {
      const response = await fetch(`/api/history`, {
        method: 'GET',
        headers: { id: taskId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task history");
      }

      const history = await response.json();
      setHistoryModal({ isOpen: true, history });
    } catch (error) {
      console.error(error);
    }
  };

  const closeHistoryModal = () => {
    setHistoryModal({ isOpen: false, history: [] });
  };

  const pendingTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "pending")
    : [];
  const inProgressTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "in-progress")
    : [];
  const completedTasks = Array.isArray(tasks)
    ? tasks.filter((task) => task.status === "completed")
    : [];

  if (status === "loading") {return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );}
  if (status === "unauthenticated") return <p>You are not logged in.</p>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            className={`mr-4 ${view === "Board" ? "font-bold text-blue-500" : "text-gray-500"}`}
            onClick={() => setView("Board")}
          >
            Board View
          </button>
          <button
            className={view === "List" ? "font-bold text-blue-500" : "text-gray-500"}
            onClick={() => setView("List")}
          >
            List View
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/teamChat?id=${id}`}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Start Meeting
            </button>
          </Link>
          <button
            className="bg-blue-500 text-white py-2 px-3 rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Task
          </button>
        </div>
      </div>

      {view === "Board" ? (
        
        <div className="grid gap-6 md:grid-cols-3">
          <TaskColumn title="Pending" color="blue" tasks={pendingTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteTask} onHistoryClick={handleHistoryClick} isList/>
          <TaskColumn title="In-Progress" color="yellow" tasks={inProgressTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteTask} onHistoryClick={handleHistoryClick} isList/>
          <TaskColumn title="Completed" color="green" tasks={completedTasks} onEditClick={handleEditClick} onDeleteClick={handleDeleteTask} onHistoryClick={handleHistoryClick} isList/>
        </div>
      ) : (
        <div>
          {/* List View Logic */}
          <div className="space-y-6">
            
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
              <p className="text-gray-500 italic">No tasks available.</p>
            )}
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Task History</h3>
            {historyModal.history.length > 0 ? (
              <ul>
                {historyModal.history.map((item, index) => (
                  <li key={index} className="mb-4">
                    <p><strong>Title:</strong> {item.title}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Priority:</strong> {item.priority}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                    <p><strong>Updated:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No history available.</p>
            )}
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={closeHistoryModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      

      {/* Modal for Adding Task */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleAddTask}
            >
              Add Task
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg mt-4"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing Task */}
      {isEditing && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Task Title"
              value={selectedTask.title}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, title: e.target.value })
              }
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Description"
              value={selectedTask.description}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, description: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={selectedTask.dueDate}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, dueDate: e.target.value })
              }
            />
            <div className="flex space-x-4 mb-4">
              <select
                value={selectedTask.priority}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, priority: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={selectedTask.status}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, status: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button
              onClick={handleEditTask}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

