import React from "react";
import { NavLink } from "react-router-dom";

const NavLinkItem = ({ to, text, iconClass }) => {
  return (
    <NavLink to={to} className="nav-link">
      <i className={iconClass}></i>
      <span>{text}</span>
    </NavLink>
  );
};

export default NavLinkItem;
