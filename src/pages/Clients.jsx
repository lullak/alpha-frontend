import React, { useEffect, useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import ClientTables from "../partials/sections/ClientTable";
import Modal from "../partials/sections/Modal";
import fallbackImage from "/src/assets/images/Avatars/Avatar_4.svg";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState(initialClientState());
  const [validationErrors, setValidationErrors] = useState({});

  function initialClientState() {
    return {
      clientId: "",
      clientName: "",
      clientImage: "",
      clientEmail: "",
      clientPhone: "",
      clientBillingAddress: "",
      clientBillingPostalCode: "",
      clientBillingCity: "",
      clientBillingReference: "",
    };
  }

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

  const handleEditClient = (client) => {
    setIsEditMode(true);
    setEditClientId(client.id);
    setNewClient({
      clientImage: client.clientImage || fallbackImage,
      clientName: client.clientName,
      clientEmail: client.clientEmail,
      clientPhone: client.clientPhone,
      clientBillingCity: client.information?.clientBillingCity || "",
      clientBillingAddress: client.information?.clientBillingAddress || "",
      clientBillingPostalCode:
        client.information?.clientBillingPostalCode || "",
      clientBillingReference: client.information?.clientBillingReference || "",
      clientInformationId: client.information?.id || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    const errors = {};
    const phoneNumberRegex = /^[0-9]{10}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!newClient.clientName.trim()) {
      errors.clientName = "Client Name cannot be empty.";
    }
    if (!newClient.clientEmail.trim()) {
      errors.clientEmail = "Client Email cannot be empty.";
    } else if (!emailRegex.test(newClient.clientEmail)) {
      errors.clientEmail = "Must be a valid email address.";
    }
    if (!newClient.clientPhone.trim()) {
      errors.clientPhone = "Client Phone cannot be empty.";
    } else if (!phoneNumberRegex.test(newClient.clientPhone)) {
      errors.clientPhone = "Phone Number must be 10 digits.";
    }
    if (!newClient.clientBillingCity.trim()) {
      errors.clientBillingCity = "Client Billing City cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const clientToUpdate = {
      id: editClientId,
      clientId: editClientId,
      clientName: newClient.clientName,
      clientImage: newClient.clientImage || fallbackImage,
      clientEmail: newClient.clientEmail,
      clientPhone: newClient.clientPhone,
      clientBillingCity: newClient.clientBillingCity,
      clientBillingAddress: newClient.clientBillingAddress || "",
      clientBillingPostalCode: newClient.clientBillingPostalCode || "",
      clientBillingReference: newClient.clientBillingReference || "",
      clientInformationId: newClient.clientInformationId,
    };

    const res = await fetch(`https://localhost:7030/api/Clients`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(clientToUpdate),
    });

    if (res.ok) {
      await getClients();
    }

    setNewClient(initialClientState());
    setIsEditMode(false);
    setEditClientId(null);
    setIsModalOpen(false);
    setValidationErrors({});
  };

  const handleAddClient = async (e) => {
    e.preventDefault();

    const errors = {};
    const phoneNumberRegex = /^[0-9]{10}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!newClient.clientName.trim()) {
      errors.clientName = "Client Name cannot be empty.";
    }
    if (!newClient.clientEmail.trim()) {
      errors.clientEmail = "Client Email cannot be empty.";
    } else if (!emailRegex.test(newClient.clientEmail)) {
      errors.clientEmail = "Must be a valid email address.";
    }
    if (!newClient.clientPhone.trim()) {
      errors.clientPhone = "Client Phone cannot be empty.";
    } else if (!phoneNumberRegex.test(newClient.clientPhone)) {
      errors.clientPhone = "Phone Number must be 10 digits.";
    }
    if (!newClient.clientBillingCity.trim()) {
      errors.clientBillingCity = "Client Billing City cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const clientToAdd = {
      clientImage: newClient.clientImage || fallbackImage,
      clientName: newClient.clientName,
      clientEmail: newClient.clientEmail,
      clientPhone: newClient.clientPhone,
      clientBillingCity: newClient.clientBillingCity,
      clientBillingAddress: newClient.clientBillingAddress || "",
      clientBillingPostalCode: newClient.clientBillingPostalCode || "",
      clientBillingReference: newClient.clientBillingReference || "",
    };

    const res = await fetch("https://localhost:7030/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(clientToAdd),
    });

    if (res.ok) {
      await getClients();
    }

    setNewClient(initialClientState());
    setIsModalOpen(false);
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <>
      <div id="clients">
        <div className="page-header">
          <h1 className="h2">Clients</h1>
          <ModalButton
            type="add"
            text="Add Client"
            onClick={() => {
              setIsEditMode(false);
              setNewClient(initialClientState());
              setIsModalOpen(true);
            }}
          />
        </div>

        <div className="container-client">
          <table className="client-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            {clients.map((c) => (
              <ClientTables
                key={c.id}
                client={c}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ))}
          </table>
        </div>
        <Modal
          id="addClientModal"
          title={isEditMode ? "Edit Client" : "Add Client"}
          isOpen={isModalOpen}
          onClose={() => {
            setNewClient(initialClientState());
            setIsModalOpen(false);
            setValidationErrors({});
          }}
        >
          <form
            noValidate
            onSubmit={isEditMode ? handleUpdateClient : handleAddClient}
          >
            <div className="form-group image-picker">
              <div
                className="image-picker-container"
                onClick={() => document.getElementById("imageInput").click()}
              >
                {newClient.clientImage ? (
                  <img
                    src={newClient.clientImage}
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
                      setNewClient({
                        ...newClient,
                        clientImage: event.target.result,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                placeholder="Enter Client Name"
                value={newClient.clientName}
                onChange={(e) =>
                  setNewClient({ ...newClient, clientName: e.target.value })
                }
                required
              />
              <p className="error">{validationErrors.clientName}</p>
            </div>

            <div className="form-group">
              <label htmlFor="clientEmail">Email</label>
              <input
                type="text"
                id="clientEmail"
                placeholder="Enter email address"
                value={newClient.clientEmail}
                onChange={(e) =>
                  setNewClient({ ...newClient, clientEmail: e.target.value })
                }
                required
              />
              <p className="error">{validationErrors.clientEmail}</p>
            </div>

            <div className="form-group">
              <label htmlFor="clientPhone">Phone</label>
              <input
                type="text"
                id="clientPhone"
                placeholder="Enter phone number"
                value={newClient.clientPhone}
                onChange={(e) =>
                  setNewClient({ ...newClient, clientPhone: e.target.value })
                }
                required
              />
              <p className="error">{validationErrors.clientPhone}</p>
            </div>
            <div className="form-group">
              <label htmlFor="clientBillingAddress">Billing Address</label>
              <input
                type="text"
                id="clientBillingAddress"
                placeholder="Enter phone number"
                value={newClient.clientBillingAddress}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    clientBillingAddress: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <div className="date-group">
                <div>
                  <label htmlFor="clientBillingPostalCode">
                    Billing Postal Code
                  </label>
                  <input
                    type="text"
                    id="clientPostalCode"
                    placeholder="Enter billing postal code"
                    value={newClient.clientBillingPostalCode}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        clientBillingPostalCode: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="clientBillingCity">Billing City</label>
                  <input
                    type="text"
                    id="clientBillingCity"
                    placeholder="Enter billing city"
                    value={newClient.clientBillingCity}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        clientBillingCity: e.target.value,
                      })
                    }
                    required
                  />
                  <p className="error">{validationErrors.clientBillingCity}</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="clientBillingReference">Billing Reference</label>
              <input
                type="text"
                id="clientBillingReference"
                placeholder="Enter billing reference"
                value={newClient.clientBillingReference}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    clientBillingReference: e.target.value,
                  })
                }
              />
            </div>

            <button type="submit" className="btn btn-create">
              {isEditMode ? "Update" : "Create"}
            </button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Clients;
