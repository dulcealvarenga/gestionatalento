import React, { useState, useEffect } from "react";
import "./GestionDocumentos.css";
import axios from "axios";

const GestionDocumentos = () => {
    const [allDocumentos, setAllDocumentos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;
    const [filtroTipo, setFiltroTipo] = useState("");

    const estadosHabilitados = {
        1: "CARGADO",
        2: "CONFIRMADO",
        3: "ANULADO",
    };

    const opcionesEstadoPorTipo = {
        "CONTRATO": [
            { label: "CONFIRMADO", value: 2 },
            { label: "ANULADO", value: 3 }
        ],
        "JUSTIFICATIVO": [
            { label: "CONFIRMADO", value: 2 },
            { label: "ANULADO", value: 3 }
        ],
        "VACACIONES": [
            { label: "CONFIRMADO", value: 2 },
            { label: "ANULADO", value: 3 }
        ]
    };

    useEffect(() => {
        fetchAllDocumentos();
    }, []);

    useEffect(() => {
        setDocumentos(
            allDocumentos.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allDocumentos]);

    useEffect(() => {
        const filtrados = filtroTipo === ""
            ? allDocumentos
            : allDocumentos.filter(d => d.tipo === filtroTipo);

        setDocumentos(
            filtrados.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allDocumentos, filtroTipo]);

    const fetchAllDocumentos = async () => {
        try {
            const [justRes, vacRes, contRes] = await Promise.all([
                axios.get('http://localhost:8080/justificativos/obtenerListaJustificativos'),
                axios.get('http://localhost:8080/justificativos/obtenerListaVacaciones'),
                axios.get('http://localhost:8080/contratos/obtenerLista')
            ]);
            console.log("Justificativos: ", justRes.data.objeto);
            console.log("Vacaciones: ", vacRes.data.objeto);
            console.log("Contratos: ", contRes.data.objeto);

            const justData = justRes.data.objeto?.map(j => ({
                tipo: j.tipoJustificativo?.codTipJustificativo === 9
                    ? "Vacaciones"
                    : "Justificativo",
                persona: j.persona,
                fechaInicio: j.fecha,
                fechaFin: j.estado === 1 ? null : null,
                estado: j.estado,
                descripcion: j.tipoJustificativo.descripcion || "-"
            })) || [];

            const vacData = vacRes.data.objeto?.map(j => ({
                tipo: j.tipoJustificativo?.codTipJustificativo === 9
                    ? "Vacaciones"
                    : "Justificativo",
                persona: j.persona,
                fechaInicio: j.fecha,
                fechaFin: j.estado === 1 ? null : j.fecha,
                estado: j.estado,
                descripcion: j.tipoJustificativo.descripcion
            })) || [];

            const contData = contRes.data.objeto?.map(c => ({
                tipo: "Contrato",
                persona: {
                    nombres: c.contrato.nombres,
                    apellidos: c.contrato.apellidos
                },
                fechaInicio: c.contrato.fecDesde,
                fechaFin: c.estado === 1 ? null : c.fecha,
                estado: c.contrato.estado,
                descripcion: "Contrato"
            })) || [];

            const todo = [...justData, ...contData, ...vacData];
            setAllDocumentos(todo);
            console.log(todo);
            setPage(0);
            setDocumentos(todo.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener documentos:", error);
            setAllDocumentos([]);
            setDocumentos([]);
        }
    };

    const totalPages = Math.ceil(
        (filtroTipo === ""
                ? allDocumentos.length
                : allDocumentos.filter(d => d.tipo === filtroTipo).length
        ) / pageSize
    );

    const [modalAbierto, setModalAbierto] = useState(false);
    const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState("");
    const [comentario, setComentario] = useState("");

    const abrirModal = (doc) => {
        setDocumentoSeleccionado(doc);
        setNuevoEstado(doc.estado); // valor por defecto
        setComentario("");
        setModalAbierto(true);
    };

    const confirmarCambioEstado = () => {
        const fechaHoy = new Date().toISOString().split("T")[0];

        const actualizado = allDocumentos.map((doc) => {
            if (doc === documentoSeleccionado) {
                const nuevaFechaFin = nuevoEstado === "2" ? fechaHoy : doc.fechaFin;
                return {
                    ...doc,
                    estado: nuevoEstado,
                    comentario: comentario,
                    fechaFin: nuevaFechaFin,
                };
            }
            return doc;
        });

        setAllDocumentos(actualizado);
        setModalAbierto(false);
    };

    return (
        <div className="documentos-container">
            <h2 style={{fontSize: "50px"}}>Gestión de Documentos</h2>
            <p className="acciones-title" style={{fontSize: "25px"}}>Acciones</p>

            <div className="acciones-barra-doc">
                {/* 👉 Nuevo filtro por tipo de documento */}
                <select
                    value={filtroTipo}
                    onChange={(e) => {
                        setFiltroTipo(e.target.value);
                        setPage(0);    // resetear a primera página
                    }}
                    className="filtro-select"
                >
                    <option value="">Filtrar por</option>
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Justificativo">Justificativo</option>
                    <option value="Contrato">Contrato</option>
                </select>

            </div>
            <div className="tabla-scroll">
                <table className="tabla-documentos">
                    <thead>
                    <tr>
                        <th>Tipo de Documento</th>
                        <th>Subtipo</th>
                        <th>Funcionario</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {documentos.map((j, index) => (
                        <tr key={index}>
                            <td>{j.tipo}</td>
                            <td>{j.descripcion}</td>
                            <td>{(j.persona.nombres || "") + " " + (j.persona.apellidos || "")}</td>
                            <td>{j.fechaInicio}</td>
                            <td>{j.fechaFin}</td>
                            <td>{estadosHabilitados[j.estado] || ""}</td>
                            <td>
                                <button onClick={() => abrirModal(j)}>Cambiar Estado</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {modalAbierto && (
                    <div className="modal-doc">
                        <div className="modal-content-doc">
                            <h3>Cambiar Estado del Documento</h3>
                            <p><strong>Tipo de Documento:</strong> {documentoSeleccionado.tipo}</p>
                            <p><strong>Funcionario:</strong> {documentoSeleccionado.persona.nombres} {documentoSeleccionado.persona.apellidos}</p>
                            <p><strong>Estado Actual:</strong> {estadosHabilitados[documentoSeleccionado.estado] || ""}</p>
                            <label>Nuevo Estado:</label>
                            <select
                                value={nuevoEstado}
                                onChange={(e) => setNuevoEstado(e.target.value)}
                            >
                                <option value="">Seleccionar nuevo estado</option>
                                {(opcionesEstadoPorTipo[documentoSeleccionado.tipo.toUpperCase()] || []).map(op => (
                                    <option key={op.value} value={op.value}>{op.label}</option>
                                ))}
                            </select>
                            <label>Comentario:</label>
                            <textarea value={comentario} onChange={(e) => setComentario(e.target.value)}/>

                            <div className="modal-buttons-doc">
                                <button onClick={() => setModalAbierto(false)}>Cancelar</button>
                                <button onClick={() => confirmarCambioEstado()}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
                <span>Página {page + 1} de {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
            </div>
        </div>
    );
};

export default GestionDocumentos;
