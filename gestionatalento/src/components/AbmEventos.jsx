import React, { useState, useEffect } from "react";
import "./AbmEventos.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AbmEventos = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [evento, setEvento] = useState({
        descripcion: "",
        estado: "Activo",
        fecha: "",
        tipoExoneracion: "1", // Por defecto Total
    });

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/eventos/${id}`).then((res) => {
                const eventoData = res.data;

                setEvento({
                    descripcion: eventoData.descripcion,
                    estado: eventoData.estado,
                    fecha: eventoData.fecha ? eventoData.fecha.substring(0, 10) : "",
                    tipoExoneracion:
                        eventoData.tipoEvento?.codTipEvento?.toString() || "1", // Cargamos el ID
                });
            });
        }
    }, [id]);

    const handleSave = async () => {
        if (!evento.descripcion || !evento.fecha) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const eventoParaEnviar = {
            descripcion: evento.descripcion,
            estado: evento.estado,
            fecha: evento.fecha,
            tipoEvento: {
                codTipEvento: parseInt(evento.tipoExoneracion), // Mandamos como objeto con ID
            },
        };

        try {
            if (id) {
                await axios.put(
                    `http://localhost:8080/eventos/${id}`,
                    eventoParaEnviar
                );
                alert("Evento actualizado con éxito");
            } else {
                await axios.post(
                    "http://localhost:8080/configuraciones/eventos/crear",
                    eventoParaEnviar
                );
                alert("Evento creado con éxito");
            }

            navigate("/configuraciones/eventos");
        } catch (error) {
            console.error("Error al guardar evento:", error);
            alert("Error al guardar evento");
        }
    };

    return (
        <div className="abm-eventos-container">
            <div className="abm-eventos-card">
                <h1>{id ? "Editar Evento" : "Agregar Evento"}</h1>
                <div className="volver" onClick={() => navigate("/configuraciones/eventos")}>← Volver</div>
                <div className="form-group">
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Descripción</label>
                    <input
                        type="text"
                        placeholder="Ingrese la descripción"
                        value={evento.descripcion}
                        onChange={(e) =>
                            setEvento({...evento, descripcion: e.target.value})
                        }
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Estado</label>
                    <select
                        value={evento.estado}
                        onChange={(e) => setEvento({...evento, estado: e.target.value})}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                    >
                        <option>Activo</option>
                        <option>Inactivo</option>
                    </select>
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Fecha</label>
                    <input
                        type="date"
                        value={evento.fecha}
                        onChange={(e) => setEvento({...evento, fecha: e.target.value})}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Tipo de Exoneración</label>
                    <select
                        value={evento.tipoExoneracion}
                        onChange={(e) =>
                            setEvento({...evento, tipoExoneracion: e.target.value})
                        }
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                    >
                        <option value="1">Total</option>
                        <option value="2">Parcial</option>
                    </select>
                </div>

                <div className="agregar-actions">
                    <button onClick={handleSave}>{id ? "Actualizar" : "Guardar"}</button>
                    <button onClick={() => navigate("/configuraciones/eventos")}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default AbmEventos;
