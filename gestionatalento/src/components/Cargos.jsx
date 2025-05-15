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

            <table className="tabla-cargos">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Usuario Inserción</th>
                    <th>Fecha Inserción</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {cargos.map((cargo) => (
                    <tr key={cargo.id}>
                        <td>{cargo.id}</td>
                        <td>{cargo.descripcion}</td>
                        <td>{cargo.estado}</td>
                        <td>{cargo.usuarioInsercion}</td>
                        <td>{cargo.fechaInsercion}</td>
                        <td className="edit-icon">
                          <FaEdit
                              onClick={() =>
                                  navigate("/configuraciones/cargos/abm", {state: {cargo}})
                              }
                              style={{cursor: "pointer"}}
                          />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Cargos;
