import React, { useEffect, useState } from "react";
import "./Contratos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config/constantes.js';
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import ContratoPDF from "./ContratoPDF";
import InventarioContratosPDF from "./InventarioContratosPDF";

const Contratos = () => {
    const [listaContratos, setListaContratos] = useState([]);
    const [allContratos, setAllContratos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;

    const estadosContratos = {
        1: "Cargado",
        2: "Confirmado"
    };

    useEffect(() => {
        fetchAllContratos();
    }, []);

    const fetchAllContratos = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}contratos/obtenerLista`
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
            .get(`${API_BASE_URL}contratos/obtenerLista`)
            .then((res) => setListaContratos(res.data.objeto))
            .catch((err) => console.error("Error al obtener contratos:", err));
    }, []);

    const totalPages = Math.ceil(allContratos.length / pageSize);

    const gestionDoc = () => {navigate("/gestion-documentos");};

    const handleReimprimir = async (contrato) => {
        try {
            const blob = await pdf(<ContratoPDF contrato={contrato} />).toBlob();
            const nombreArchivo = `Contrato_${contrato.nroContrato}_${contrato.nroDocumento}.pdf`;
            saveAs(blob, nombreArchivo);
        } catch (error) {
            console.error("Error al generar contrato:", error);
            alert("No se pudo generar el contrato.");
        }
    };

    const [filtroDocumento, setFiltroDocumento] = useState("");
    const [filtroPeriodo, setFiltroPeriodo] = useState("");

    useEffect(() => {
        const filtrados = allContratos.filter((item) => {
            const docOK = filtroDocumento === "" || item.contrato.nroDocumento.includes(filtroDocumento);
            const periodoOK = filtroPeriodo === "" || item.contrato.periodo.codPeriodo.includes(filtroPeriodo);
            return docOK && periodoOK;
        });

        setContratos(
            filtrados.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allContratos, filtroDocumento, filtroPeriodo]);

    const handleGenerarInventario = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}contratos/obtenerLista`);
            const contratos = response.data.objeto.map(c => c.contrato);

            const blob = await pdf(<InventarioContratosPDF contratos={contratos} />).toBlob();
            saveAs(blob, `Inventario_Contratos.pdf`);
        } catch (error) {
            console.error("Error al generar inventario:", error);
            alert("No se pudo generar el inventario.");
        }
    };

    return (
        <div className="contratos-container">
            <h1>Contratos</h1>
            <p className="acciones-title-con">Acciones</p>
            <button
                className="boton-accion-contratos"
                onClick={() => navigate("/contratos/abm")}
            >
                AGREGAR
            </button>
            <button className="boton-accion-contratos" onClick={gestionDoc}>
                GESTION
            </button>
            <button className="boton-accion-contratos" onClick={handleGenerarInventario}>
                EXP. INVENTARIO
            </button>
            <div className="filtros-contratos">
                <label>
                    Nro. Documento:&nbsp;
                    <input
                        type="text"
                        value={filtroDocumento}
                        onChange={(e) => {
                            setFiltroDocumento(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Ej: 5198963"
                    />
                </label>
                &nbsp;&nbsp;
                <label>
                    Período:&nbsp;
                    <input
                        type="text"
                        value={filtroPeriodo}
                        onChange={(e) => {
                            setFiltroPeriodo(e.target.value);
                            setPage(0);
                        }}
                        placeholder="Ej: 2025/05"
                    />
                </label>
            </div>
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
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contratos.map((contrato, index) => (
                        <tr key={index}>
                            <td>{contrato.contrato.nroContrato}</td>
                            <td>{contrato.contrato.nroDocumento}</td>
                            <td>{contrato.contrato.nombres} {contrato.contrato.apellidos}</td>
                            <td>{contrato.contrato.periodo.codPeriodo}</td>
                            <td>{estadosContratos[contrato.contrato.estado] || ""}</td>
                            <td>{contrato.contrato.observacion || "-"}</td>
                            <td>
                                <button className="btn-accion"
                                        onClick={() => handleReimprimir(contrato.contrato)}>
                                    <img src="/descargas.png" alt="Descargar" className="icono-accion"/>
                                </button>
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
        </div>
    );
};

export default Contratos;