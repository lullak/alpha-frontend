import React from "react";
import { useAuth } from "../contexts/AuthContext";
const SignIn = () => {
  const { auth } = useAuth();

  return (
    <div>
      SignIn
      <div>{auth.isAuthenticated ? "yes" : "no"}</div>
      <div>{auth.loading ? "yes" : "no"}</div>
    </div>
  );
};

export default SignIn;
