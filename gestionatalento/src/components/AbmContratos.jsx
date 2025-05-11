import React from "react";
import { useNavigate } from "react-router-dom";
import "./AbmContratos.css";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const AbmContratos = () => {
    const navigate = useNavigate();

    // Dentro del componente
    const [form, setForm] = useState({
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        periodo: "",
        contrato: "",
        observacion: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleBuscarPorDocumentoEmp = async () => {
        const nroDocumento = form.nroDocumento;
        if (!nroDocumento) return;

        try {
            const response = await axios.get(`http://localhost:8080/empleados/obtener/documento/${nroDocumento}`);
            if (response.data.codigoMensaje === "200") {
                const empleado = response.data.objeto[0];
                const persona = empleado.persona;

                toast.success("Empleado encontrado", { autoClose: 2000 });

                localStorage.setItem('codPersona', persona.codPersona);

                setForm(prev => ({
                    ...prev,
                    nombres: persona.nombres || '',
                    apellidos: persona.apellidos || '',
                    horaEntrada: empleado.horaEntrada || '',
                    horaSalida: empleado.horaSalida || '',
                    asignacion: empleado.asignacion || '',
                    fecIngreso: empleado.fecIngreso || '',
                    fecActoAdministrativo: empleado.fecActoAdministrativo || '',
                    codCargo: empleado.cargo?.codCargo || '',
                    codSede: empleado.sede?.codSede || '',
                    codDireccion: empleado.cargo?.departamento?.direccion?.codDireccion || '',
                    codSituacionLaboral: empleado.situacionLaboral?.codSituacionLaboral || '',
                    codEmpleado: empleado.codEmpleado || '',
                }));
            } else {
                toast.info("No se encontró el empleado registrado", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error al buscar empleado:", error);
            toast.error("Error al buscar empleado", { autoClose: 2000 });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/contratos",
                form
            );
            console.log("Contrato creado:", response.data);
            toast.success("Contrato guardado exitosamente", { autoClose: 2000 });
        } catch (error) {
            console.error("Error al guardar contrato:", error);
            toast.error("Hubo un error al guardar el contrato:", error);
        }
    };

    return (
        <div className="abm-contratos-container">
            <h1>Agregar Contratos</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>
            <form className="form-contrato">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nro. de Documento</label>
                        <input
                            type="text"
                            name="nroDocumento"
                            value={form.nroDocumento}
                            onChange={handleChange}
                            onBlur={handleBuscarPorDocumentoEmp}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleBuscarPorDocumentoEmp();
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            placeholder=" "
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            placeholder=" "
                        />
                    </div>
                </div>
                <div className="form-grid-dos">
                    <div className="form-group">
                        <label>Periodo</label>
                        <input
                            type="text"
                            name="periodo"
                            value={form.periodo}
                            onChange={handleChange}
                            placeholder=" "
                        />
                    </div>
                    <div className="form-group">
                        <label>Contrato</label>
                        <select
                            name="contrato"
                            value={form.contrato}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Contrato A">Contrato A</option>
                            <option value="Contrato B">Contrato B</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Observacion</label>
                        <input
                            type="text"
                            name="observacion"
                            value={form.observacion}
                            onChange={handleChange}
                            placeholder=" "
                        />
                    </div>
                </div>

                <div className="btn-guardar-container">
                    <button type="submit" className="guardar-btn" onClick={handleSubmit}>
                        GUARDAR
                    </button>
                </div>
                <ToastContainer/>
            </form>
        </div>
    );
};

export default AbmContratos;