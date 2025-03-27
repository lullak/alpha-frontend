import React from "react";
import ModalButton from "../partials/components/ModalButton";

const Clients = () => {
  return (
    <div id="clients">
      <div className="page-header">
        <h1 className="h2">Clients</h1>
        <ModalButton type="add" target="#addClientModal" text="Add Client" />
      </div>
    </div>
  );
};

export default Clients;
