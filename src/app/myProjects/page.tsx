"use client";
import Link from 'next/link';


import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ProjectCard = ({ project, onEditClick, onDeleteClick, onAddTeammatesClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isProjectDataLoaded = project.projectName && project.dueDate && project.status;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-md hover:shadow-lg transition relative z-1">
      <div className="absolute top-2 right-2 cursor-pointer">
        <button className="text-gray-500 hover:text-gray-700" onClick={handleDropdownToggle}>
          ...
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-md rounded-lg w-32">
            <ul className="text-sm">
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  onEditClick(project);
                  setIsDropdownOpen(false);
                }}
              >
                Edit
              </li>
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  onDeleteClick(project._id);
                  setIsDropdownOpen(false);
                }}
              >
                Delete
              </li>
              <li
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  onAddTeammatesClick(project);
                  setIsDropdownOpen(false);
                }}
              >
                Add Teammates
              </li>
            </ul>
          </div>
        )}
      </div>

      <p
        className={`text-sm font-semibold ${
          project.status === "In progress" ? "text-red-500" : "text-green-500"
        }`}
      >
        {isProjectDataLoaded ? project.status.toUpperCase() : "Loading..."}
      </p>
      <h3 className="font-bold text-xl">{isProjectDataLoaded ? project.projectName : "Loading..."}</h3>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Due:</strong> {isProjectDataLoaded ? new Date(project.dueDate).toLocaleDateString() : "Loading..."}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Created By:</strong> {isProjectDataLoaded ? project.userEmail : "Loading..."}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        <strong>Created On:</strong> {isProjectDataLoaded ? new Date(project.createdAt).toLocaleDateString() : "Loading..."}
      </p>
      
      {/* Thin line separator */}
      <div className="border-b border-gray-200 my-3"></div>

      <p className="text-sm text-gray-500 mb-2">
        <strong>Assigned Teammates:</strong> 
      </p>

      {/* Display teammate usernames as circles */}
      <div className="flex flex-wrap mt-2">
        {project.teammateUsernames &&
          project.teammateUsernames.map((username, index) => {
            // List of colors
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'];
            // Get a color from the list based on the index
            const circleColor = colors[index % colors.length];

            return (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center ${circleColor} text-white rounded-full text-xs font-bold mr-2 mb-2 relative group`}
              >
                {username.charAt(0).toUpperCase()}
                {/* Tooltip on hover */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block text-white bg-black text-xs rounded-md p-1">
                  Assigned to {username}
                </div>
              </div>
            );
          })}
      </div>

      {/* Thin line separator */}
      <div className="border-b border-gray-200 my-3"></div>
      <Link href={`/MyTasks?id=${project._id}`}>
      <button
        className="h-fit w-fit px-[1em] py-[0.5em] text-base border-[1px] border-[rgba(75,30,133,0.5)] rounded-full flex justify-center items-center gap-[0.5em] overflow-hidden group hover:translate-y-[0.125em] duration-200 backdrop-blur-[12px] bg-blue-500 text-white"
      >
        <p>open</p>
        <svg
          className="w-6 h-6 group-hover:translate-x-[10%] duration-300"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
      </button>
      </Link>    
    </div>
  );
};

  

  const ProjectsPage = () => {
    const { status } = useSession();
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [newProject, setNewProject] = useState({
      projectName: "",
      status: "In progress",
      dueDate: "",
    });
    const [teammates, setTeammates] = useState([]);
    const [selectedTeammates, setSelectedTeammates] = useState([]);
    const [isTeammatesModalOpen, setIsTeammatesModalOpen] = useState(false);
    const [teammatesWithUsernames, setTeammatesWithUsernames] = useState([]);

  
    const { data: session } = useSession();
  
    useEffect(() => {
      const fetchProjects = async () => {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) return;
    
        try {
          const response = await fetch("/api/getProject", {
            method: "GET",
            headers: {
              "user-email": userEmail,
              "Content-Type": "application/json",
            },
          });
    
          if (!response.ok) throw new Error("Failed to fetch projects");
    
          const projectsData = await response.json();
    
          // Fetch usernames for assigned teammates
          const enhancedProjects = await Promise.all(
            projectsData.map(async (project) => {
              const teammates = await Promise.all(
                project.assignedTo.map(async (email) => {
                  console.log(email)
                  try {
                    const response = await fetch("/api/getUsername", {
                      method: "GET",
                      headers: { "user-email": email },
                    });
    
                    if (!response.ok) throw new Error("Failed to fetch username");
    
                    const { username } = await response.json();
                    console.log(username)
                    return username;
                  } catch (error) {
                    console.error(`Error fetching username for ${email}:`, error);
                    return "Unknown"; // Default fallback
                  }
                })
              );
              return { ...project, teammateUsernames: teammates };
            })
          );
    
          setProjects(enhancedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
    
      fetchProjects();
    }, [session]);

  const handleAddProject = async () => {
    const userEmail =  localStorage.getItem("email");
    if (!userEmail) return;

    try {
      const response = await fetch("/api/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": userEmail,
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      setProjects((prevProjects) => [...prevProjects, data]);
      setIsModalOpen(false);
      setNewProject({
        projectName: "",
        status: "In progress",
        dueDate: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProject = async () => {
    const updatedProject = { ...currentProject, projectName: newProject.projectName, status: newProject.status, dueDate: newProject.dueDate };

    try {
      const response = await fetch("/api/updateProject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "id": currentProject._id, // Add project ID in headers
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj._id === data._id ? data : proj
          )
        );
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentProject(null);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`/api/deleteProject?id=${projectId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project._id !== projectId)
        );
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const openEditModal = (project) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setCurrentProject(project);
    setNewProject({
      projectName: project.projectName,
      status: project.status,
      dueDate: project.dueDate,
    });
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setNewProject({
      projectName: "",
      status: "In progress",
      dueDate: "",
    });
  };




  const fetchTeammates = async () => {
    try {
        const userEmail = localStorage.getItem("email");
        const response = await fetch("/api/getTeammate", {
          method: "GET",
          headers: {
            "user-email": userEmail,
            "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch teammates");
      }

      const data = await response.json();
      
      setTeammates(data);
      
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddTeammates = async () => {
    const projectId=currentProject._id
    try {
      const response = await fetch("/api/addProjectTeammate", {
        method: "PUT",
        headers: {
          "id":projectId,  
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ teammateEmail: selectedTeammates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if the error data contains a message
        const errorMessage = errorData.message || 'Something went wrong';
        alert(errorMessage); // Display the error message to the user
        return;
      }

      const updatedProject = await response.json();

    // Update the project state immediately with the new teammate
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj._id === updatedProject._id ? updatedProject : proj
      )
    );
      setIsTeammatesModalOpen(false);
      setSelectedTeammates([]);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleTeammatesModalOpen = (project) => {
    setCurrentProject(project);
    fetchTeammates();
    setIsTeammatesModalOpen(true);
  };
  if (status === "unauthenticated") return <p>You are not logged in.</p>;

  return (
    <div className="container mx-auto p-4">
  {/* Title and Add New Project Button on the same line */}
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-4xl font-bold text-blue-500">Projects</h1>
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={openAddModal}
    >
      Add New Project
    </button>
  </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEditClick={openEditModal}
            onDeleteClick={handleDeleteProject}
            onAddTeammatesClick={handleTeammatesModalOpen} // Pass the function here

          />
        ))}
      </div>
      
      

      {/* Add/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Project" : "Create New Project"}
            </h3>
            <div>
              <label className="block mb-2">Project Name</label>
              <input
                type="text"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
            </div>
            <div>
              <label className="block mb-2">Due Date</label>
              <input
                type="date"
                value={newProject.dueDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, dueDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              />
            </div>
            <div>
              <label className="block mb-2">Status</label>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2 mb-4"
              >
                <option value="In progress">In Progress</option>
                <option value="Completed">Completed</option>
                
              </select>
            </div>
            <button
              onClick={isEditMode ? handleEditProject : handleAddProject}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {isEditMode ? "Save Changes" : "Create Project"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-2 px-4 py-2 rounded-md border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Teammates Modal */}
      {isTeammatesModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Teammates</h3>
            <div className="space-y-2">
            {teammates.map((teammate) => (
  <label key={teammate.teammateEmail} className="flex items-center">
    <input
      type="checkbox"
      checked={selectedTeammates.includes(teammate.teammateEmail)}
      onChange={(e) => {
        const email = teammate.teammateEmail;
        setSelectedTeammates((prev) =>
          e.target.checked
            ? [...prev, email]
            : prev.filter((emailInList) => emailInList !== email)
        );
      }}
      className="mr-2"
    />
    {teammate.teammateEmail}  {/* This should display the teammate's email */}
  </label>
))}
            </div>
            <button
              onClick={handleAddTeammates}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Add Teammates
            </button>
            <button
              onClick={() => setIsTeammatesModalOpen(false)}
              className="ml-2 px-4 py-2 rounded-md border mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;


