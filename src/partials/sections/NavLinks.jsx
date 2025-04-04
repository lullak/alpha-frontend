import React from "react";
import NavLinkItem from "../components/NavLinkItem";
import { useAuth } from "../../contexts/AuthContext";

const NavLinks = () => {
  const { user } = useAuth();
  console.log("Auth object in NavLinks:", user);

  return (
    <nav className="nav-links">
      <NavLinkItem
        to="/projects"
        text="Projects"
        iconClass="fa-duotone fa-solid fa-briefcase"
      />

      {user.role?.includes("Admin") && (
        <>
          <NavLinkItem
            to="/admin/members"
            text="Members"
            iconClass="fa-duotone fa-solid fa-user-group"
          />
          <NavLinkItem
            to="/admin/clients"
            text="Clients"
            iconClass="fa-duotone fa-solid fa-handshake"
          />
        </>
      )}
    </nav>
  );
};

export default NavLinks;
