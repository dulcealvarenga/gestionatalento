import React from "react";
import { useNavigate } from "react-router-dom";
import "./AbmHorasExtras.css"; // Asegurate de importar tu CSS

const HorasExtrasAbm = () => {
    const navigate = useNavigate();

    return (
        <div className="abm-horas-extras-container">
            <h1>Horas Extras</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>

            <div className="form-card-horas">
                <div className="fila-triple">
                    <div className="campo">
                        <label>Nro. de Documento</label>
                        <input type="text" />
                    </div>
                    <div className="campo">
                        <label>Nombres</label>
                        <input type="text" />
                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input type="text" />
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Cargo</label>
                        <select>
                            <option>Seleccionar</option>
                            <option>Administrativo</option>
                            <option>Técnico</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Fecha de Ingreso</label>
                        <input type="date" />
                    </div>
                    <div className="campo">
                        <label>Situación Laboral</label>
                        <select>
                            <option>Seleccionar</option>
                            <option>Activo</option>
                            <option>Contratado</option>
                            <option>Otro</option>
                        </select>
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Hora Extra Planilla</label>
                        <input type="text" />
                    </div>
                    <div className="campo">
                        <label>Observación</label>
                        <input type="text" />
                    </div>
                    <div className="campo">
                        <label>Exoneración de Entrada</label>
                        <select>
                            <option>Seleccionar</option>
                            <option>Sí</option>
                            <option>No</option>
                        </select>
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-guardar">GUARDAR</button>
                </div>
            </div>
        </div>
    );
};

export default HorasExtrasAbm;
