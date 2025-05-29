import React, { useState, useEffect } from "react";
import "./InventarioSalariales.css";
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';
import {pdf} from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const InventarioSalariales = () => {
    const [allInventariosSal, setAllInventariosSal] = useState([]);
    const [InventariosSal, setInventariosSal] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;
    const [periodoBuscar, setPeriodoBuscar] = useState("");

    const obtenerNombreEstado = (codigo) => {
        switch (codigo) {
            case "C": return "CONFIRMADO";
            case "R": return "RECHAZADO";
            default: return "-";
        }
    };

    useEffect(() => {
        fetchAllInventariosSal();
    }, []);

    useEffect(() => {
        setInventariosSal(
            allInventariosSal.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allInventariosSal]);

    const fetchAllInventariosSal = async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}personas/documentos/inventarios/obtenerLista`,
                {
                    periodo: {
                        nroPeriodo: 5
                    }
                }
            );
            const allData = response.data.objeto || [];

            const mapped = allData.map(item => item.inventarioDocumento);
            setAllInventariosSal(mapped);
            setPage(0);
            setInventariosSal(mapped.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener Inventario Salarial:", error);
            setAllInventariosSal([]);
            setInventariosSal([]);
        }
    };

    const fetchFilteredJustificativos = async () => {
        try {


            const response = await axios.post(
                `${API_BASE_URL}justificativos/obtenerListaJustificativos`
            );
            let allData = response.data.objeto || [];

            setAllInventariosSal(allData);
            setPage(0);
            setInventariosSal(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener justificativos:", error);
            setAllInventariosSal([]);
            setInventariosSal([]);
        }
    };

    const totalPages = Math.ceil(allInventariosSal.length / pageSize);

    const [modalVisible, setModalVisible] = useState(false);
    const [periodoModal, setPeriodoModal] = useState("");

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

    const handleEstadoChange = async (item, nuevoEstado) => {
        try {
            const payload = {
                empleado: {
                    codEmpleado: item?.empleado?.codEmpleado
                },
                periodo: {
                    nroPeriodo: 5 // Asegurate que sea el periodo correcto (podés usar estado global si lo hacés dinámico)
                },
                estado: nuevoEstado,
                comentario: "Actualizado desde la interfaz"
            };

            const url = (!item.estado && !item.id)
                ? `${API_BASE_URL}personas/documentos/inventarios/crear`
                : `${API_BASE_URL}personas/documentos/inventarios/actualizar`;

            const method = (!item.estado && !item.id) ? axios.post : axios.put;

            await method(url, payload);
            toast.success("Estado actualizado correctamente");
            fetchAllInventariosSal();
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            toast.error("No se pudo actualizar el estado");
        }
    };

    const filtrarPorPeriodo = () => {
        const filtrado = allInventariosSal.filter(
            (s) => s.periodo.nroPeriodo === periodoBuscar
        );
        setInventariosSal(filtrado);
    };

    return (
        <div className="inv-salarios-container">
            <h2 style={{fontSize: "30px"}}>Inventario de Documentos para Pago de Nómina</h2>
            <p className="acciones-title" style={{fontSize: "25px"}}>Acciones</p>

            <div className="acciones-barra-inv-salarial">
                <input
                    type="text"
                    placeholder="Periodo (Ej: 2025/05)"
                    value={periodoBuscar}
                    onChange={(e) => setPeriodoBuscar(e.target.value)}
                    className="periodo-input"
                />
                <button className="primary-btn" onClick={filtrarPorPeriodo}>
                    Buscar
                </button>
            </div>
            {modalVisible && (
                <div className="modal-fondo-inv-salario">
                    <div className="modal-contenido-inv-salario">
                    <h3>Ingrese Periodo para el Inventario</h3>
                        <label>
                            Periodo:
                            <input
                                type="text"
                                value={periodoModal}
                                onChange={(e) => setPeriodoModal(e.target.value)}
                            />
                        </label>

                        <div style={{ marginTop: "1rem" }}>
                            <button onClick={() => handleGenerarInventario(periodoModal)}>
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
                        <th>C.I Nro.</th>
                        <th>Nombre Completo</th>
                        <th>Direccion</th>
                        <th>Departamento</th>
                        <th>Cargo</th>
                        <th>Asignacion</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {InventariosSal.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.empleado?.persona?.nroDocumento}</td>
                            <td>{`${item?.empleado?.persona?.nombres || ""} ${item?.empleado?.persona?.apellidos || ""}`}</td>
                            <td>{item?.empleado?.cargo?.departamento?.direccion?.descripcion.replace(/^DIRECCION DE\s+/i, "") || "-"}</td>
                            <td>{item?.empleado?.cargo?.departamento?.descripcion.replace(/^DEPARTAMENTO DE\s+/i, "") || "-"}</td>
                            <td>{item?.empleado?.cargo?.descripcion || "-"}</td>
                            <td>{item?.empleado?.asignacion?.toLocaleString("es-PY", {
                                style: "currency",
                                currency: "PYG"
                            }) || "-"}</td>
                            <td>
                                <select
                                className="select-estado"
                                value={item.estado || ""}
                                onChange={(e) => handleEstadoChange(item, e.target.value)}
                            >
                                <option value="" disabled>Seleccionar estado</option>
                                <option value="C">Confirmado</option>
                                <option value="R">Rechazado</option>
                                </select>
                            </td>
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
            <ToastContainer/>
        </div>
    );
};

export default InventarioSalariales;
