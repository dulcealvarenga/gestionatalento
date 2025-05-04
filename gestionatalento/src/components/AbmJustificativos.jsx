// AbmJustificativos.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AbmJustificativos.css";

const AbmJustificativos = () => {
    const navigate = useNavigate();

    const volver = () => {
        navigate("/justificativos");
    };

    return (
        <div className="abm-container">
            <h1>ABM Justificativos</h1>
            <button className="volver-btn" onClick={volver}>
                ← Volver
            </button>

            <div className="abm-form">
                <div className="form-row">
                    <input type="text" placeholder="Nro. de Documento" />
                    <input type="text" placeholder="Nombres" />
                    <input type="text" placeholder="Apellidos" />
                </div>

                <div className="form-row">
                    <input type="date" placeholder="Fecha Desde" />
                    <input type="date" placeholder="Fecha Hasta" />
                    <input type="text" placeholder="Situación Laboral" />
                </div>

                <div className="form-row">
                    <select>
                        <option>Tipo de Justificativo</option>
                        <option>Medico</option>
                        <option>Estudio</option>
                        <option>Otros</option>
                    </select>
                    <input type="text" placeholder="Descripción" />
                    <select>
                        <option>Dependencia</option>
                        <option>SEDE CENTRAL</option>
                        <option>SEDE ANTIGUA</option>
                    </select>
                </div>

                <div className="form-row">
                    <select>
                        <option>Tipo de Exoneración</option>
                        <option>Total</option>
                        <option>Parcial</option>
                    </select>
                </div>

                <div className="guardar-btn-wrapper">
                    <button className="guardar-btn">GUARDAR</button>
                </div>
            </div>
        </div>
    );
};

export default AbmJustificativos;
