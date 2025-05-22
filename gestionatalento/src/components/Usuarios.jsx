import React, { useState, useEffect } from "react";
import "./Usuarios.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';

const Usuarios = () => {
    const navigate = useNavigate();
    const [allUsuarios, setAllUsuarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [page, setPage] = useState(0);
    const pageSize = 100;

    useEffect(() => {
        fetchAllUsuarios();
    }, []);

    useEffect(() => {
        setUsuarios(
            allUsuarios.slice(page * pageSize, (page + 1) * pageSize)
        );
    }, [page, allUsuarios]);

    const fetchAllUsuarios = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}api/admin/users/obtenerTodos`
            );
            const allData = response.data.objeto || [];
            setAllUsuarios(allData);
            setPage(0);
            setUsuarios(allData.slice(0, pageSize));
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setAllUsuarios([]);
            setUsuarios([]);
        }
    };

    const totalPages = Math.ceil(allUsuarios.length / pageSize);

    return (
        <div className="usuarios-container">
            <h1>Usuarios</h1>
            <div className="acciones-usuarios">
                <button onClick={() => navigate("/configuraciones")}>
                    ← VOLVER
                </button>
                <button onClick={() => navigate("/configuraciones/usuarios/abm")}>
                    AGREGAR
                </button>
            </div>
            <div className="tabla-scroll">
                <table className="tabla-usuarios">
                    <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Cargo</th>
                        <th>Fecha de Ingreso</th>
                        <th>Fecha de Egreso</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.username}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.estado === "A" ? "ACTIVO" : "INACTIVO"}</td>
                            <td>{usuario.cargo}</td>
                            <td>{usuario.fechaAlta}</td>
                            <td>{usuario.fechaBaja}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/configuraciones/usuarios/abm/${usuario.id}`)
                                    }
                                >
                                    <img src="/public/editar.png" alt="Editar" className="icono-accion"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
                <span>Página {page + 1} de {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
            </div>
        </div>
    );
};

export default Usuarios;
