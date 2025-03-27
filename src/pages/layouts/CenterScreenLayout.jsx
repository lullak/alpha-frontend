import React from "react";
import { Outlet } from "react-router-dom";

const CenterScreenLayout = () => {
  return (
    <div className="wrapper-centerscreen">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CenterScreenLayout;
