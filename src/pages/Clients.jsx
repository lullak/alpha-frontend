import React, { useEffect, useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import ClientTables from "../partials/sections/ClientTable";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    clientId: "",
    clientName: "",
  });

  const getClients = async () => {
    const res = await fetch("https://localhost:7030/api/clients");
    if (res.ok) {
      const data = await res.json();
      setClients(data);
    }
  };

  const handleEditClient = (client) => {
    setIsEditMode(true);
    setEditClientId(client.id);
    setNewClient({
      clientName: client.clientName,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  useEffect(() => {
    getClients();
  }, []);
  return (
    <>
      <div id="clients">
        <div className="page-header">
          <h1 className="h2">Clients</h1>
          <ModalButton type="add" target="#addClientModal" text="Add Client" />
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
                // onEdit={handleEditProject}
                // onDelete={handleDeleteProject}
              />
            ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default Clients;
