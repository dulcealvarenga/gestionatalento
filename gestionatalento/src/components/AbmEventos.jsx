import React, { useState, useEffect } from "react";
import "./AbmEventos.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from '../config/constantes.js';

const AbmEventos = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tiposEvento, setTiposEvento] = useState([]);

    const [formData, setFormData] = useState({
        nroEvento: "",
        descripcion: "",
        fecha: "",
        horaInicial: "",
        horaFinal: "",
        vigente: "",
        codTipEvento: ""
    });

    useEffect(() => {
        const fetchTiposEvento = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}configuraciones/tipos-eventos/obtenerListaActiva`);
                setTiposEvento(response.data.objeto);
            } catch (error) {
                console.error("Error al cargar tipos de evento:", error);
            }
        };

        fetchTiposEvento();
    }, []);

    useEffect(() => {
        const fetchEvento = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${API_BASE_URL}configuraciones/eventos/obtener/id/` + id);
                    const genericResponse = response.data;
                    const eventoData = genericResponse.objeto;
    
                    if (genericResponse.codigoMensaje === "200") {
                        setFormData({
                            nroEvento: eventoData.nroEvento,
                            descripcion: eventoData.descripcion,
                            vigente: eventoData.estado,
                            fecha: eventoData.fecha ? eventoData.fecha.substring(0, 10) : "",
                            codTipEvento: eventoData.tipoEvento?.codTipEvento?.toString() || ""
                        });
                        toast.dismiss();
                        toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    } else {
                        toast.error(genericResponse.mensaje, { autoClose: 2000 });
                    }
                } catch (error) {
                    console.error("Error al cargar el evento:", error);
                    toast.error("Error al cargar el evento", { autoClose: 2000 });
                }
            }
        };
    
        fetchEvento();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const requiredInputs = document.querySelectorAll("input[required], select[required]");

        // Filtrar los que están vacíos
        const emptyFields = Array.from(requiredInputs).filter(input => !input.value.trim());

        if (emptyFields.length > 0) {
            toast.info("Debe completar los datos obligatorios", { autoClose: 2000 });
            return;
        }

        const evento = {
            nroEvento: formData.nroEvento,
            descripcion: formData.descripcion,
            vigente: formData.vigente,
            fecha: formData.fecha,
            tipoEvento: {
                codTipEvento: parseInt(formData.codTipEvento),
            },
        };
        try {
           
            if (id) {
                const response = await axios.put(`${API_BASE_URL}configuraciones/eventos/actualizar`, evento);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    setTimeout(() => {
                        navigate("/configuraciones/eventos");
                    }, 2000);
                } else {
                    toast.error(genericResponse.mensaje, { autoClose: 2000 });
                }
            } else {
                const response = await axios.post(`${API_BASE_URL}configuraciones/eventos/crear`, evento);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    setTimeout(() => {
                        navigate("/configuraciones/eventos");
                    }, 2000);
                } else {
                    toast.error(genericResponse.mensaje, { autoClose: 2000 });
                }
            }
            
        } catch (error) {
            console.error("Error al guardar evento:", error);
            alert("Error al guardar evento");
        }
    };

    return (
        <div className="abm-eventos-container">
            <div className="abm-eventos-card">
                <h1>{id ? "Editar Evento" : "Agregar Evento"}</h1>
                <div className="acciones-eventos-abm">
                    <button onClick={() => navigate("/configuraciones/eventos")}>
                        ← VOLVER
                    </button>
                </div>
                    <div className="form-group">
                        <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            placeholder="Ingrese la descripción"
                            value={formData.descripcion}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                            required
                        />
                        <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                            required
                        />
                        <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Tipo de Evento</label>
                        <select
                            name="codTipEvento"
                            value={formData.codTipEvento}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            {tiposEvento.map((evento) => (
                                <option key={evento.codTipEvento} value={evento.codTipEvento}>
                                    {evento.descripcion}
                                </option>
                            ))}
                        </select>
                        <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Vigente</label>
                        <select
                            name="vigente"
                            value={formData.vigente}
                            onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                            required
                        >
                            <option value="S">SÍ</option>
                            <option value="N">NO</option>
                        </select>
                    </div>

                    <div className="agregar-actions">
                        <button onClick={handleSave}>{id ? "Actualizar" : "Guardar"}</button>
                        <button onClick={() => navigate("/configuraciones/eventos")}>Cancelar</button>
                    </div>
                </div>
                <ToastContainer/>
            </div>
            );
            };

            export default AbmEventos;
