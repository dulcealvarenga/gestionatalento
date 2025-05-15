import React, { useState, useEffect } from "react";
import "./Direcciones.css";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Direcciones = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [filteredDirecciones, setFilteredDirecciones] = useState([]);
    const [showDepartamentosPanel, setShowDepartamentosPanel] = useState(false);
    const [descripciones, setDescripciones] = useState([]);
    const [selectedDescripcion, setSelectedDescripcion] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchDirecciones();
    }, []);

    const fetchDirecciones = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/configuraciones/direcciones/obtenerLista"
            );

            const data =
                response.data && response.data.objeto && response.data.objeto.length > 0
                    ? response.data.objeto.map((item) => ({
                        id: item.direccion.codDireccion,
                        descripcion: item.direccion.descripcion,
                        estado: item.direccion.estado === "Activo" ? "Activo" : "Inactivo",
                        usuarioInsercion: "admin", // valor fijo como pediste
                        fechaInsercion: new Date().toISOString().split("T")[0], // fecha actual
                    }))
                    : [];

            setDirecciones(data);
            setFilteredDirecciones(data);
            setDescripciones([...new Set(data.map((dir) => dir.descripcion))]);
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    const handleToggleDepartamentos = () => {
        setShowDepartamentosPanel(!showDepartamentosPanel);
    };

    const handleFilterByDescripcion = (descripcion) => {
        const filtradas = direcciones.filter(
            (dir) => dir.descripcion === descripcion
        );
        setFilteredDirecciones(filtradas);
        setSelectedDescripcion(descripcion);
        setShowDepartamentosPanel(false);
    };

    const handleClearFilter = () => {
        setFilteredDirecciones(direcciones);
        setSelectedDescripcion(null);
    };

    return (
        <div className="direcciones-container">
            <h1>Direcciones</h1>
            <p style={{ fontSize: "22px"}}>Acciones</p>

            <div className="actions">
                <button onClick={() => navigate("/configuraciones")}>
                    ← VOLVER
                </button>
                <button onClick={() => navigate("/configuraciones/direcciones/abm")}>
                    AGREGAR
                </button>
                <button onClick={() => navigate("/configuraciones/departamentos")}>DEPARTAMENTOS</button>
            </div>

            {selectedDescripcion && (
                <div className="filter-indicator">
                    <span>Filtrado por: {selectedDescripcion}</span>
                    <button onClick={handleClearFilter}>Quitar filtro</button>
                </div>
            )}

            <table className="tabla-direcciones">
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
                {filteredDirecciones.map((dir) => (
                    <tr key={dir.id}>
                        <td>{dir.id}</td>
                        <td>{dir.descripcion}</td>
                        <td>{dir.estado}</td>
                        <td>{dir.usuarioInsercion}</td>
                        <td>{dir.fechaInsercion}</td>
                        <td className="edit-icon">
                          <FaEdit
                              onClick={() =>
                                  navigate("/configuraciones/direcciones/abm", {
                                      state: {direccion: dir},
                                  })
                              }
                              style={{cursor: "pointer"}}
                          />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showDepartamentosPanel && (
                <div className="departamentos-panel">
                    <h3>Seleccionar Departamento</h3>
                    <ul>
                        {descripciones.map((desc, index) => (
                            <li key={index} onClick={() => handleFilterByDescripcion(desc)}>
                                {desc}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleToggleDepartamentos}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default Direcciones;
