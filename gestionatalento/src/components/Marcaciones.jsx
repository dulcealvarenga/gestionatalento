import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Marcaciones.css";

const Marcaciones = () => {
    const [formData, setFormData] = useState({
        documento: "",
        nombre: "",
        apellido: "",
        fechaDesde: "",
        fechaHasta: "",
        mostrarSello: "",
        mostrarExtras: "",
        limiteExtras: "",
        exoneracionEntrada: "",
        entrada: "",
        salida: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const limpiarCampos = () => {
        setFormData({
            documento: "",
            nombre: "",
            apellido: "",
            fechaDesde: "",
            fechaHasta: "",
            mostrarSello: "",
            mostrarExtras: "",
            limiteExtras: "",
            exoneracionEntrada: "",
            entrada: "",
            salida: "",
        });
    };

    const generarInforme = () => {
        console.log("Generar informe con:", formData);
    };

    const navigate = useNavigate();

    return (
        <div className="marcaciones-container">
            <h2 style={{ fontSize: "50px" }}>Marcaciones</h2>
            <p className="acciones-title" style={{ fontSize: "25px" }}>Acciones</p>

            <div className="tabs">
                <button className="tab" onClick={() => navigate("/marcaciones/importadas")}>MARCACIONES BASE</button>
                <button className="tab" onClick={() => navigate("/marcaciones/manuales/abm")}>MARCACIONES MANUAL</button>
                <button className="tab" onClick={() => navigate("/marcaciones/horasExtras")}>HORAS EXTRAS</button>
            </div>

            <div className="formulario">
                <div className="row row-3-cols">
                    <input name="nombre" placeholder="Nombres" value={formData.nombre} onChange={handleChange}/>
                    <input name="apellido" placeholder="Apellidos" value={formData.apellido} onChange={handleChange}/>
                    <input name="documento" placeholder="Nro. de Documento" value={formData.documento}
                           onChange={handleChange}/>
                </div>

                <div className="row row-3-cols">
                    <input type="date" name="fechaDesde" value={formData.fechaDesde} onChange={handleChange}/>
                    <input type="date" name="fechaHasta" value={formData.fechaHasta} onChange={handleChange}/>
                    <select name="mostrarSello" value={formData.mostrarSello} onChange={handleChange}>
                        <option value="">Mostrar Sello</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="row row-3-cols">
                    <select name="mostrarExtras" value={formData.mostrarExtras} onChange={handleChange}>
                        <option value="">Mostrar Horas Extras</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                    <select name="limiteExtras" value={formData.limiteExtras} onChange={handleChange}>
                        <option value="">Límite de Horas Extras</option>
                        <option value="1">1 hora</option>
                        <option value="2">2 horas</option>
                        <option value="3">3 horas</option>
                    </select>
                    <select name="exoneracionEntrada" value={formData.exoneracionEntrada} onChange={handleChange}>
                        <option value="">Posee Exoneración de Entrada</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="row row-2-cols">
                    <input type="time" name="entrada" value={formData.entrada} onChange={handleChange}/>
                    <input type="time" name="salida" value={formData.salida} onChange={handleChange}/>
                </div>

                <div className="botones">
                    <button onClick={limpiarCampos} className="btn-limpiar">LIMPIAR</button>
                    <button onClick={generarInforme} className="btn-generar">GENERAR INFORME</button>
                </div>
            </div>

        </div>
    );
};

export default Marcaciones;