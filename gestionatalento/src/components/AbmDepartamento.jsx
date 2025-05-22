import React, { useState, useEffect } from "react";
import "./AbmDepartamento.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from '../config/constantes.js';

const AbmDepartamento = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [departamento, setDepartamento] = useState({
        codDepartamento: null,
        descripcion: "",
        estado: "Activo",
        codDireccion: "",
    });

    useEffect(() => {
        if (location.state && location.state.departamento) {
            const dep = location.state.departamento;
            setDepartamento({
                codDepartamento: dep.id,
                descripcion: dep.descripcion,
                estado: dep.estado,
                codDireccion: dep.codDireccion,
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartamento((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!departamento.descripcion || !departamento.codDireccion) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const payload = {
            codDepartamento: departamento.codDepartamento,
            descripcion: departamento.descripcion,
            estado: departamento.estado === "Activo" ? "A" : "I",
            direccion: {
                codDireccion: departamento.codDireccion,
            },
        };

        const isEdit = departamento.codDepartamento !== null;

        try {
            if (isEdit) {
                await axios.put(
                    `${API_BASE_URL}configuraciones/departamentos/actualizar`,
                    payload
                );
                alert("Departamento actualizado con éxito");
            } else {
                await axios.post(
                    `${API_BASE_URL}configuraciones/departamentos/crear`,
                    payload
                );
                alert("Departamento guardado con éxito");
            }

            navigate("/configuraciones/departamentos");
        } catch (error) {
            console.error("Error al guardar departamento:", error);
            alert("Hubo un error al guardar el departamento");
        }
    };

    const handleCancel = () => {
        navigate("/configuraciones/departamentos");
    };

    return (
        <div className="abm-departamento-container">
            <div className="abm-departamento-card">

                <h1>
                    {departamento.codDepartamento
                        ? "Editar Departamento"
                        : "Agregar Departamento"}
                </h1>
                <div className="acciones-eventos-abm">
                    <button onClick={() => navigate("/configuraciones/departamentos")}>
                        ← VOLVER
                    </button>
                </div>
                <div className="form-group">
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Descripción</label>
                    <input
                        type="text"
                        placeholder="Ingrese la descripción"
                        name="descripcion"
                        value={departamento.descripcion}
                        onChange={handleChange}
                        disabled={departamento.codDepartamento !== null}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Estado</label>
                    <select
                        name="estado"
                        value={departamento.estado}
                        onChange={handleChange}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Código de Dirección</label>
                    <input
                        type="number"
                        placeholder="Ingrese el código de la dirección"
                        name="codDireccion"
                        value={departamento.codDireccion}
                        onChange={handleChange}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                </div>

                <div className="agregar-actions">
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={handleCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default AbmDepartamento;
