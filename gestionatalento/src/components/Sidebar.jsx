import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
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
                <li onClick={() => navigate("/empleados")}>Empleados</li>
                <li onClick={() => navigate("/salarios")}>Salarios</li>
                <li onClick={() => navigate("/descuentos")}>Desc. Salariales</li>
                <li onClick={() => navigate("/documentos")}>Documentos</li>
                <li onClick={() => navigate("/marcaciones")}>Marcaciones</li>
                <li onClick={() => navigate("/configuraciones")}>Configuraciones</li>
            </ul>
        </div>
    );
};

export default Sidebar;
