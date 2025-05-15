import React, { useState, useEffect } from "react";
import "./GestionDocumentos.css";
import axios from "axios";

const GestionDocumentos = () => {
    const [allJustificativos, setAllJustificativos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;
    const [filtroTipo, setFiltroTipo] = useState("");

    // 👉 Al cargar, trae todos los justificativos sin filtrar
    useEffect(() => {
        fetchAllJustificativos();
    }, []);

    // 👉 Cada vez que cambia page, actualiza la porción visible
    useEffect(() => {
        setDocumentos(
            allJustificativos.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allJustificativos]);

    useEffect(() => {
        const filtrados = filtroTipo === ""
            ? allJustificativos
            : allJustificativos.filter(j => j.tipoJustificativo.descripcion === filtroTipo);

        setDocumentos(
            filtrados.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allJustificativos, filtroTipo]);

    const fetchAllJustificativos = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/justificativos/obtenerListaVacaciones'
            );
            const allData = response.data.objeto || [];
            setAllJustificativos(allData);
            setPage(0);
            setDocumentos(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener justificativos:", error);
            setAllJustificativos([]);
            setDocumentos([]);
        }
    };

    const totalPages = Math.ceil(
        (filtroTipo === ""
                ? allJustificativos.length
                : allJustificativos.filter(j => j.tipoJustificativo.descripcion === filtroTipo).length
        ) / pageSize
    );

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
                            <td>{j.tipoJustificativo.descripcion}</td>
                            <td>{(j.persona.nombres || "") + " " + (j.persona.apellidos || "")}</td>
                            <td>{j.fecha}</td>
                            <td>{j.fecha}</td>
                            <td>{j.estado}</td>
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

export default GestionDocumentos;
