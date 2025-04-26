import React from "react";
import { useNavigate } from "react-router-dom";
import "./Panel.css";
import {
  FaUserTie,
  FaFileContract,
  FaFileAlt,
  FaUmbrellaBeach,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";

const Panel = () => {
  const navigate = useNavigate();

  return (
    <div className="panel-container">
      <h1>Panel Principal</h1>
      <div className="panel-buttons">
        <button onClick={() => navigate("/Menu")}>
          {" "}
          {/* Corregido el path */}
          <FaUserTie className="icono-boton" />
          Busqueda de Funcionarios
        </button>
        <button onClick={() => navigate("/empleados")}>
          <FaUserTie className="icono-boton" />
          Empleados
        </button>
        <button onClick={() => navigate("/contratos")}>
          <FaFileContract className="icono-boton" />
          Contratos
        </button>
        <button onClick={() => navigate("/justificativos")}>
          <FaFileAlt className="icono-boton" />
          Justificativos
        </button>
        <button onClick={() => navigate("/vacaciones")}>
          <FaUmbrellaBeach className="icono-boton" />
          Vacaciones
        </button>
        <button onClick={() => navigate("/descuentoSalariales")}>
          <FaMoneyBillWave className="icono-boton" />
          Desc. Salariales
        </button>
        <button onClick={() => navigate("/direcciones")}>
          <FaMoneyBillWave className="icono-boton" />
          Direcciones
        </button>
      </div>
    </div>
  );
};

export default Panel;
