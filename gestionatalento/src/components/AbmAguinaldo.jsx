import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./AbmAguinaldo.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const AbmAguinaldo = () => {
    const navigate = useNavigate();

    const descripcionesCargo = {
        1: "AUXILIAR ADMINISTRATIVO",
    };

    const [formData, setFormData] = useState({
        codEmpleado: "",
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        horaEntrada: "",
        horaSalida: "",
        asignacion: "",
        fecIngreso: "",
        fecActoAdministrativo: "",
        codCargo: "",
        descCargo: "",
        codSede: "",
        codDireccion: "",
        codSituacionLaboral: "",
        descSituacionLaboral: "",
        monto: "",
        codPeriodo:"2025/05",
        horaExtra: "",
        observacion: "",
        exoneraEntrada: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBuscarPorDocumentoEmp = async () => {
        const nroDocumento = formData.nroDocumento;
        if (!nroDocumento) return;

        try {
            const response = await axios.get(`http://localhost:8080/empleados/obtener/documento/${nroDocumento}`);
            if (response.data.codigoMensaje === "200") {
                const empleado = response.data.objeto[0];
                const persona = empleado.persona;

                toast.success("Empleado encontrado", { autoClose: 2000 });

                localStorage.setItem('codPersona', persona.codPersona);

                setFormData(prev => ({
                    ...prev,
                    nombres: persona.nombres || '',
                    apellidos: persona.apellidos || '',
                    horaEntrada: empleado.horaEntrada || '',
                    horaSalida: empleado.horaSalida || '',
                    asignacion: empleado.asignacion || '',
                    fecIngreso: empleado.fecIngreso || '',
                    fecActoAdministrativo: empleado.fecActoAdministrativo || '',
                    codCargo: empleado.cargo?.codCargo || '',
                    descCargo: empleado.cargo?.descripcion || '',
                    codSede: empleado.sede?.codSede || '',
                    codDireccion: empleado.cargo?.departamento?.direccion?.codDireccion || '',
                    codSituacionLaboral: empleado.situacionLaboral?.codSituacionLaboral || '',
                    descSituacionLaboral: empleado.situacionLaboral?.descripcion || '',
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

    const handleGuardarAguinaldo = async () => {
        const {
            codEmpleado,
            codPeriodo,
            horaExtra,
            monto,
            observacion,
            exoneraEntrada
        } = formData;

        if (!codEmpleado || !codPeriodo || !horaExtra || !monto) {
            toast.warn("Faltan datos obligatorios para guardar", { autoClose: 2000 });
            return;
        }

        const body = {
            empleado: { codEmpleado: parseInt(codEmpleado) },
            codPeriodo,
            horaExtra: parseFloat(horaExtra),
            monto: monto,
            observacion: observacion || "",
            exoneraEntrada: exoneraEntrada || "N"
        };

        console.log("Body a enviar:", body);

        try {
            const response = await axios.post("http://localhost:8080/salarios/crear", body);
            if (response.data.codigoMensaje === "200") {
                toast.success("Se incluyo con Exito el Aguinaldo", { autoClose: 2000 });
                // limpiar si querés
                // setFormData({...})
            } else {
                toast.error("Error: " + response.data.mensaje);
                console.log(response.data.mensaje);
            }
        } catch (error) {
            console.error("Error al incluir aguinaldo:", error);
            toast.error("No se pudo guardar");
        }
    };

    return (
        <div className="abm-aguinaldo-container">
            <h1>Incluir Aguinaldo</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>
            <div className="form-card-aguinaldo">
                <div className="fila-triple">
                    <div className="campo">
                        <label>Nro. de Documento</label>
                        <input
                            type="text"
                            name="nroDocumento"
                            value={formData.nroDocumento}
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
                        <input name="nombres" value={formData.nombres} onChange={handleChange} readOnly/>

                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input name="apellidos" value={formData.apellidos}
                               onChange={handleChange}
                               readOnly/>
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Cargo</label>
                        <input
                            name="cargo"
                            value={descripcionesCargo[formData.codCargo] || ""}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Grado Salarial</label>
                        <input
                            name="gradoSalarial"
                            value={formData.nombres}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Asignacion</label>
                        <input
                            name="asignacion"
                            value={formData.asignacion}
                            readOnly
                        />
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Fuente de Financiamiento</label>
                        <input
                            name="financiamiento"
                            value={descripcionesCargo[formData.codCargo] || ""}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Objeto de Gasto</label>
                        <input
                            name="objGasto"
                            value={formData.descSituacionLaboral}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Programa</label>
                        <input
                            name="programa"
                            value={formData.codDireccion}
                            readOnly
                        />
                    </div>
                </div>

                <div className="fila-doble">
                    <div className="campo">
                        <label>SubPrograma</label>
                        <select
                            name="subprograma"
                            value={formData.exoneraEntrada}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Situación Laboral</label>
                        <input
                            name="sitLaboral"
                            value={formData.descSituacionLaboral}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-guardar" onClick={handleGuardarAguinaldo}>
                        GUARDAR
                    </button>
                </div>
                <ToastContainer/>
            </div>
        </div>
    );
};

export default AbmAguinaldo;
