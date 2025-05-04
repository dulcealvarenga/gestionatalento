// AbmVacaciones.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AbmVacaciones.css";

const AbmVacaciones = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        ci: "",
        nombreCompleto: "",
        fecha: "",
        dependencia: "",
        anulado: "N",
        descripcion: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:8080/vacaciones", form);
            alert("Registro guardado exitosamente");
            navigate("/vacaciones");
        } catch (error) {
            alert("Error al guardar: " + error.message);
        }
    };

    return (
        <div className="abm-container">
            <h1>ABM Vacaciones</h1>
            <button className="volver-btn" onClick={() => navigate("/vacaciones")}>
                ← Volver
            </button>

            <div className="abm-form">
                <div className="form-row">
                    <input
                        type="text"
                        name="ci"
                        value={form.ci}
                        onChange={handleChange}
                        placeholder="C.I."
                    />
                    <input
                        type="text"
                        name="nombreCompleto"
                        value={form.nombreCompleto}
                        onChange={handleChange}
                        placeholder="Nombre Completo"
                    />
                </div>
                <div className="form-row">
                    <input
                        type="date"
                        name="fecha"
                        value={form.fecha}
                        onChange={handleChange}
                        placeholder="Fecha"
                    />
                    <input
                        type="text"
                        name="dependencia"
                        value={form.dependencia}
                        onChange={handleChange}
                        placeholder="Dependencia"
                    />
                </div>
                <div className="form-row">
                    <select name="anulado" value={form.anulado} onChange={handleChange}>
                        <option value="N">No</option>
                        <option value="S">Sí</option>
                    </select>
                    <input
                        type="text"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Descripción"
                    />
                </div>
                <div className="guardar-btn-wrapper">
                    <button className="guardar-btn" onClick={handleSubmit}>
                        GUARDAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AbmVacaciones;
