import React, { useState, useEffect } from "react";
import "./AbmCargo.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AbmCargo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [cargo, setCargo] = useState({
        codCargo: null,
        descripcion: "",
        estado: "Activo",
        codDepartamento: "",
    });

    useEffect(() => {
        if (location.state && location.state.cargo) {
            const carg = location.state.cargo;
            setCargo({
                codCargo: carg.id,
                descripcion: carg.descripcion,
                estado: carg.estado,
                codDepartamento: carg.codDepartamento,
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCargo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!cargo.descripcion || !cargo.codDepartamento) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const payload = {
            codCargo: cargo.codCargo,
            descripcion: cargo.descripcion,
            estado: cargo.estado === "Activo" ? "A" : "I",
            departamento: {
                codDepartamento: cargo.codDepartamento,
            },
        };

        const isEdit = cargo.codCargo !== null;

        try {
            if (isEdit) {
                await axios.put(
                    "http://localhost:8080/configuraciones/cargos/actualizar",
                    payload
                );
                alert("Cargo actualizado con éxito");
            } else {
                await axios.post(
                    "http://localhost:8080/configuraciones/cargos/crear",
                    payload
                );
                alert("Cargo guardado con éxito");
            }

            navigate("/configuraciones/cargos");
        } catch (error) {
            console.error("Error al guardar cargo:", error);
            alert("Hubo un error al guardar el cargo");
        }
    };

    const handleCancel = () => {
        navigate("/configuraciones/cargos");
    };

    return (
        <div className="abm-cargo-container">
            <div className="abm-cargo-card">
                <h1>{cargo.codCargo ? "Editar Cargo" : "Agregar Cargo"}</h1>
                <div className="acciones-eventos-abm">
                    <button onClick={() => navigate("/configuraciones/cargos")}>
                        ← VOLVER
                    </button>
                </div>
                <div className="form-group">
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Descripción</label>
                    <input
                        type="text"
                        placeholder="Ingrese la descripción"
                        name="descripcion"
                        value={cargo.descripcion}
                        onChange={handleChange}
                        disabled={cargo.codCargo !== null}
                        style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '98%'}}
                    />
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Estado</label>
                    <select name="estado" value={cargo.estado} onChange={handleChange}
                            style={{backgroundColor: "#697099", fontSize: "18px", color: "#FFFFFF", width: '99%'}}>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <label style={{fontSize: "22px", fontWeight: "bold", color: "#FFFFFF"}}>Código de
                        Departamento</label>
                    <input
                        type="number"
                        placeholder="Ingrese el código del departamento"
                        name="codDepartamento"
                        value={cargo.codDepartamento}
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

export default AbmCargo;
