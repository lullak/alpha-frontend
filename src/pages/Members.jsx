import React, { useEffect, useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import UserCards from "../partials/sections/UserCards";
import Modal from "../partials/sections/Modal";
import fallbackImage from "../assets/images/Avatars/Avatar_4.svg";

const Members = () => {
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialUserState());
  const [validationErrors, setValidationErrors] = useState({});

  function initialUserState() {
    return {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      image: "",
      imageFile: null,
      streetName: "",
      postalCode: "",
      city: "",
      role: "",
      jobTitle: "",
    };
  }

  const validateUser = (user) => {
    const errors = {};

    if (!user.firstName.trim()) {
      errors.firstName = "First Name cannot be empty.";
    }

    if (!user.lastName.trim()) {
      errors.lastName = "Last Name cannot be empty.";
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!user.email.trim()) {
      errors.email = "Email cannot be empty.";
    } else if (!emailRegex.test(user.email)) {
      errors.email = "Invalid email format.";
    }

    const phoneRegex = /^\d{10,}$/;
    if (user.phoneNumber && !phoneRegex.test(user.phoneNumber)) {
      errors.phoneNumber = "Phone number must be at least 10 digits.";
    }

    const postalCodeRegex = /^\d{5}$/;
    if (user.postalCode && !postalCodeRegex.test(user.postalCode)) {
      errors.postalCode = "Postal Code must be exactly 5 digits.";
    }
    if (!user.role.trim()) {
      errors.role = "Role must be selected.";
    }

    return errors;
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

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setEditUserId(user.id);
    setNewUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      image: user.image || "",
      streetName: user.streetName,
      postalCode: user.postalCode || "",
      city: user.city || "",
      role: user.role || "",
      jobTitle: user.jobTitle || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    const errors = validateUser(newUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const formData = new FormData();

    formData.append("Id", editUserId);
    formData.append("FirstName", newUser.firstName);
    formData.append("LastName", newUser.lastName);
    formData.append("Email", newUser.email);
    formData.append("Role", newUser.role);
    if (newUser.phoneNumber)
      formData.append("PhoneNumber", newUser.phoneNumber);
    if (newUser.jobTitle) formData.append("JobTitle", newUser.jobTitle);
    if (newUser.streetName) formData.append("StreetName", newUser.streetName);
    if (newUser.postalCode) formData.append("PostalCode", newUser.postalCode);
    if (newUser.city) formData.append("City", newUser.city);
    if (newUser.imageFile) {
      formData.append("NewImageFile", newUser.imageFile);
    } else if (newUser.image && newUser.image !== fallbackImage) {
      formData.append("Image", newUser.image);
    }
    const res = await fetch(`https://localhost:7030/api/users`, {
      method: "PUT",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: formData,
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

    const errors = validateUser(newUser);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const formData = new FormData();

    formData.append("FirstName", newUser.firstName);
    formData.append("LastName", newUser.lastName);
    formData.append("Email", newUser.email);
    formData.append("Role", newUser.role || "User");
    if (newUser.phoneNumber)
      formData.append("PhoneNumber", newUser.phoneNumber);
    if (newUser.jobTitle) formData.append("JobTitle", newUser.jobTitle);
    if (newUser.streetName) formData.append("StreetName", newUser.streetName);
    if (newUser.postalCode) formData.append("PostalCode", newUser.postalCode);
    if (newUser.city) formData.append("City", newUser.city);
    if (newUser.imageFile) {
      formData.append("Image", newUser.imageFile);
    }

    const res = await fetch("https://localhost:7030/api/users", {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: formData,
    });

    if (res.ok) {
      await getUsers();
    }

    setNewUser(initialUserState());
    setIsModalOpen(false);
  };
  return (
    <div id="members">
      <div className="page-header">
        <h1 className="h2">Team Members</h1>
        <ModalButton
          type="add"
          text="Add Member"
          onClick={() => {
            setIsEditMode(false);
            setNewUser(initialUserState());
            setIsModalOpen(true);
          }}
        />
      </div>

      <div className="containeruser">
        {users.map((user) => (
          <UserCards
            key={user.id}
            user={user}
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
          setValidationErrors({});
        }}
      >
        <form
          noValidate
          encType="multipart/form-data"
          onSubmit={isEditMode ? handleUpdateUser : handleAddUser}
        >
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
                      imageFile: file,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          <div className="form-group">
            <div className="date-group">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter First Name"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                />
                <p className="error">{validationErrors.firstName}</p>
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  required
                />
                <p className="error">{validationErrors.lastName}</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter email address"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              required
            />
            <p className="error">{validationErrors.email}</p>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              placeholder="Enter phone number"
              value={newUser.phoneNumber || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, phoneNumber: e.target.value })
              }
            />{" "}
            <p className="error">{validationErrors.phoneNumber}</p>
          </div>
          <div className="form-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              placeholder="Enter job title"
              value={newUser.jobTitle || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, jobTitle: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Member Role</label>
            <div className="select-wrapper">
              <select
                id="role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                required
              >
                <option value="">Select Member Role</option>
                {[...new Set(users.map((user) => user.role))].map(
                  (role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  )
                )}
              </select>
            </div>
            <p className="error">{validationErrors.role}</p>
          </div>

          <div className="form-group">
            <label htmlFor="streetName">Address</label>
            <input
              type="text"
              id="streetName"
              placeholder="Enter street address"
              value={newUser.streetName || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, streetName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <div className="date-group">
              <div>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Enter postal code"
                  value={newUser.postalCode || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, postalCode: e.target.value })
                  }
                />
                <p className="error">{validationErrors.postalCode}</p>
              </div>
              <div>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  value={newUser.city || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, city: e.target.value })
                  }
                />
              </div>
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
