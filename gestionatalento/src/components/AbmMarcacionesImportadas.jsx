import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AbmMarcacionesImportadas.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../config/constantes.js';

const AbmMarcacionesImportadas = () => {
    const navigate = useNavigate();
    const [userinfoFile, setUserinfoFile] = useState(null);
    const [checkoutFile, setCheckoutFile] = useState(null);

    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (tipo === "userinfo") setUserinfoFile(file);
        else if (tipo === "checkout") setCheckoutFile(file);
    };

    const handleImportar = async () => {
        try {
            if (userinfoFile) {
                const formData = new FormData();
                formData.append("file", userinfoFile);

                const response = await axios.post(`${API_BASE_URL}marcaciones/exportacion/cargar-usuario`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.codigoMensaje === "200") {
                    toast.success("Archivo USERINFO importado correctamente");
                } else {
                    toast.error("Error al importar USERINFO: " + response.data.mensaje);
                }
            }

            if (checkoutFile) {
                const formData = new FormData();
                formData.append("file", checkoutFile);

                const response = await axios.post(`${API_BASE_URL}marcaciones/exportacion/cargar-marcacion`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.codigoMensaje === "200") {
                    toast.success("Archivo CHECKOUT importado correctamente");
                } else {
                    toast.error("Error al importar CHECKOUT: " + response.data.mensaje);
                }
            }

            if (!userinfoFile && !checkoutFile) {
                toast.info("No hay archivos seleccionados");
            }
        } catch (error) {
            console.error("Error al importar archivos:", error);
            toast.error("Ocurrió un error al importar");
        }
    };

    return (
        <div className="abm-importadas-container">
            <h1>ABM Marcaciones Importadas</h1>
            <div className="volver" onClick={() => navigate("/marcaciones/importadas")}>← Volver</div>

            <div className="file-section">
                <div className="file-upload">
                    <label htmlFor="userinfo">Archivo USERINFO</label>
                    <label htmlFor="userinfo" className="file-button">
                        <span>SELECCIONAR</span> {userinfoFile?.name || "Ningún Archivo Seleccionado"}
                    </label>
                    <input id="userinfo" type="file" onChange={(e) => handleFileChange(e, "userinfo")} />
                </div>

                <div className="file-upload">
                    <label htmlFor="checkout">Archivo CHECKOUT</label>
                    <label htmlFor="checkout" className="file-button">
                        <span>SELECCIONAR</span> {checkoutFile?.name || "Ningún Archivo Seleccionado"}
                    </label>
                    <input id="checkout" type="file" onChange={(e) => handleFileChange(e, "checkout")} />
                </div>
            </div>

            <button className="importar-btn" onClick={handleImportar}>IMPORTAR</button>
            <ToastContainer/>
        </div>
    );
};

export default AbmMarcacionesImportadas;
