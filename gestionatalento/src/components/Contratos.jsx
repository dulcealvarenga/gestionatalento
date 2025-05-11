import React, { useEffect, useState } from "react";
import "./Contratos.css"; // usa el mismo estilo visual dark
import axios from "axios";
import { useNavigate } from "react-router-dom";
//Esto es lo nuevo
const Contratos = () => {
    const [listaContratos, setListaContratos] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        // Simulación o llamada real
        axios
            .get("http://localhost:8080/contratos/lista")
            .then((res) => setListaContratos(res.data.objeto))
            .catch((err) => console.error("Error al obtener contratos:", err));
    }, []);

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

            <table className="tabla-empleados">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nro. de Documento</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Periodo</th>
                    <th>Estado</th>
                    <th>Observación</th>
                </tr>
                </thead>
                <tbody>
                {listaContratos.map((contrato, index) => (
                    <tr key={index}>
                        <td>
                            <button className="ver-btn">ver</button>
                        </td>
                        <td>
                            <img src="/avatar.png" alt="foto" className="foto-empleado" />
                            <span style={{ marginLeft: "10px" }}>
                  {contrato.nroDocumento}
                </span>
                        </td>
                        <td>{contrato.nombres}</td>
                        <td>{contrato.apellidos}</td>
                        <td>
                            {contrato.fechaInicio} - {contrato.fechaFin}
                        </td>
                        <td>{contrato.estado || "-"}</td>
                        <td>{contrato.observacion || "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Contratos;