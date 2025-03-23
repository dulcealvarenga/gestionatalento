import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="sidebar">
            <img src="/logo.png" alt="Logo" className="logo"/>

            <ul className="sidebar-menu">
            <li>Empleados</li>
                <li>Justificativos</li>
                <li>Vacaciones</li>
                <li>Desc. Salariales</li>
                <li onClick={() => setShowMore(!showMore)} className="more-btn">⋮</li>

                {showMore && (
                    <div className="more-options">
                        <li>Documentos</li>
                        <li>Reportes</li>
                        <li>Configuraciones</li>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
