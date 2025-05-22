import React, { useEffect, useState } from "react";
import "./MarcacionesImportadas.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';

const MarcacionesImportadas = () => {

    const [marcaciones, setMarcaciones] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const obtenerMarcaciones = async () => {
            try {
                const response = await axios.post(`${API_BASE_URL}marcaciones/manuales/obtener`, {
                    nroDocumento: "12344",
                    fecDesde: "2025-05-01",
                    fecHasta: "2025-05-19"
                });

                if (response.data.codigoMensaje === "200") {
                    const datos = response.data.objeto;

                    // Agrupar por nroDocumento (aunque ahora es uno solo)
                    const agrupado = datos.reduce((acc, curr) => {
                        if (!acc[curr.nroDocumento]) acc[curr.nroDocumento] = [];
                        acc[curr.nroDocumento].push(curr);
                        return acc;
                    }, {});

                    const resultado = Object.entries(agrupado).map(([doc, registros], index) => {
                        const fechas = registros.map(r => r.fecha).sort();
                        return {
                            id: index + 1,
                            documento: doc,
                            marcaciones: registros.length,
                            primera: fechas[0],
                            ultima: fechas[fechas.length - 1]
                        };
                    });

                    setMarcaciones(resultado);
                }
            } catch (error) {
                console.error("Error al obtener marcaciones:", error);
            }
        };

        obtenerMarcaciones();
    }, []);

    return (
        <div className="marcaciones-importadas">
            <h1>Marcaciones Importadas</h1>
            <div className="acciones">
                <span className="importar-btn" onClick={() => navigate("/marcaciones")}>← Volver</span>
                <span className="importar-btn"
                      onClick={() => navigate("/marcaciones/importadas/abm")}>＋ Importar Marcaciones</span>
                {/* Este es un comentario dentro del JSX
                <span className="importar-btn"
                      onClick={() => navigate("/marcaciones/pendrive/abm")}>＋ Importar Pendrive</span>
                */}
            </div>
            <div className="tabla">
                <div className="encabezado">
                    <span>ID</span>
                    <span>Nro. de Documento</span>
                    <span>Marcaciones</span>
                    <span>Primera Fecha de Registro</span>
                    <span>Ultima Fecha de Registro</span>
                </div>
                {marcaciones.map((d) => (
                    <div key={d.id} className="fila">
                        <span>{d.id}</span>
                        <span>{d.documento}</span>
                        <span>{d.marcaciones}</span>
                        <span>{d.primera}</span>
                        <span>{d.ultima}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarcacionesImportadas;
