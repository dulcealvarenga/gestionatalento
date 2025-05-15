import React, { useState, useEffect } from "react";
import "./Departamentos.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Departamentos = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartamentos();
    }, []);

    const fetchDepartamentos = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/configuraciones/departamentos/obtenerLista"
            );

            const data =
                response.data && response.data.objeto && response.data.objeto.length > 0
                    ? response.data.objeto.map((item) => ({
                        id: item.departamento.codDepartamento,
                        descripcion: item.departamento.descripcion,
                        estado: item.departamento.estado === "A" ? "Activo" : "Inactivo",
                        codDireccion: item.departamento.direccion.codDireccion,
                        usuarioInsercion: "admin",
                        fechaInsercion: new Date().toISOString().split("T")[0],
                    }))
                    : [];

            setDepartamentos(data);
        } catch (error) {
            console.error("Error al obtener los departamentos:", error);
        }
    };

    return (
        <div className="departamentos-container">
            <h1>Departamentos</h1>
            <p style={{ fontSize: "22px"}}>Acciones</p>

            <div className="actions-dep">
                <button onClick={() => navigate("/configuraciones/direcciones")}>
                    ← VOLVER
                </button>
                <button onClick={() => navigate("/configuraciones/departamentos/abm")}>
                    AGREGAR
                </button>
                <button onClick={() => navigate("/configuraciones/cargos")}>CARGOS</button>
            </div>

            <table className="tabla-departamento">
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
                {departamentos.map((dep) => (
                    <tr key={dep.id} >
                        <td>{dep.id}</td>
                        <td>{dep.descripcion}</td>
                        <td>{dep.estado}</td>
                        <td>{dep.usuarioInsercion}</td>
                        <td>{dep.fechaInsercion}</td>
                        <td className="edit-icon">
                          <FaEdit
                              onClick={() =>
                                  navigate("/configuraciones/departamentos/abm", {
                                      state: {departamento: dep},
                                  })
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

export default Departamentos;
