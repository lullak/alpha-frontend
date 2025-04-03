import React, { useState } from "react";
import fallbackImage from "/src/assets/images/Avatars/Avatar_4.svg";

const ClientTables = ({ client, onEdit, onDelete }) => {
  const [showDropdown, setDropdown] = useState(false);

  const toggleMenu = () => {
    setDropdown((prev) => !prev);
  };

  const handleEdit = () => {
    onEdit(client);
    setDropdown(false);
  };

  const handleDelete = async () => {
    const res = await fetch(`https://localhost:7030/api/clients/${client.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });

    if (res.ok) {
      onDelete(client.id);
    }

    setDropdown(false);
  };

  return (
    <>
      <tbody>
        <tr key={client.id}>
          <td>
            <input type="checkbox" />
          </td>
          <td>
            <div className="client-info">
              <img
                src={client.clientImage || fallbackImage}
                alt="Client"
                width="32"
                height="32"
                className="client-avatar"
              />
              <div className="client-details">
                <span className="client-name">{client.clientName}</span>
                <span className="client-email">
                  {client.clientEmail || "No Email"}
                </span>
              </div>
            </div>
          </td>
          <td>{client.information?.clientBillingCity || "N/A"}</td>
          <td>{client.clientPhone || "N/A"}</td>
          <td>
            {client.created
              ? new Date(client.created).toLocaleDateString()
              : "N/A"}
          </td>
          <td className="status-client">
            <span
              className={`status-text ${
                client.projects && client.projects.length > 0
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              {client.projects && client.projects.length > 0
                ? "Active"
                : "Inactive"}
            </span>
          </td>
          <td style={{ position: "relative" }}>
            <button
              type="button"
              className="ellipsisTable"
              onClick={toggleMenu}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            {showDropdown && (
              <div className="dropdown-menu-client">
                <button
                  className="dropdown-item-client dropdown-item-edit-client"
                  onClick={handleEdit}
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
                <button
                  className="dropdown-item-client dropdown-item-delete-client"
                  onClick={handleDelete}
                >
                  <i className="fa-solid fa-trash"></i> Delete client
                </button>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default ClientTables;
