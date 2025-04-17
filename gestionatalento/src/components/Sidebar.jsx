import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="sidebar">
            <img
                src="/logo.png"
                alt="Logo"
                className="logo"
                onClick={() => navigate("/menu")}
                style={{cursor: "pointer"}}
            />

            <ul className="sidebar-menu">
                <li onClick={() => navigate("/empleados")}>Empleados</li>
                <li>Justificativos</li>
                <li>Vacaciones</li>
                <li>Desc. Salariales</li>
                <li onClick={() => setShowMore(!showMore)} className="more-btn">⋮</li>

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
