import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AbmDirecciones.css";

const AbmDirecciones = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const direccion = state?.direccion || null;

  const [descripcion, setDescripcion] = useState(direccion?.descripcion || "");
  const [estado, setEstado] = useState(direccion?.estado || "Activo");

  const handleGuardar = async () => {
    const payload = {
      descripcion,
      estado,
    };

    try {
      if (direccion) {
        await axios.put(
          `http://localhost:8080/direcciones/${direccion.id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:8080/direcciones", payload);
      }
      navigate("/direcciones");
    } catch (error) {
      console.error("Error al guardar dirección:", error);
    }
  };

  return (
    <div className="abm-direcciones-container">
      <h1>{direccion ? "Editar Dirección" : "Agregar Dirección"}</h1>
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="formulario-direccion">
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <button className="guardar-btn" onClick={handleGuardar}>
          GUARDAR
        </button>
      </div>
    </div>
  );
};

export default AbmDirecciones;
