import React, { useState } from "react";
import "./AbmDescuentos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { API_BASE_URL } from '../config/constantes.js';

const DescuentoForm = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        codCargo: 1,
        asignacion: "",
        horaEntrada: "",
        horaSalida: "",
        salidaAnticipada: "",
        entradaTardia: "",
        ausencia: "",
        direccion: "",
        sede: "",
        empleado: "",
        monto: "",
        mtoSalidaAnticipada:"",
        mtoEntradaTardia: "",
        mtoAusencias: "",
        entradaTardiaSis: "",
        salidaAnticipadaSis: "",
        ausenciasSis: "",
    });

    // Función para actualizar el estado de formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
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
                    descSede: empleado.sede?.descripcion || '',
                    codDireccion: empleado.cargo?.departamento?.direccion?.codDireccion || '',
                    descDireccion: empleado.cargo?.departamento?.direccion?.descripcion || '',
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

    const handleCalcular = async () => {
        const nroDocumento = formData.nroDocumento;
        const response = await axios.get(`${API_BASE_URL}empleados/obtener/documento/${nroDocumento}`);
        const empleado = response.data.objeto[0];
        try {
            const requestBody = {
                entradaTardia: formData.entradaTardia || "0",
                salidaAnticipada: formData.salidaAnticipada || "0",
                ausencia: formData.ausencia || "0",
                periodo: {
                    nroPeriodo: 1 //
                },
                empleado: empleado //
            };

            console.log(requestBody);

            const response = await axios.post(`${API_BASE_URL}descuentos-salariales/calcular`, requestBody);
            const descuentoSalarial = response.data.objeto;

            if (!descuentoSalarial || !descuentoSalarial.empleado) {
                toast.error("No se recibió respuesta válida del cálculo");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                monto: descuentoSalarial.monto,
                empleado: descuentoSalarial.empleado,
                nombres: descuentoSalarial.empleado.persona?.nombres || '',
                apellidos: descuentoSalarial.empleado.persona?.apellidos || '',
                asignacion: descuentoSalarial.empleado.asignacion || '',
                direccion: descuentoSalarial.empleado.cargo?.departamento?.direccion || '',
                sede: descuentoSalarial.empleado.sede || ''
            }));

            toast.success("Cálculo realizado con éxito", { autoClose: 2000 });

        } catch (error) {
            console.error("Error en cálculo:", error);
            toast.error("Error al calcular descuento salarial");
        }
    };

    const handleGuardar = async () => {
        const nroDocumento = formData.nroDocumento;
        const response = await axios.get(`${API_BASE_URL}empleados/obtener/documento/${nroDocumento}`);
        const empleado = response.data.objeto[0];

        if (!empleado || !empleado.codEmpleado) {
            toast.warning("Buscá primero un funcionario válido.", { autoClose: 2000 });
            return;
        }

        const requestBody = {
            entradaTardia:  parseInt(formData.entradaTardia || "0"),
            salidaAnticipada: parseInt(formData.salidaAnticipada || "0"),
            ausencia: parseInt(formData.ausencia || "0"),
            periodo: {
                nroPeriodo: 1 // Podés hacerlo dinámico si lo necesitás
            },
            empleado: {
                codEmpleado: formData.empleado.codEmpleado
            },
            monto: parseInt(formData.monto || "0"),
            observacion: formData.observacion || "",
        };

        console.log("guardar: ", requestBody);

        try {
            const response = await axios.post(`${API_BASE_URL}descuentos-salariales/crear`, requestBody);
            const descuentoSalarial = response.data.objeto;

            if (!descuentoSalarial || !descuentoSalarial.empleado) {
                toast.error("No se pudo guardar correctamente.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                monto: descuentoSalarial.monto,
                empleado: descuentoSalarial.empleado,
                nombres: descuentoSalarial.empleado.persona?.nombres || '',
                apellidos: descuentoSalarial.empleado.persona?.apellidos || '',
                asignacion: descuentoSalarial.empleado.asignacion || '',
                direccion: descuentoSalarial.empleado.cargo?.departamento?.direccion || '',
                sede: descuentoSalarial.empleado.sede || ''
            }));

            toast.success("Descuento Salarial guardado exitosamente", { autoClose: 2000 });
            setTimeout(() => navigate("/descuentos"), 2000);
        } catch (error) {
            console.log(error);
            console.error("Error al guardar descuento:", error);
            toast.error("Error al guardar descuento salarial");
        }
    };

    return (
        <div className="descuento-form-container">
            <h1>Agregar/Modificar Descuentos Salariales</h1>
            <p className="volver" onClick={() => navigate(-1)}>← Volver</p>

            <div className="form-card">
                <div className="descuento-info">
                    <div className="descuentos-anteriores">
                        <label className="tit-desc-ant">Desc. Anteriores</label>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <div className="foto-area">
                        <img src="/avatar.png" alt="Foto" className="foto-empleado"/>
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

                    <div className="campo-doble">
                        <label style={{fontSize: '20px'}}>Nombre Completo</label>
                        <input
                            type="text"
                            value={formData.nombres + " " + formData.apellidos}
                            disabled
                        />
                    </div>
                    <div className="campo-doble">
                        <label style={{fontSize: '20px'}}>Asignación</label>
                        <input
                            type="text"
                            name="asignacion"
                            value={formData.asignacion}
                            disabled
                        />
                    </div>
                </div>

                <div className="grid-form-columns">
                    <div className="col">
                        <div className="campo">
                            <label>Entradas Tardías Sis</label>
                            <input type="number" name="entradaTardiaSis"
                                   value={formData.entradaTardiaSis}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Entradas Tardías</label>
                            <input type="number" name="entradaTardia"
                                   value={formData.entradaTardia}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Monto E.T.</label>
                            <input type="number"
                                   name="mtoEntradaTardia"
                                   value={formData.mtoEntradaTardia}
                                   disabled/>
                        </div>
                        <div className="campo">
                            <label>Sede</label>
                            <input type="text"
                                   name="descSede"
                                   value={formData.descSede}
                                   disabled/>
                        </div>
                    </div>

                    <div className="col">
                        <div className="campo">
                            <label>Salidas Anticipadas Sis</label>
                            <input type="number"
                                   name="salidaAnticipadaSis"
                                   value={formData.salidaAnticipadaSis}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Salidas Anticipadas</label>
                            <input type="number"
                                   name="salidaAnticipada"
                                   value={formData.salidaAnticipada}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Monto S.A.</label>
                            <input type="number"
                                   name="mtoSalidaAnticipada"
                                   value={formData.mtoSalidaAnticipada}
                                   disabled/>
                        </div>
                        <div className="campo">
                            <label>Horario de Entrada</label>
                            <input
                                type="time"
                                value={formData.horaEntrada}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="col">
                        <div className="campo">
                            <label>Ausencias Sis</label>
                            <input type="number"
                                   name="ausenciasSis"
                                   value={formData.ausenciasSis}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Ausencias</label>
                            <input type="number"
                                   name="ausencia"
                                   value={formData.ausencia}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Monto Ausencias</label>
                            <input type="number"
                                   name="mtoAusencias"
                                   value={formData.mtoAusencias}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Horario de Salida</label>
                            <input
                                type="time"
                                name="horaSalida"
                                value={formData.horaSalida}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="col">
                        <div className="campo">
                            <label>Dependencia</label>
                            <input type="text"
                                   name="descDireccion"
                            value={formData.descDireccion}
                            disabled/>
                        </div>
                        <div className="campo">
                            <label>Observación</label>
                            <input type="text"
                                   name="observacion"
                                   value={formData.observacion}
                                   onChange={handleChange}/>
                        </div>
                        <div className="campo">
                            <label>Monto Total</label>
                            <input type="text" value={formData.monto} />
                        </div>
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-calcular" onClick={handleCalcular}>CALCULAR</button>
                    <button className="btn-guardar"onClick={handleGuardar}>GUARDAR</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DescuentoForm;
