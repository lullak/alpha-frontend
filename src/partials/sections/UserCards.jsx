import React, { useState } from "react";
import fallbackImage from "/src/assets/images/Avatars/Avatar_4.svg";

const UserCards = ({ user, onEdit, onDelete }) => {
  const [showDropdown, setDropdown] = useState(false);

  const toggleMenu = () => {
    setDropdown((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit(user);
    setDropdown(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://localhost:7030/api/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });

    if (res.ok) {
      onDelete(user.id);
    }

    setDropdown(false);
  };

  return (
    <div className="cardproject">
      <div className="project-image">
        <img src={fallbackImage} width="56" height="56" />
      </div>
      <h3 className="titleproject">test</h3>
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
            <i className="fa-solid fa-trash"></i> Delete User
          </button>
        </div>
      )}
      <p className="clientproject">test</p>
      <p className="descproject">test</p>
    </div>
  );
};

export default UserCards;
