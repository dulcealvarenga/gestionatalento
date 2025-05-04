import React, { useState, useEffect } from "react";
import "./Cargos.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cargos = () => {
    const [cargos, setCargos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCargos();
    }, []);

    const fetchCargos = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/configuraciones/cargos/obtenerLista"
            );

            const data =
                response.data && response.data.objeto && response.data.objeto.length > 0
                    ? response.data.objeto.map((item) => ({
                        id: item.cargo.codCargo,
                        descripcion: item.cargo.descripcion,
                        estado: item.cargo.estado === "A" ? "Activo" : "Inactivo",
                        codDepartamento: item.cargo.departamento.codDepartamento,
                        usuarioInsercion: "admin",
                        fechaInsercion: new Date().toISOString().split("T")[0],
                    }))
                    : [];

            setCargos(data);
        } catch (error) {
            console.error("Error al obtener los cargos:", error);
        }
    };

    return (
        <div className="cargos-container">
            <h1>Cargos</h1>
            <p style={{ fontSize: "22px"}}>Acciones</p>

            <div className="actions">
                <button onClick={() => navigate("/configuraciones/departamentos")}>
                    ← VOLVER
                </button>
                <button onClick={() => navigate("/configuraciones/cargos/abm")}>
                    AGREGAR
                </button>

            </div>

            <div className="tabla-cargos">
                <div className="tabla-header">
                    <span>ID</span>
                    <span>Descripción</span>
                    <span>Estado</span>
                    <span>Usuario Inserción</span>
                    <span>Fecha Inserción</span>
                    <span></span>
                </div>

                {cargos.map((cargo) => (
                    <div key={cargo.id} className="tabla-row">
                        <span>{cargo.id}</span>
                        <span>{cargo.descripcion}</span>
                        <span>{cargo.estado}</span>
                        <span>{cargo.usuarioInsercion}</span>
                        <span>{cargo.fechaInsercion}</span>
                        <span className="edit-icon">
              <FaEdit
                  onClick={() =>
                      navigate("/configuraciones/cargos/abm", { state: { cargo } })
                  }
                  style={{ cursor: "pointer" }}
              />
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cargos;
