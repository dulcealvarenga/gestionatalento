import React from "react";
import { useNavigate } from "react-router-dom";
import "./Documentos.css";

const Documentos = () => {
    const navigate = useNavigate();

    const documentos = [
        { nombre: "Generales", ruta: "/documentos-generales", icono: "/documentos.png" },
        { nombre: "Justificativos", ruta: "/justificativos", icono: "/justificar.png" },
        { nombre: "Vacaciones", ruta: "/vacaciones", icono: "/vacaciones.png" },
        { nombre: "Contratos", ruta: "/contratos", icono: "/contrato.png" },
    ];

    return (
        <div className="docu-container">
            <h1>Gestión de Documentos</h1>
            <div className="docu-grid">
                {documentos.map((item, index) => (
                    <div
                        key={index}
                        className="docu-card"
                        onClick={() => navigate(item.ruta)}
                    >
                        <img src={item.icono} alt={item.nombre} className="docu-icon"/>
                        <div className="docu-titulo">{item.nombre}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Documentos;
