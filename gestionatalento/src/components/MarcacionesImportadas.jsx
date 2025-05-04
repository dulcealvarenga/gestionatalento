import React from "react";
import "./MarcacionesImportadas.css";
import { useNavigate } from "react-router-dom";

const MarcacionesImportadas = () => {
    const datos = [
        { id: 1, documento: "1.234.567", marcaciones: 50, primera: "01/01/2022", ultima: "30/11/2024" },
        { id: 2, documento: "1.234.567", marcaciones: 50, primera: "01/01/2022", ultima: "30/11/2024" },
        { id: 3, documento: "1.234.567", marcaciones: 50, primera: "01/01/2022", ultima: "30/11/2024" },
        { id: 4, documento: "1.234.567", marcaciones: 50, primera: "01/01/2022", ultima: "30/11/2024" },
    ];

    const navigate = useNavigate();

    return (
        <div className="marcaciones-importadas">
            <h1>Marcaciones Importadas</h1>
            <div className="acciones">
                <span className="importar-btn" onClick={() => navigate("/marcaciones")}>← Volver</span>
                <span className="importar-btn"
                      onClick={() => navigate("/marcaciones/importadas/abm")}>＋ Importar Marcaciones</span>
                <span className="importar-btn"
                      onClick={() => navigate("/marcaciones/pendrive/abm")}>＋ Importar Pendrive</span>
            </div>
            <div className="tabla">
                <div className="encabezado">
                    <span>ID</span>
                    <span>Nro. de Documento</span>
                    <span>Marcaciones</span>
                    <span>Primera Fecha de Registro</span>
                    <span>Ultima Fecha de Registro</span>
                </div>
                {datos.map((d) => (
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
