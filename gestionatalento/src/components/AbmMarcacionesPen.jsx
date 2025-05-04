import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AbmMarcacionesPen.css";

const AbmMarcacionesPen = () => {
    const navigate = useNavigate();
    const [attlogFile, setAttlogFile] = useState(null);

    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (tipo === "attlog") setAttlogFile(file);
    };

    const handleImportar = () => {
        console.log("Archivo ATTLOG:", attlogFile);
        // Enviar con FormData si hace falta
    };

    return (
        <div className="abm-importadas-pen-container">
            <h1 className="titulo">ABM Marcaciones Pendrive</h1>
            <div className="volver" onClick={() => navigate("/marcaciones/importadas")}>← Volver</div>

            <div className="file-section">
                <div className="file-upload">
                    <label htmlFor="attlog">Archivo ATTLOG</label>
                    <label htmlFor="attlog" className="file-button">
                        <span>SELECCIONAR</span> {attlogFile?.name || "Ningún Archivo Seleccionado"}
                    </label>
                    <input id="attlog" type="file" onChange={(e) => handleFileChange(e, "attlog")} />
                </div>
            </div>

            <button className="importar-btn" onClick={handleImportar}>IMPORTAR</button>
        </div>
    );
};

export default AbmMarcacionesPen;
