import React, { useState } from "react";
import fallbackImage from "/src/assets/images/ProjectIcons/Icon_Red.svg";

const ProjectCards = ({ project, onEdit, onDelete }) => {
  const [showDropdown, setDropdown] = useState(false);

  const toggleMenu = () => {
    setDropdown((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit(project);
    setDropdown(false);
  };

  const handleDelete = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/projects/${project.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );

    if (res.ok) {
      onDelete(project.id);
    }

    setDropdown(false);
  };

  return (
    <div className="cardproject">
      <div className="project-image">
        <img src={project.image || fallbackImage} width="56" height="56" />
      </div>
      <h3 className="titleproject">{project.projectName}</h3>
      <button type="button" className="ellipsis" onClick={toggleMenu}>
        <i className="fa-solid fa-ellipsis"></i>
      </button>
      {showDropdown && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item dropdown-item-edit"
            onClick={handleEdit}
          >
            <i className="fa-solid fa-pen"></i> Edit
          </button>
          <button
            className="dropdown-item dropdown-item-delete"
            onClick={handleDelete}
          >
            <i className="fa-solid fa-trash"></i> Delete Project
          </button>
        </div>
      )}
      <p className="clientproject">{project.client?.clientName}</p>
      <p className="descproject">{project.description}</p>
    </div>
  );
};

export default ProjectCards;
