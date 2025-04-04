import React, { useEffect, useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import Modal from "../partials/sections/Modal";
import fallbackImage from "../assets/images/ProjectIcons/Icon_Red.svg";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [newProject, setNewProject] = useState(initialProjectState());
  const [validationErrors, setValidationErrors] = useState({});

  function initialProjectState() {
    return {
      image: "",
      projectName: "",
      clientId: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: null,
      userId: "",
    };
  }

  // api fetches

  const getProjects = async () => {
    const res = await fetch("https://localhost:7030/api/projects", {
      method: "GET",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    const data = await res.json();
    setProjects(data);
  };

  const getClients = async () => {
    const res = await fetch("https://localhost:7030/api/clients", {
      method: "GET",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    const data = await res.json();
    setClients(data);
  };

  const getUsers = async () => {
    const res = await fetch("https://localhost:7030/api/users", {
      method: "GET",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    const data = await res.json();
    setUsers(data);
  };

  const filteredProjects = projects.filter((project) => {
    if (activeTab === "completed") {
      return project.status.id === 2;
    }
    return true;
  });

  const handleEditProject = (project) => {
    setIsEditMode(true);
    setEditProjectId(project.id);
    setNewProject({
      image: project.image || "",
      projectName: project.projectName,
      clientId: project.client?.id || "",
      description: project.description || "",
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      budget: project.budget || null,
      userId: project.user?.id || "",
      created: project.created,
      statusId: project.status?.id || 1,
    });
    setIsModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!newProject.projectName.trim()) {
      errors.projectName = "Project Name cannot be empty.";
    }
    if (!newProject.startDate) {
      errors.startDate = "Start Date is required.";
    }
    if (!newProject.clientId) {
      errors.clientId = "Client must be selected.";
    }
    if (!newProject.userId) {
      errors.userId = "Project Owner must be selected.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const projectToUpdate = {
      ...newProject,
      id: editProjectId,
      startDate: new Date(newProject.startDate).toISOString(),
      endDate: newProject.endDate
        ? new Date(newProject.endDate).toISOString()
        : null,
      budget: newProject.budget !== null ? Number(newProject.budget) : null,
      statusId: newProject.statusId || 1,
      created: newProject.created,
    };
    const res = await fetch("https://localhost:7030/api/Projects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(projectToUpdate),
    });
    if (res.ok) {
      await getProjects();
    }
    setNewProject(initialProjectState());
    setValidationErrors({});
    setIsEditMode(false);
    setEditProjectId(null);
    setIsModalOpen(false);
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  useEffect(() => {
    getProjects();
    getClients();
    getUsers();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!newProject.projectName.trim()) {
      errors.projectName = "Project Name cannot be empty.";
    }
    if (!newProject.startDate) {
      errors.startDate = "Start Date is required.";
    }
    if (!newProject.clientId) {
      errors.clientId = "Client must be selected.";
    }
    if (!newProject.userId) {
      errors.userId = "Project Owner must be selected.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const projectToAdd = {
      image: newProject.image || fallbackImage,
      projectName: newProject.projectName,
      description: newProject.description || "",
      startDate: new Date(newProject.startDate).toISOString(),
      endDate: newProject.endDate
        ? new Date(newProject.endDate).toISOString()
        : null,
      budget: newProject.budget !== null ? Number(newProject.budget) : null,
      clientId: newProject.clientId,
      userId: newProject.userId,
      created: new Date().toISOString(),
    };

    const res = await fetch("https://localhost:7030/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(projectToAdd),
    });

    if (res.ok) {
      await getProjects();
    }
    setNewProject(initialProjectState());
    setIsModalOpen(false);
  };
  return (
    <div id="projects">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton
          type="add"
          text="Add Project"
          onClick={() => {
            setIsEditMode(false);
            setNewProject(initialProjectState());
            setIsModalOpen(true);
          }}
        />
      </div>
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All (
          {
            projects.filter((p) => p.status.id === 1 || p.status.id === 2)
              .length
          }
          )
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({projects.filter((p) => p.status.id === 2).length})
        </button>
      </div>

      <div className="containerproject">
        {activeTab === "all"
          ? projects.map((p) => (
              <ProjectCards
                key={p.id}
                project={p}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))
          : filteredProjects.map((p) => (
              <ProjectCards
                key={p.id}
                project={p}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
      </div>

      <Modal
        id="addProjectModal"
        title={isEditMode ? "Edit Project" : "Add Project"}
        isOpen={isModalOpen}
        onClose={() => {
          setNewProject(initialProjectState());
          setIsModalOpen(false);
          setValidationErrors({});
        }}
      >
        <form
          noValidate
          onSubmit={isEditMode ? handleUpdateProject : handleAddProject}
        >
          <div className="form-group image-picker">
            <div
              className="image-picker-container"
              onClick={() => document.getElementById("imageInput").click()}
            >
              {newProject.image ? (
                <img
                  src={newProject.image}
                  alt="Selected"
                  className="selected-image"
                />
              ) : (
                <i className="camera-icon fa fa-camera"></i>
              )}
            </div>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setNewProject({
                      ...newProject,
                      image: event.target.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              placeholder="Enter Project Name"
              value={newProject.projectName}
              onChange={(e) =>
                setNewProject({ ...newProject, projectName: e.target.value })
              }
              required
            />
            <p className="error">{validationErrors.projectName}</p>
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Client Name</label>
            <div className="select-wrapper">
              <select
                id="clientId"
                value={newProject.clientId}
                onChange={(e) =>
                  setNewProject({ ...newProject, clientId: e.target.value })
                }
                required
              >
                <option value="">Select Client Name</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
              <p className="error">{validationErrors.clientId}</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Type something"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="form-group">
            <div className="date-group">
              <div>
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, startDate: e.target.value })
                  }
                  required
                />
                <p className="error">{validationErrors.startDate}</p>
              </div>
              <div>
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={newProject.endDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userId">Project Owner</label>
            <div className="select-wrapper">
              <select
                id="userId"
                value={newProject.userId}
                onChange={(e) =>
                  setNewProject({ ...newProject, userId: e.target.value })
                }
                required
              >
                <option value="">Select Project Owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
              <p className="error">{validationErrors.userId}</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="budget"
                placeholder="0"
                value={newProject.budget === null ? "" : newProject.budget}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    budget:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-create">
            {isEditMode ? "Update" : "Create"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
