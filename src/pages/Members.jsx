import React, { useEffect, useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import UserCards from "../partials/sections/UserCards";
import Modal from "../partials/sections/Modal";
import fallbackImage from "../assets/images/ProjectIcons/Icon_Red.svg";

const Members = () => {
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialUserState());

  function initialUserState() {
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

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setEditUserId(user.id);
    setNewUser({
      image: user.image || "",
      userName: user.projectName,
      clientId: user.client?.id || "",
      description: user.description || "",
      startDate: user.startDate.split("T")[0],
      endDate: user.endDate ? user.endDate.split("T")[0] : "",
      budget: user.budget || null,
      userId: user.user?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (
      !newUser.projectName ||
      !newUser.startDate ||
      !newUser.clientId ||
      !newUser.userId
    ) {
      return;
    }

    const userToUpdate = {
      ...newUser,
      id: editUserId,
      startDate: new Date(newUser.startDate).toISOString(),
      endDate: newUser.endDate ? new Date(newUser.endDate).toISOString() : null,
      budget: newUser.budget !== null ? Number(newUser.budget) : null,
      statusId: newUser.statusId || 1,
    };
    const res = await fetch(`https://localhost:7030/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(userToUpdate),
    });
    if (res.ok) {
      await getUsers();
    }
    setNewUser(initialUserState());
    setIsEditMode(false);
    setEditUserId(null);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (
      !newUser.userName ||
      !newUser.startDate ||
      !newUser.clientId ||
      !newUser.userId
    ) {
      return;
    }

    const userToAdd = {
      image: newUser.image || fallbackImage,
      userName: newUser.userName,
      description: newUser.description || "",
      startDate: new Date(newUser.startDate).toISOString(),
      endDate: newUser.endDate ? new Date(newUser.endDate).toISOString() : null,
      budget: newUser.budget !== null ? Number(newUser.budget) : null,
      clientId: newUser.clientId,
      userId: newUser.userId,
    };
    const res = await fetch("https://localhost:7030/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(userToAdd),
    });

    if (res.ok) {
      await getUsers();
    }
    setNewUser(initialUserState());
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
            setNewUser(initialUserState());
            setIsModalOpen(true);
          }}
        />
      </div>

      <div className="containerproject">
        {users.map((u) => (
          <UserCards
            key={u.id}
            client={u}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>

      <Modal
        id="addUserModal"
        title={isEditMode ? "Edit User" : "Add User"}
        isOpen={isModalOpen}
        onClose={() => {
          setNewUser(initialUserState());
          setIsModalOpen(false);
        }}
      >
        <form onSubmit={isEditMode ? handleUpdateUser : handleAddUser}>
          <div className="form-group image-picker">
            <div
              className="image-picker-container"
              onClick={() => document.getElementById("imageInput").click()}
            >
              {newUser.image ? (
                <img
                  src={newUser.image}
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
                    setNewUser({
                      ...newUser,
                      image: event.target.result,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              id="userName"
              placeholder="Enter User Name"
              value={newUser.userName}
              onChange={(e) =>
                setNewUser({ ...newUser, userName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Client Name</label>
            <div className="select-wrapper">
              <select
                id="clientId"
                value={newUser.clientId}
                onChange={(e) =>
                  setNewUser({ ...newUser, clientId: e.target.value })
                }
                required
              >
                <option value="">Select Client Name</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.clientName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Type something"
              value={newUser.description}
              onChange={(e) =>
                setNewUser({ ...newUser, description: e.target.value })
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
                  value={newUser.startDate}
                  onChange={(e) =>
                    setNewUser({ ...newUser, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={newUser.endDate}
                  onChange={(e) =>
                    setNewUser({ ...newUser, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userId">User Owner</label>
            <div className="select-wrapper">
              <select
                id="userId"
                value={newUser.userId}
                onChange={(e) =>
                  setNewUser({ ...newUser, userId: e.target.value })
                }
                required
              >
                <option value="">Select User Owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
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
                value={newUser.budget === null ? "" : newUser.budget}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
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

export default Members;
