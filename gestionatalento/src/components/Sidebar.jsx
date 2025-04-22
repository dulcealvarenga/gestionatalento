import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FaCog } from "react-icons/fa";
const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <img
        src="/logo.png"
        alt="Logo"
        className="logo"
        onClick={() => navigate("/menu")}
        style={{ cursor: "pointer" }}
      />

      <ul className="sidebar-menu">
        <li
          onClick={() => navigate("/MenuPrincipal")}
          className={location.pathname === "/MenuPrincipal" ? "activo" : ""}
        >
          Menu principal
        </li>
        <li
          onClick={() => navigate("/Dashboard")}
          className={location.pathname === "/Dashboard" ? "activo" : ""}
        >
          Dashboard
        </li>

        <li onClick={() => setShowMore(!showMore)} className="more-btn">
          <FaCog className="icono-tuerca" />
        </li>

        {showMore && (
          <div className="more-options">
            <li>Documentos</li>
            <li onClick={() => navigate("/marcaciones")}>Marcaciones</li>
            <li>Configuraciones</li>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
