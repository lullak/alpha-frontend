import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import fallbackImage from "/src/assets/images/Avatars/Avatar_4.svg";

const Header = () => {
  const { signOut } = useAuth();
  const [DropdownOpen, setDropdownOpen] = useState(false);
  const [DarkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const res = await fetch(`https://localhost:7030/api/users/${userId}`, {
        method: "GET",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      });

      if (!res.ok) {
        console.error(
          "Failed to fetch user details:",
          res.status,
          res.statusText
        );
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const activeUser = localStorage.getItem("authUser");
    if (activeUser) {
      const parsedUser = JSON.parse(activeUser);
      fetchUserDetails(parsedUser.id);
    }
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    const newTheme = DarkMode ? "light" : "dark";
    setDarkMode(!DarkMode);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="user-menu-header">
        <img
          src={user.image || fallbackImage}
          alt="User"
          className="user-image-header"
          onClick={toggleDropdown}
        />
        {DropdownOpen && (
          <div className="dropdown-header">
            <div className="user-info-header">
              <img
                src={user.image || fallbackImage}
                alt="User"
                className="dropdown-user-image"
              />{" "}
              <p className="user-name">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div className="dark-mode-toggle">
              <label className="toggle-label">
                <i class="fa-solid fa-gear"></i>
                <span className="toggle-text">
                  {DarkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <input
                  type="checkbox"
                  checked={DarkMode}
                  onChange={toggleDarkMode}
                />
              </label>
            </div>
            <button onClick={handleSignOut} className="logout-button">
              <i className="fa fa-sign-out-alt"></i> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
