import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AbmMarcacionesImportadas.css";

const AbmMarcacionesImportadas = () => {
  const navigate = useNavigate();
  const [userinfoFile, setUserinfoFile] = useState(null);
  const [checkoutFile, setCheckoutFile] = useState(null);

  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (tipo === "userinfo") setUserinfoFile(file);
    else if (tipo === "checkout") setCheckoutFile(file);
  };

  const handleImportar = () => {
    console.log("Archivo USERINFO:", userinfoFile);
    console.log("Archivo CHECKOUT:", checkoutFile);
    // Enviar con FormData si hace falta
  };

  return (
    <div className="abm-importadas-container">
      <h2 className="titulo">ABM Marcaciones Importadas</h2>
      <div
        className="volver"
        onClick={() => navigate("/marcacionesImportadas")}
      >
        ← Volver
      </div>

      <div className="file-section">
        <div className="file-upload">
          <label htmlFor="userinfo">Archivo USERINFO</label>
          <label htmlFor="userinfo" className="file-button">
            <span>SELECCIONAR</span>{" "}
            {userinfoFile?.name || "Ningún Archivo Seleccionado"}
          </label>
          <input
            id="userinfo"
            type="file"
            onChange={(e) => handleFileChange(e, "userinfo")}
          />
        </div>

        <div className="file-upload">
          <label htmlFor="checkout">Archivo CHECKOUT</label>
          <label htmlFor="checkout" className="file-button">
            <span>SELECCIONAR</span>{" "}
            {checkoutFile?.name || "Ningún Archivo Seleccionado"}
          </label>
          <input
            id="checkout"
            type="file"
            onChange={(e) => handleFileChange(e, "checkout")}
          />
        </div>
      </div>

      <button className="importar-btn" onClick={handleImportar}>
        IMPORTAR
      </button>
    </div>
  );
};

export default AbmMarcacionesImportadas;
