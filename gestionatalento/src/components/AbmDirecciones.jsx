import React, { useState, useEffect } from "react";
import "./AbmDirecciones.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AbmDirecciones = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [direccion, setDireccion] = useState({
        codDireccion: null,
        descripcion: "",
        estado: "Activo",
    });

    // Cargar datos si viene en modo edición
    useEffect(() => {
        if (location.state && location.state.direccion) {
            const dir = location.state.direccion;
            setDireccion({
                codDireccion: dir.id,
                descripcion: dir.descripcion,
                estado: dir.estado,
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDireccion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!direccion.descripcion) {
            alert("La descripción es obligatoria");
            return;
        }

        const payload = {
            codDireccion: direccion.codDireccion,
            descripcion: direccion.descripcion,
            estado: direccion.estado,
        };

        const isEdit = direccion.codDireccion !== null;

        try {
            if (isEdit) {
                // EDITAR (PUT)
                await axios.put(
                    "http://localhost:8080/configuraciones/direcciones/actualizar",
                    payload
                );
                alert("Dirección actualizada con éxito");
            } else {
                // CREAR (POST)
                await axios.post(
                    "http://localhost:8080/configuraciones/direcciones/crear",
                    payload
                );
                alert("Dirección guardada con éxito");
            }

            navigate("/configuraciones/direcciones");
        } catch (error) {
            console.error("Error al guardar dirección:", error);
            alert("Hubo un error al guardar la dirección");
        }
    };

    const handleCancel = () => {
        navigate("/configuraciones/direcciones");
    };

    return (
        <div className="abm-direcciones-container">
            <div className="abm-direcciones-card">
                <h1>
                    {direccion.codDireccion ? "Editar Dirección" : "Agregar Dirección"}
                </h1>
                <div className="acciones-eventos-abm">
                    <button onClick={() => navigate("/configuraciones/direcciones")}>
                        ← VOLVER
                    </button>
                </div>
                <div className="form-group">
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Descripción</label>
                    <input
                        type="text"
                        placeholder="Ingrese la descripción"
                        name="descripcion"
                        value={direccion.descripcion}
                        onChange={handleChange}
                        disabled={direccion.codDireccion !== null} // Solo editable si es nuevo
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Estado</label>
                    <select
                        name="estado"
                        value={direccion.estado}
                        onChange={handleChange}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}

                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="agregar-actions">
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={handleCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default AbmDirecciones;
