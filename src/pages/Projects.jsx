import React from "react";
import ModalButton from "../partials/components/ModalButton";

const Projects = () => {
  return (
    <div id="projects">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton type="add" target="#addProjectModal" text="Add Project" />
      </div>
    </div>
  );
};

export default Projects;
