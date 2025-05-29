import React, { useState, useEffect } from "react";
import "./VacacionesDet.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';
import {pdf} from "@react-pdf/renderer";
import InventarioVacacionesPDF from "./InventarioVacacionesPDF.jsx";
import { saveAs } from "file-saver";
import InventarioVacacionesDispPDF from "./InventarioVacacionesDispPDF.jsx";

const Vacaciones = () => {
    const navigate = useNavigate();
    const [allInventarios, setAllInventarios] = useState([]);
    const [Inventarios, setInventarios] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;

    const volver = () => {
        navigate("/vacaciones");
    };

    useEffect(() => {
        fetchAllInventarios();
    }, []);

    // 👉 Cada vez que cambia page, actualiza la porción visible
    useEffect(() => {
        setInventarios(
            allInventarios.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allInventarios]);

    const fetchAllInventarios = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}vacaciones/obtenerInventario`
            );
            const allData = response.data.objeto || [];
            setAllInventarios(allData);
            setPage(0);
            setInventarios(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener Inv. de Vacaciones:", error);
            setAllInventarios([]);
            setInventarios([]);
        }
    };
    const totalPages = Math.ceil(allInventarios.length / pageSize);

    const handleGenerarInventario = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}vacaciones/obtenerInventario`);
            const vacaciones = res.data.objeto?.map(v => v.inventarioVacacion) || [];

            const blob = await pdf(<InventarioVacacionesDispPDF vacaciones={vacaciones} />).toBlob();
            saveAs(blob, `Inventario_Vacaciones_Disp.pdf`);
        } catch (error) {
            console.error("Error al generar inventario:", error);
            alert("No se pudo generar el inventario.");
        }
    };


    const [funcBuscar, setFuncBuscar] = useState("");

    const filtrarPorFuncionario = () => {
        const documentoBuscar = funcBuscar.trim();

        if (!documentoBuscar) {
            setInventarios(allInventarios.slice(page * pageSize, (page + 1) * pageSize));
            return;
        }

        const filtrado = allInventarios.filter(item => {
            const nroDoc = item.inventarioVacacion?.empleado?.persona?.nroDocumento || "";
            return nroDoc.includes(documentoBuscar);
        });

        setInventarios(filtrado.slice(0, pageSize));
        setPage(0); // Reiniciamos paginación
    };

    return (
        <div className="vacaciones-det-container">
            <h2 style={{fontSize: "50px"}}>Detalle de Vacaciones</h2>
            <p className="acciones-title" style={{fontSize: "25px"}}>Acciones</p>

            <div className="acciones-barra-vacas-det">
                <button className="boton-accion-vacas-det"onClick={volver} >
                    VOLVER
                </button>
                <input
                    type="text"
                    placeholder="Funcionario"
                    value={funcBuscar}
                    onChange={(e) => setFuncBuscar(e.target.value)}
                    className="periodo-input"
                />
                <button className="boton-accion-vacas-det" onClick={filtrarPorFuncionario}>
                    BUSCAR
                </button>
                <button className="boton-accion-vacas-det" onClick={handleGenerarInventario}>
                    EXP. INVENTARIO
                </button>
            </div>
            <div className="tabla-scroll">
                <table className="tabla-vacaciones">
                    <thead>
                    <tr>
                        <th>Nro</th>
                        <th>C.I Nro.</th>
                        <th>Nombre Completo</th>
                        <th>Dias Generados</th>
                        <th>Dias Reservados</th>
                        <th>Dias Utilizados</th>
                        <th>Dias Disponibles</th>
                        <th>Fecha de Generación</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Inventarios.map((item, index) => {
                        const inv = item.inventarioVacacion;
                        const persona = inv.empleado.persona;
                        const diasDisponibles = inv.cantidadGenerada - inv.cantidadReservado;

                        return (
                            <tr key={index}>
                                <td>{inv.nroInventario}</td>
                                <td>{persona.nroDocumento}</td>
                                <td>{`${persona.nombres} ${persona.apellidos}`}</td>
                                <td>{inv.cantidadGenerada}</td>
                                <td>{inv.cantidadReservado}</td>
                                <td>{inv.cantidadUtilizado}</td>
                                <td>{diasDisponibles}</td>
                                <td>{inv.fecUltimaGeneracion}</td>
                            </tr>
                        );
                    })}
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
