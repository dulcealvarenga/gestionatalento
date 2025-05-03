import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const [showMore, setShowMore] = useState(false);
    const [showConfig, setShowConfig] = useState(false); // <-- Estado para abrir configuraciones
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
                <li onClick={() => navigate("/justificativos")}>Justificativos</li>
                <li onClick={() => navigate("/vacaciones")}>Vacaciones</li>
                <li onClick={() => navigate("/descSalariales")}>Desc. Salariales</li>
                <li onClick={() => setShowMore(!showMore)} className="more-btn">⋮</li>

                {showMore && (
                    <div className="more-options">
                        <li>Documentos</li>
                        <li onClick={() => navigate("/marcaciones")}>Marcaciones</li>
                        <li onClick={() => setShowConfig(!showConfig)}>Configuraciones</li>

                        {showConfig && (
                            <ul className="submenu-config">
                                <li onClick={() => navigate("/direcciones")}>Direcciones</li>
                                <li onClick={() => navigate("/departamentos")}>Departamentos</li>
                                <li onClick={() => navigate("/eventos")}>Eventos</li>
                                <li onClick={() => navigate("/usuarios")}>Usuarios</li>
                            </ul>
                        )}
                    </div>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
