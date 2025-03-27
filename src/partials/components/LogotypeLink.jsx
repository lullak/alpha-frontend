import React from "react";
import { Link } from "react-router-dom";
import AlphaLogotypeIcon from "../../assets/images/alpha-logotype.svg";

const LogotypeLink = () => {
  return (
    <Link to="/" className="logotype">
      <img src={AlphaLogotypeIcon} alt="alpha logotype icon" />
      <span>alpha</span>
    </Link>
  );
};

export default LogotypeLink;
