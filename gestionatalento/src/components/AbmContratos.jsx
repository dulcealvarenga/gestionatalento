import React from "react";
import { useNavigate } from "react-router-dom";
import "./AbmContratos.css";
import axios from "axios";
import { useState } from "react";

const AbmContratos = () => {
  const navigate = useNavigate();

  // Dentro del componente
  const [form, setForm] = useState({
    nroDocumento: "",
    nombres: "",
    apellidos: "",
    periodo: "",
    contrato: "",
    observacion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/contratos",
        form
      );
      console.log("Contrato creado:", response.data);
      alert("Contrato guardado exitosamente ✅");
    } catch (error) {
      console.error("Error al guardar contrato:", error);
      alert("Hubo un error al guardar el contrato.");
    }
  };

  return (
    <div className="abm-contratos-container">
      <h1>Contratos</h1>
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <form className="form-contrato" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nro. de Documento</label>
            <input
              type="text"
              name="nroDocumento"
              value={form.nroDocumento}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="form-group">
            <label>Nombres</label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="form-group">
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="form-group">
            <label>Periodo</label>
            <input
              type="text"
              name="periodo"
              value={form.periodo}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="form-group">
            <label>Contrato</label>
            <select
              name="contrato"
              value={form.contrato}
              onChange={handleChange}
            >
              <option value="">Seleccionar...</option>
              <option value="Contrato A">Contrato A</option>
              <option value="Contrato B">Contrato B</option>
            </select>
          </div>
          <div className="form-group">
            <label>Observacion</label>
            <input
              type="text"
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
        </div>

        <div className="btn-guardar-container">
          <button type="submit" className="guardar-btn">
            GUARDAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default AbmContratos;
