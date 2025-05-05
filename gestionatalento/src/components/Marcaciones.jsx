import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Marcaciones.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Marcaciones = () => {

    const handleBuscarPorDocumento = async () => {
        const nroDocumento = formData.nroDocumento;
        if (!nroDocumento) return;
        try {
            const response = await axios.get('http://localhost:8080/personas/obtener/documento/' + nroDocumento);
            if (response.data.codigoMensaje === "200") {
                toast.success("Persona encontrada", { autoClose: 2000 });
                const persona = response.data.objeto;
                localStorage.setItem('codPersona', persona.codPersona);
                setFormData(prev => ({
                    ...prev,
                    nombres: persona.nombres || '',
                    apellidos: persona.apellidos || '',
                    nroRuc: persona.nroRuc || '',
                    fecNacimiento: persona.fecNacimiento || '',
                    codNivelEstudio: persona.codNivelEstudio || '',
                    poseeDiscapacidad: persona.poseeDiscapacidad === "S",
                    descripcionDiscapacidad: persona.descripcionDiscapacidad || '',
                    direccionParticular: persona.direccionParticular || '',
                    codEstadoCivil: persona.estadoCivil?.codEstadoCivil || '',
                    lugarNacimiento: persona.lugarNacimiento || '',
                    telefono: persona.telefono || '',
                    correo: persona.correo || ''
                }));
            } else {
                toast.info("No se encontró la persona registrada, avanzar con el registro", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error al buscar persona:", error);
            toast.error("Error al buscar persona", { autoClose: 2000 });
        }
    };

    const [formData, setFormData] = useState({
        nroDocumento: "",
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
            nroDocumento: "",
            nombres: "",
            apellidos: "",
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

    const navigate = useNavigate();

    const handleGenerarInforme = async () => {
        try {
            const response = await axios.post("http://localhost:8080/marcaciones/manuales/obtener", {
                nroDocumento: formData.nroDocumento,
                fecDesde: formData.fechaDesde,
                fecHasta: formData.fechaHasta
            });

            if (response.data.codigoMensaje === "200") {
                const data = response.data.objeto;

                // Convertir a formato hoja de cálculo
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Marcaciones");

                // Generar buffer
                const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

                // Descargar el archivo
                const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
                saveAs(blob, "informe_marcaciones.xlsx");

                toast.success("Informe generado correctamente");
            } else {
                toast.error("No se pudo obtener la información");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al generar informe");
        }
    };

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
                    <div className="campo">
                        <label>Nro. de Documento</label>
                        <input
                            type="text"
                            name="nroDocumento"
                            value={formData.nroDocumento}
                            onChange={handleChange}
                            onBlur={handleBuscarPorDocumento}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleBuscarPorDocumento();
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label>Nombres</label>
                        <input name="nombres" value={formData.nombres} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input name="apellidos" value={formData.apellidos}
                               onChange={handleChange}/>
                    </div>
                </div>

                <div className="row row-3-cols">
                    <div className="campo">
                        <label>Fecha Desde</label>
                        <input type="date" name="fechaDesde" value={formData.fechaDesde} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Fecha Desde</label>
                        <input type="date" name="fechaHasta" value={formData.fechaHasta} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Mostrar Sello</label>
                        <select name="mostrarSello" value={formData.mostrarSello} onChange={handleChange}>
                            <option value="">Mostrar Sello</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div className="row row-3-cols">
                    <div className="campo">
                        <label>Mostrar Horas Extras</label>
                        <select name="mostrarExtras" value={formData.mostrarExtras} onChange={handleChange}>
                            <option value=""></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Limite de Horas</label>
                        <select name="limiteExtras" value={formData.limiteExtras} onChange={handleChange}>
                            <option value=""></option>
                            <option value="1">12 horas</option>
                            <option value="2">36 horas</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Exoneracion de Entrada</label>
                        <select name="exoneracionEntrada" value={formData.exoneracionEntrada} onChange={handleChange}>
                            <option value=""></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div className="row row-2-cols">
                    <div className="campo">
                        <label>Hora de Entrada</label>
                        <input type="time" name="entrada" value={formData.entrada} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Hora de Salida</label>
                        <input type="time" name="salida" value={formData.salida} onChange={handleChange}/>
                    </div>
                </div>

                <div className="botones">
                    <button onClick={limpiarCampos} className="btn-limpiar">LIMPIAR</button>
                    <button onClick={handleGenerarInforme} className="btn-generar">GENERAR INFORME</button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Marcaciones;