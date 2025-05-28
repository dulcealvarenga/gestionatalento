import React from "react";
import { useNavigate } from "react-router-dom";
import "./AbmContratos.css";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import ContratoPDF from "./ContratoPDF.jsx";
import { API_BASE_URL } from '../config/constantes.js';

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
            const response = await axios.get(`${API_BASE_URL}empleados/obtener/documento/${nroDocumento}`);
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
                    descripcionCargo: empleado.cargo?.descripcion || '',
                    codSede: empleado.sede?.codSede || '',
                    codDireccion: empleado.cargo?.departamento?.direccion?.codDireccion || '',
                    codSituacionLaboral: empleado.situacionLaboral?.codSituacionLaboral || '',
                    descripcionLab: empleado.situacionLaboral?.descripcion || '',
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
        const codPersona = localStorage.getItem("codPersona");
        const body = {
            nroContrato: null,
            periodo: { nroPeriodo: 5 },
            persona: { codPersona: parseInt(codPersona) },
            nroDocumento: form.nroDocumento,
            nombres: form.nombres,
            apellidos: form.apellidos,
            asignacion: parseFloat(form.asignacion || 0),
            montoLetras: form.montoLetras || "",
            estado: 1,
            fecDesde: form.fecDesde,
            fecHasta: form.fecHasta,
            situacionLaboral: { codSituacionLaboral: parseInt(form.codSituacionLaboral || 1) },
            nomFirmante1: form.nomFirmante1 || "Lic. Ana Méndez",
            nomFirmante2: form.nomFirmante2 || "Ing. Pedro López",
            observacion: form.observacion || ""
        };

        console.log("Contrato:", body);

        try {
            const response = await axios.post(
                `${API_BASE_URL}contratos/crear`,
                body
            );
            toast.success("Contrato guardado exitosamente", { autoClose: 2000 });
            console.log("Response:", response.data.objeto);
            const blob = await pdf(<ContratoPDF contrato={response.data.objeto} />).toBlob();
            saveAs(blob, `Contrato_${form.nroDocumento}.pdf`);
            setTimeout(() => navigate("/contratos"), 2000);
        } catch (error) {
            console.error("Error al guardar contrato:", error);
            toast.error("Hubo un error al guardar el contrato", { autoClose: 2000 });
        }
    };

    return (
        <div className="abm-contratos-container">
            <h1>Agregar Contratos</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>
            <form className="form-contrato" onSubmit={handleSubmit}>
                <div className="fila-triple">
                    <div className="campo">
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
                    <div className="campo">
                        <label>Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            readOnly={true}
                        />
                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="fila-triple">
                    <div className="campo">
                        <label>Cargo</label>
                        <input
                            type="text"
                            name="descripcionCargo"
                            value={form.descripcionCargo}
                            onChange={handleChange}
                            readOnly={true}
                        />
                    </div>
                    <div className="campo">
                        <label>Situacion Laboral</label>
                        <input
                            type="text"
                            name="descripcionLab"
                            value={form.descripcionLab}
                            onChange={handleChange}
                            readOnly={true}
                        />
                    </div>
                    <div className="campo">
                        <label>Asignación</label>
                        <input
                            type="text"
                            name="asignacion"
                            value={form.asignacion}
                            onChange={handleChange}
                            readOnly={true}
                        />
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Fecha desde</label>
                        <input
                            type="date"
                            name="fecDesde"
                            value={form.fecDesde}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="campo">
                        <label>Fecha Hasta</label>
                        <input
                            type="date"
                            name="fecHasta"
                            value={form.fecHasta}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="campo">
                        <label>Observación</label>
                        <input
                            type="text"
                            name="observacion"
                            value={form.observacion}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="btn-guardar-container">
                    <button type="submit" className="guardar-btn">
                        GUARDAR
                    </button>
                </div>
                <ToastContainer/>
            </form>
        </div>
    );
};

export default AbmContratos;