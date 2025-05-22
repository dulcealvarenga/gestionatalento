import React, { useState, useEffect } from "react";
import "./AbmUsuarios.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from '../config/constantes.js';

const AbmUsuarios = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        const fetchCargos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}configuraciones/cargos/obtenerLista`);
                setCargos(response.data.objeto);
            } catch (error) {
                console.error("Error al cargar cargos:", error);
            }
        };

        fetchCargos();
    }, []);

    const [formData, setFormData] = useState({
        id: "",
        username: "",
        nombreCompleto: "",
        estado: "",
        cargo: "",
        fechaAlta: "",
        fechaBaja: ""
    });

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${API_BASE_URL}api/admin/users/` + id);
                    const genericResponse = response.data;
                    const usuarioData = genericResponse.objeto;

                    if (genericResponse.codigoMensaje === "200") {
                        setFormData({
                            id: usuarioData.id,
                            username: usuarioData.username,
                            nombreCompleto: usuarioData.nombreCompleto,
                            estado: usuarioData.estado,
                            cargo: usuarioData.cargo,
                            fechaAlta: usuarioData.fechaAlta,
                            fechaBaja: usuarioData.fechaBaja,
                        });
                        toast.dismiss();
                        toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    } else {
                        toast.error(genericResponse.mensaje, { autoClose: 2000 });
                    }
                } catch (error) {
                    console.error("Error al cargar el usuario:", error);
                    toast.error("Error al cargar el usuario", { autoClose: 2000 });
                }
            }
        };

        fetchUsuarios();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const requiredInputs = document.querySelectorAll("input[required], select[required]");

        // Filtrar los que están vacíos
        const emptyFields = Array.from(requiredInputs).filter(input => !input.value.trim());

        if (emptyFields.length > 0) {
            toast.info("Debe completar los datos obligatorios", { autoClose: 2000 });
            return;
        }

        const cargoSeleccionado = cargos.find(c => c.cargo.codCargo.toString() === formData.cargo);
        const descripcionCargo = cargoSeleccionado ? cargoSeleccionado.cargo.descripcion : "";

        const usuario = {
            id: formData.id,
            username: formData.username,
            nombreCompleto: formData.nombreCompleto,
            estado: formData.estado,
            cargo: descripcionCargo,
            fechaAlta: formData.fechaAlta,
            fechaBaja: formData.fechaBaja,
            role: 'USER',
            password: '123456',
        };
        console.log("datos: ", usuario);
        try {

            if (id) {
                const response = await axios.put(`${API_BASE_URL}configuraciones/usuarios/actualizar`, usuario);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    setTimeout(() => {
                        navigate("/configuraciones/usuarios");
                    }, 2000);
                } else {
                    toast.error(genericResponse.mensaje, { autoClose: 2000 });
                }
            } else {
                const response = await axios.post(`${API_BASE_URL}api/admin/users`, usuario);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    setTimeout(() => {
                        navigate("/configuraciones/usuarios");
                    }, 2000);
                } else {
                    toast.error(genericResponse.mensaje, { autoClose: 2000 });
                }
            }

        } catch (error) {
            console.error("Error al guardar usuario:", error);
            alert("Error al guardar usuario");
        }
    };

    return (
        <div className="abm-usuarios-container">
            <div className="abm-usuarios-card">
                <h1>{id ? "Editar Usuario" : "Agregar Usuario"}</h1>
                <div className="acciones-usuarios-abm">
                    <button onClick={() => navigate("/configuraciones/usuarios")}>
                        ← VOLVER
                    </button>
                </div>
                <div className="form-group-usu">
                    <div className="fila-triple">
                        <div className="campo">
                            <label>Usuario</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="nombreCompleto"
                                value={formData.nombreCompleto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label>Cargo</label>
                            <select
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un Cargo</option>
                                {cargos.map((c) => (
                                    <option key={c.cargo.codCargo}
                                            value={c.cargo.codCargo}>
                                        {c.cargo.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="fila-doble">
                        <div className="campo">
                            <label>Fecha de Alta</label>
                            <input
                                type="date"
                                name="fechaAlta"
                                value={formData.fechaAlta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label>Fecha de Baja</label>
                            <input
                                type="date"
                                name="fechaBaja"
                                value={formData.fechaBaja}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="agregar-actions-usu">
                        <button className="btn-guardar-usu" onClick={handleSave}  >{id ? "ACTUALIZAR" : "GUARDAR"}</button>
                        <button className="btn-cancelar-usu" onClick={() => navigate("/configuraciones/usuarios")}>CANCELAR</button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default AbmUsuarios;
