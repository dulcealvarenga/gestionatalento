import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./AbmSalarios.css"; // Asegurate de importar tu CSS
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';

const AbmSalarios = () => {
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
        periodo: { nroPeriodo: 5 },
        codPeriodo: "05/2025",
        horaExtra: "",
        observacion: "",
        exoneraEntrada: "",
        fuenteFinancimiento: "",
        gradoSalarial: "",
        objetoGasto: "",
        presupuesto: "",
        programa: "",
        subprograma: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBuscarPorDocumentoEmp = async () => {
        const nroDocumento = formData.nroDocumento;
        if (!nroDocumento) return;

        try {
            const response = await axios.get(`${API_BASE_URL}empleados/obtener/documento/${nroDocumento}`);
            if (response.data.codigoMensaje === "200") {
                const empleado = response.data.objeto[0];
                const persona = empleado.persona;

                toast.success("Empleado encontrado", { autoClose: 2000 });

                localStorage.setItem('codPersona', persona.codPersona);

                setFormData(prev => ({
                    ...prev,
                    nombres: `${persona.nombres} ${persona.apellidos}`,
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
                    descDireccion: empleado.cargo?.departamento?.direccion?.descripcion || '',
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

    const handleGuardarSalarios = async () => {
        const {
            codEmpleado,
            periodo,
            fuenteFinancimiento,
            gradoSalarial,
            objetoGasto,
            presupuesto,
            programa,
            subprograma,
            codSituacionLaboral,
            asignacion
        } = formData;

        if (!codEmpleado || !periodo || !fuenteFinancimiento || !objetoGasto || !presupuesto || !programa || !subprograma || !gradoSalarial || !asignacion) {
            toast.warn("Faltan datos obligatorios para guardar", { autoClose: 2500 });
            return;
        }

        const body = {
            nroPlanilla: 0,
            empleado: {
                codEmpleado: parseInt(codEmpleado)
            },
            periodo,
            presupuesto: {
                codPresupuesto: parseInt(presupuesto)
            },
            programa: {
                codPrograma: parseInt(programa)
            },
            situacionLaboral: {
                codSituacionLaboral: parseInt(codSituacionLaboral)
            },
            fuenteFinanciamiento: {
                codFuenteFinanciamiento: parseInt(fuenteFinancimiento)
            },
            objetoGasto: {
                codObjetoGasto: parseInt(objetoGasto)
            },
            subprograma: {
                codSubprograma: parseInt(subprograma)
            },
            gradoSalarial: {
                nroGrado: parseInt(gradoSalarial)
            },
            asignacion: parseFloat(asignacion)
        };

        console.log("Body a enviar:", body);

        try {
            const response = await axios.post(`${API_BASE_URL}salarios/crear`, body);

            if (response.data.codigoMensaje === "200") {
                toast.success("Planilla salarial creada exitosamente", { autoClose: 2000 });
                navigate("/salarios");
            } else {
                toast.error("Error: " + response.data.mensaje);
            }
        } catch (error) {
            console.error("Error al guardar salario:", error);
            toast.error("No se pudo guardar la planilla");
        }
    };


    return (
        <div className="abm-salarios-container">
            <h1>Agregar Salarios</h1>
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
                        <label>Nombre Completo</label>
                        <input name="nombres" value={formData.nombres || formData.apellidos} onChange={handleChange} readOnly={true}/>
                    </div>
                    <div className="campo">
                        <label>Cargo</label>
                        <input name="descCargo" value={formData.descCargo}
                               onChange={handleChange}
                               readOnly={true}/>
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Asignacion</label>
                        <input
                            name="asignacion"
                            value={formData.asignacion}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Situación Laboral</label>
                        <input
                            name="sitLaboral"
                            value={descripcionesSituacionesLab[formData.codSituacionLaboral] || ""}
                            readOnly
                        />
                    </div>
                    <div className="campo">
                        <label>Presupuesto</label>
                        <select
                            name="presupuesto"
                            value={formData.presupuesto}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Actividades Centrales</option>
                            <option value="2">Servicios Personales</option>
                        </select>
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Programa</label>
                        <select
                            name="programa"
                            value={formData.programa}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Legislativo Municipal</option>
                            <option value="2">Ejecutivo Municipal - Permanente</option>
                            <option value="3">Ejecutivo Municipal - Contratado</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Fuente de Financiamiento</label>
                        <select
                            name="fuenteFinancimiento"
                            value={formData.fuenteFinancimiento}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Recursos Propios</option>
                            <option value="2">Recursos Propios, Royalties y Compensaciones Segun Disponibilidad</option>
                            <option value="30">Recursos Institucionales</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Objeto de Gasto</label>
                        <select
                            name="objetoGasto"
                            value={formData.objetoGasto}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Honorarios Profesionales</option>
                            <option value="2">Contratacion del Personal Tecnico</option>
                            <option value="3">Jornal - Royalties y Compensaciones</option>
                            <option value="4">Jornales</option>
                            <option value="5">Jornal - Fondos Propios 60%</option>
                            <option value="111">Sueldos</option>
                            <option value="112">Dietas</option>
                            <option value="113">Gastos de Representación</option>
                            <option value="114">Aguinaldo Personal Permanente</option>
                        </select>
                    </div>
                </div>

                <div className="fila-triple">
                    <div className="campo">
                        <label>Sub Programa</label>
                        <select
                            name="subprograma"
                            value={formData.subprograma}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="1">Justa Municipal</option>
                            <option value="2">Intendencia Municipal</option>
                            <option value="3">Administración y Finanzas</option>
                            <option value="5">Obras y Servicios Publicos</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Grado</label>
                        <select
                            name="gradoSalarial"
                            value={formData.gradoSalarial}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="0">Grado Salarial Contratado</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Periodo</label>
                        <input
                            type="text"
                            name="codPeriodo"
                            value={formData.codPeriodo}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-guardar" onClick={handleGuardarSalarios}>
                        GUARDAR
                    </button>
                </div>

            </div>
            <ToastContainer/>
        </div>
    );
};

export default AbmSalarios;
