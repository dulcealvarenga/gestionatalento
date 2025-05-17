import React from "react";
import { useNavigate } from "react-router-dom";
import "./Configuraciones.css";

const ConfigScreen = () => {
    const navigate = useNavigate();

    const configuraciones = [
        { nombre: "Eventos", ruta: "/configuraciones/eventos", icono: "/public/eventos.png" },
        { nombre: "Direcciones", ruta: "/configuraciones/direcciones", icono: "/public/direcciones.png" },
        { nombre: "Usuarios", ruta: "/configuraciones/usuarios", icono: "/public/usuario.png" },
    ];

    return (
        <div className="config-container">
            <h1>Configuraciones</h1>
            <div className="config-grid">
                {configuraciones.map((item, index) => (
                    <div
                        key={index}
                        className="config-card"
                        onClick={() => navigate(item.ruta)}
                    >
                        <img src={item.icono} alt={item.nombre} className="config-icon"/>
                        <div className="config-titulo">{item.nombre}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConfigScreen;
