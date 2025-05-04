import React, { useState, useEffect } from "react";
import "./Eventos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Eventos = () => {
    const navigate = useNavigate();
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/configuraciones/eventos/obtenerLista")
            .then((res) => {
                if (res.data && res.data.objeto && res.data.objeto.length > 0) {
                    const eventosObtenidos = res.data.objeto.map((e) => e.evento);
                    setEventos(eventosObtenidos);
                } else {
                    // cargarDatosFicticios(); // Puedes descomentar si tienes datos ficticios preparados
                }
            })
            .catch((error) => {
                console.error("Error al obtener eventos desde API", error);
                // cargarDatosFicticios(); // Puedes descomentar si tienes datos ficticios preparados
            });
    }, []);

    return (
        <div className="eventos-container">
            <h1>Eventos</h1>
            <div className="acciones-eventos">
                <button onClick={() => navigate("/configuraciones")}>
                    ← VOLVER
                </button>
                <button onClick={() => navigate("/configuraciones/eventos/abm")}>
                    AGREGAR
                </button>
            </div>
            <table className="tabla-eventos">
                <thead>
                <tr>
                <th>ID</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Tipo de Evento</th>
                        {/* ✅ Cambiado */}
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {eventos.map((evento) => (
                        <tr key={evento.nroEvento}>
                            <td>{evento.nroEvento}</td>
                            <td>{evento.descripcion}</td>
                            <td>{evento.vigente === "S" ? "SI" : "NO"}</td>
                            <td>{evento.fecha}</td>
                            <td>{evento.tipoEvento.descripcion || "-"}</td>
                            {/* ✅ Cambiado */}
                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/configuraciones/eventos/abm/${evento.nroEvento}`)
                                    }
                                >
                                    ✏️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            );
            };

            export default Eventos;
