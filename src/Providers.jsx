import React from "react";
import { AuthProvider } from "./contexts/AuthContext";

const Providers = ({ children }) => {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
};

export default Providers;
