import React, { useState, useEffect } from "react";
import "./Vacaciones.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';
import {pdf} from "@react-pdf/renderer";
import InventarioVacacionesPDF from "./InventarioVacacionesPDF.jsx";
import { saveAs } from "file-saver";

const Vacaciones = () => {
    const navigate = useNavigate();
    const [allJustificativos, setAllJustificativos] = useState([]);
    const [justificativos, setJustificativos] = useState([]);
    const [page, setPage] = useState(0);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const pageSize = 100;
    const irAAbmVacaciones = () => {
        navigate("/vacaciones/abm");
    };
    const gestionDoc = () => {
        navigate("/gestion-documentos");
    };

    // 👉 Al cargar, trae todos los justificativos sin filtrar
    useEffect(() => {
        fetchAllJustificativos();
    }, []);

    // 👉 Cada vez que cambia page, actualiza la porción visible
    useEffect(() => {
        setJustificativos(
            allJustificativos.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allJustificativos]);

    const fetchAllJustificativos = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}justificativos/obtenerListaVacaciones`
            );
            const allData = response.data.objeto || [];
            setAllJustificativos(allData);
            setPage(0);
            setJustificativos(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener justificativos:", error);
            setAllJustificativos([]);
            setJustificativos([]);
        }
    };

    const fetchFilteredJustificativos = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}justificativos/obtenerListaJustificativos`
            );
            let allData = response.data.objeto || [];

            if (fechaDesde && fechaHasta) {
                const desde = new Date(fechaDesde);
                const hasta = new Date(fechaHasta);

                allData = allData.filter(j => {
                    const fecha = j.fecha ? new Date(j.fecha) : null;
                    return fecha && fecha >= desde && fecha <= hasta;
                });
            }

            setAllJustificativos(allData);
            setPage(0);
            setJustificativos(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener justificativos:", error);
            setAllJustificativos([]);
            setJustificativos([]);
        }
    };

    const totalPages = Math.ceil(allJustificativos.length / pageSize);

    const [modalVisible, setModalVisible] = useState(false);
    const [fechaDesdeModal, setFechaDesdeModal] = useState("");
    const [fechaHastaModal, setFechaHastaModal] = useState("");

    const handleGenerarInventario = async (desde = "", hasta = "") => {
        try {
            let vacaciones = [];

            if (!desde && !hasta) {
                const resVac = await axios.get(`${API_BASE_URL}justificativos/obtenerListaVacaciones`);
                vacaciones = resVac.data.objeto;
            } else {
                const resFull = await axios.get(`${API_BASE_URL}justificativos/obtenerListaVacaciones`);
                vacaciones = resFull.data.objeto;

                const d = new Date(desde);
                const h = new Date(hasta);
                vacaciones = vacaciones.filter(j => {
                    const fecha = new Date(j.fecha);
                    return fecha >= d && fecha <= h;
                });
            }

            const blob = await pdf(<InventarioVacacionesPDF vacaciones={vacaciones} />).toBlob();
            saveAs(blob, `Inventario_Vacaciones.pdf`);
            setModalVisible(false);
        } catch (error) {
            console.error("Error al generar inventario:", error);
            alert("No se pudo generar el inventario.");
        }
    };

    return (
        <div className="justificativos-container">
            <h2 style={{fontSize: "50px"}}>Vacaciones</h2>
            <p className="acciones-title" style={{fontSize: "25px"}}>Acciones</p>

            <div className="acciones-barra-vacas">
                <button className="boton-accion-vacas" onClick={irAAbmVacaciones}>
                    AGREGAR
                </button>

                <label style={{display: "flex", flexDirection: "column", color: "white"}}>
                    Fecha Desde
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="input-fecha"
                    />
                </label>

                <label style={{display: "flex", flexDirection: "column", color: "white"}}>
                    Fecha Hasta
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="input-fecha"
                    />
                </label>

                <button className="boton-buscar-vacas" onClick={fetchFilteredJustificativos}>
                    BUSCAR
                </button>

                <button className="boton-accion-vacas" onClick={gestionDoc}>
                    GESTION
                </button>

                <button className="boton-accion-vacas" onClick={() => setModalVisible(true)}>
                    EXP. INVENTARIO
                </button>
            </div>
            {modalVisible && (
                <div className="modal-fondo-vacas">
                    <div className="modal-contenido-vacas">
                        <h3>Rango de fechas para el Inventario</h3>
                        <label>
                            Desde:
                            <input
                                type="date"
                                value={fechaDesdeModal}
                                onChange={(e) => setFechaDesdeModal(e.target.value)}
                            />
                        </label>
                        <label>
                            Hasta:
                            <input
                                type="date"
                                value={fechaHastaModal}
                                onChange={(e) => setFechaHastaModal(e.target.value)}
                            />
                        </label>

                        <div style={{ marginTop: "1rem" }}>
                            <button onClick={() => handleGenerarInventario(fechaDesdeModal, fechaHastaModal)}>
                                Generar
                            </button>
                            <button onClick={() => setModalVisible(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="tabla-scroll">
                <table className="tabla-vacaciones">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>C.I Nro.</th>
                        <th>Nombre Completo</th>
                        <th>Tipo Justificativo</th>
                        <th>Descripcion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {justificativos.map((j, index) => (
                        <tr key={index}>
                            <td>{j.nroJustificativo}</td>
                            <td>{j.fecha}</td>
                            <td>{j.persona.nroDocumento}</td>
                            <td>{(j.persona.nombres || "") + " " + (j.persona.apellidos || "")}</td>
                            <td>{j.tipoJustificativo.descripcion}</td>
                            <td>{j.descripcion}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
                <span>Página {page + 1} de {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
            </div>
        </div>
    );
};

export default Vacaciones;
