import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./AbmHorasExtras.css"; // Asegurate de importar tu CSS
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const HorasExtrasAbm = () => {
    const navigate = useNavigate();

    const descripcionesCargo = {
        1: "AUXILIAR ADMINISTRATIVO",
    };

    const descripcionesSituacionesLab = {
        1: "CONTRATADO",
        2: "PERMANENTE",
        3: "COMISIONADO",
        4: "PASANTIA EDUCATIVA",
        5: "PASANTIA UNIVERSITARIA",
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
        codSede: "",
        codDireccion: "",
        codSituacionLaboral: "",
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

    const handleCalcularHorasExtras = async () => {
        if (!formData.codEmpleado || !formData.codPeriodo || !formData.horaExtra) {
            toast.warn("Faltan datos para calcular horas extras", { autoClose: 2000 });
            return;
        }

        const body = {
            empleado: {
                codEmpleado: formData.codEmpleado
            },
            codPeriodo: formData.codPeriodo,
            horaExtra: parseFloat(formData.horaExtra)
        };

        try {
            const response = await axios.post("http://localhost:8080/horas-extras/calcular", body);
            if (response.data.codigoMensaje === "200") {
                const resultado = response.data.objeto;
                setFormData(prev => ({
                    ...prev,
                    monto: resultado.monto
                }));
                toast.success("Horas extras calculadas", { autoClose: 2000 });
            } else {
                toast.error("Error al calcular: " + response.data.mensaje);
            }
        } catch (error) {
            console.error("Error al calcular horas extras:", error);
            toast.error("Fallo en la solicitud");
        }
    };

    const handleGuardarHorasExtras = async () => {
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

        console.log("Body a enviar:", body); // 👀 Debug

        try {
            const response = await axios.post("http://localhost:8080/horas-extras/crear", body);
            if (response.data.codigoMensaje === "200") {
                toast.success("Horas extras guardadas con éxito", { autoClose: 2000 });
                // limpiar si querés
                // setFormData({...})
            } else {
                toast.error("Error: " + response.data.mensaje);
                console.log(response.data.mensaje); // 👀 Debug
            }
        } catch (error) {
            console.error("Error al guardar horas extras:", error);
            toast.error("No se pudo guardar");
        }
    };


    return (
        <div className="abm-horas-extras-container">
            <h1>Horas Extras</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>
            <div className="form-card-horas">
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
                        <input name="nombres" value={formData.nombres} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Apellidos</label>
                        <input name="apellidos" value={formData.apellidos}
                               onChange={handleChange}/>
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
                        <label>Fecha de Ingreso</label>
                        <input name="fecIngreso" value={formData.fecIngreso} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                        <label>Situación Laboral</label>
                        <input
                            name="sitLaboral"
                            value={descripcionesSituacionesLab[formData.codSituacionLaboral] || ""}
                            readOnly
                        />
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Hora Extra Planilla</label>
                        <input
                            type="number"
                            name="horaExtra"
                            value={formData.horaExtra}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="campo">
                        <label>Observación</label>
                        <input
                            type="text"
                            name="observacion"
                            value={formData.observacion}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="campo">
                        <label>Exoneración de Entrada</label>
                        <select
                            name="exoneraEntrada"
                            value={formData.exoneraEntrada}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="S">Sí</option>
                            <option value="N">No</option>
                        </select>
                    </div>
                </div>

                <div className="fila-doble">
                <div className="campo">
                        <label>Periodo</label>
                        <input
                            type="text"
                            name="codPeriodo"
                            value={formData.codPeriodo}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Monto</label>
                        <input
                            type="text"
                            name="monto"
                            value={formData.monto}
                            readOnly
                        />
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-guardar" onClick={handleCalcularHorasExtras}>CALCULAR</button>
                    <button className="btn-guardar" onClick={handleGuardarHorasExtras}>
                        GUARDAR
                    </button>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default HorasExtrasAbm;
