import React, { useEffect, useState } from "react";
import "./Contratos.css"; // usa el mismo estilo visual dark
import axios from "axios";
import { useNavigate } from "react-router-dom";
//Esto es lo nuevo
const Contratos = () => {
    const [listaContratos, setListaContratos] = useState([]);
    const [allContratos, setAllContratos] = useState([]);
    const [setContratos] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;

    // 👉 Al cargar, trae todos
    useEffect(() => {
        fetchAllContratos();
    }, []);

    // 👉 Cada vez que cambia page, actualiza la porción visible
    useEffect(() => {
        setContratos(
            allContratos.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allContratos]);

    const fetchAllContratos = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/contratos/obtenerLista'
            );
            const allData = response.data.objeto || [];
            setAllContratos(allData);
            setPage(0);
            setContratos(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener contratos:", error);
            setAllContratos([]);
            setContratos([]);
        }
    };

    const navigate = useNavigate();
    useEffect(() => {
        // Simulación o llamada real
        axios
            .get("http://localhost:8080/contratos/obtenerLista")
            .then((res) => setListaContratos(res.data.objeto))
            .catch((err) => console.error("Error al obtener contratos:", err));
    }, []);

    const totalPages = Math.ceil(allContratos.length / pageSize);

    return (
        <div className="contratos-container">
            <h1>Contratos</h1>
            <p className="acciones-title-con">Acciones</p>
            <button
                className="boton-accion"
                onClick={() => navigate("/contratos/abm")}
            >
                AGREGAR
            </button>
            <div className="tabla-scroll">
                <table className="tabla-empleados">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nro. de Documento</th>
                        <th>Nombre Completo</th>
                        <th>Periodo</th>
                        <th>Estado</th>
                        <th>Observación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listaContratos.map((contrato, index) => (
                        <tr key={index}>
                            <td>{contrato.contrato.nroContrato}</td>
                            <td>{contrato.contrato.nroDocumento}</td>
                            <td>{contrato.contrato.nombres} {contrato.contrato.apellidos}</td>
                            <td>{contrato.contrato.periodo.codPeriodo}</td>
                            <td>{contrato.contrato.estado || "-"}</td>
                            <td>{contrato.contrato.observacion || "-"}</td>
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

export default Contratos;