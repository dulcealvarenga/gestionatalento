import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "./AbmJustificativos.css";

const AbmVacaciones = () => {
    const [tiposJustificativos, setTiposJustificativos] = useState([]);
    const [formData, setFormData] = useState({
        codPersona: "",
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        descripcion: "",
        estado: "",
        fecDesde: "",
        fecHasta: ""
    });

    useEffect(() => {
        const fetchTiposJustificativos = async () => {
            try {
                const response = await axios.get("http://localhost:8080/configuraciones/tipos-justificativos/obtenerListaActiva");
                setTiposJustificativos(response.data.objeto);
            } catch (error) {
                console.error("Error al cargar tipos de justificativos:", error);
            }
        };

        fetchTiposJustificativos();
    }, []);


    const navigate = useNavigate();

    const volver = () => {
        navigate("/vacaciones");
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    const generarRangoFechas = (desde, hasta) => {
        const fechas = [];
        let actual = new Date(desde);
        const final = new Date(hasta);
      
        while (actual <= final) {
          fechas.push(new Date(actual).toISOString().split("T")[0]);
          actual.setDate(actual.getDate() + 1);
        }
      
        return fechas;
    };

    const handleSave = async () => {
        const requiredInputs = document.querySelectorAll("input[required], select[required]");

        // Filtrar los que están vacíos
        const emptyFields = Array.from(requiredInputs).filter(input => !input.value.trim());

        if (emptyFields.length > 0) {
            toast.info("Debe completar los datos obligatorios", { autoClose: 2000 });
            return;
        }

        try {
            const fechas = generarRangoFechas(formData.fecDesde, formData.fecHasta);
            fechas.forEach(fecha => {
                // Podés llamar a una función o enviar al backend por fecha
              });
            const justificativo = {
                descripcion: formData.descripcion,
                tipoJustificativo: {
                    codTipJustificativo: 9
                },
                estado      : 1,
                persona: {
                    codPersona: localStorage.getItem('codPersona')
                },
                fechaJustificativo: fechas
            };
            console.log(justificativo);
            const response = await axios.post("http://localhost:8080/justificativos/crear", justificativo);
            const genericResponse = response.data;
            if (genericResponse.codigoMensaje == "200") {
                toast.success("Vacaciones cargadas exitosamente", { autoClose: 2000 });
                setTimeout(() => {
                    navigate("/vacaciones");
                }, 2000);
            } else {
                toast.error(genericResponse.mensaje, { autoClose: 2000 });
            }      
        } catch (error) {
            console.error("Error al guardar evento:", error);
            alert("Error al guardar evento");
        }
    };

    return (
        <div className="abm-container">
            <h1>ABM Vacaciones</h1>
            <button className="volver-btn" onClick={volver}>
                ← Volver
            </button>

            <div className="abm-form">
                <div className="form-row">
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
                        <input type="text" name="nombres" value={formData.nombres}
                               style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '96%'}}
                               disabled/>
                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input type="text" name="apellidos" value={formData.apellidos}
                               style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                               disabled/>
                    </div>
                    </div>
                <div className="form-row">
                    <div className="campo">
                        <label>Fecha Desde</label>
                        <input
                            type="date"
                            name="fecDesde"
                            value={formData.fecDesde}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '96%'}}
                            required
                        />
                    </div>
                    <div className="campo">
                        <label>Fecha Hasta</label>
                        <input
                            type="date"
                            name="fecHasta"
                            value={formData.fecHasta}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                            required
                        />
                    </div>
                    </div>
                    <div className="form-row">
                        <div className="campo">
                            <label>Tipo de Justificativo</label>
                            <select
                                name="codTipJustificativo"
                                value={formData.codTipJustificativo}
                                onChange={handleChange}
                                style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                                required
                                disabled
                            >
                                <option value="9"> Vacaciones</option>
                            </select>
                        </div>
                        <div className="campo">
                            <label>Descripcion</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}/>
                        </div>
                        </div>
                    <div className="guardar-btn-wrapper">
                        <button onClick={handleSave}>{"Guardar"}</button>
                    </div>
                </div>
                <ToastContainer />
        </div>
    );
};

export default AbmVacaciones;
