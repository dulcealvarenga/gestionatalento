import React, { useState, useEffect } from "react";
import "./Justificativos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Justificativos = () => {
    const navigate = useNavigate();
    const [allJustificativos, setAllJustificativos] = useState([]);
    const [justificativos, setJustificativos] = useState([]);
    const [page, setPage] = useState(0);
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const pageSize = 100;

    const irAAbmJustificativos = () => {
        navigate("/justificativos/abm");
    };

    // 👉 Al cargar, trae todos
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
                'http://localhost:8080/justificativos/obtenerListaJustificativos'
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
                'http://localhost:8080/justificativos/obtenerListaJustificativos'
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

    return (
        <div className="justificativos-container">
            <h2 style={{ fontSize: "50px" }}>Justificativos</h2>
            <p className="acciones-title" style={{ fontSize: "25px" }}>Acciones</p>

            <div className="acciones-barra-jus">
                <button className="boton-accion-jus" onClick={irAAbmJustificativos}>
                    AGREGAR
                </button>

                <label style={{ display: "flex", flexDirection: "column", color: "white" }}>
                    Fecha Desde
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="input-fecha"
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column", color: "white" }}>
                    Fecha Hasta
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        className="input-fecha"
                    />
                </label>

                <button className="boton-buscar-jus" onClick={fetchFilteredJustificativos}>
                    BUSCAR
                </button>
            </div>

            <div className="tabla-scroll">
                <table className="tabla-justificativos">
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
                            <td>{j.persona?.nroDocumento}</td>
                            <td>{`${j.persona?.nombres || ""} ${j.persona?.apellidos || ""}`}</td>
                            <td>{j.tipoJustificativo?.descripcion}</td>
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

export default Justificativos;
