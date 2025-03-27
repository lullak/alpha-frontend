import React from "react";
import Sidebar from "../../partials/sections/Sidebar";
import Header from "../../partials/sections/Header";
import { Outlet } from "react-router-dom";

const PortalLayout = () => {
  return (
    <div className="wrapper-portal">
      <Sidebar />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PortalLayout;
