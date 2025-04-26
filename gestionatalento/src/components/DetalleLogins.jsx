import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./detallelogins.css";

const DetalleLogins = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loginData = location.state?.loginData || [];

  return (
    <div className="detalle-logins-container">
      <button className="btn-volver" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver
      </button>
      <h2>Detalles de inicio de sesión</h2>
      <div className="tabla-movimientos">
        <div className="mov-header">
          <span>Usuario</span>
          <span>Fecha</span>
          <span>Cantidad</span>
        </div>
        {loginData.map((item, idx) => (
          <div key={idx} className="mov-item">
            <span>{item.usuario}</span>
            <span>{item.fecha}</span>
            <span>{item.cantidadLogins}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleLogins;
