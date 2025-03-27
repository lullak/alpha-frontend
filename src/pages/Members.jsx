import React from "react";
import ModalButton from "../partials/components/ModalButton";

const Members = () => {
  return (
    <div id="members">
      <div className="page-header">
        <h1 className="h2">Team Members</h1>
        <ModalButton type="add" target="#addMemberModal" text="Add Member" />
      </div>
    </div>
  );
};

export default Members;
