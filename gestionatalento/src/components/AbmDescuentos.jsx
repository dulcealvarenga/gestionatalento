import React, { useState, useEffect } from "react";
import "./AbmDescuentos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

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
        monto: ""
    });

    // Función para actualizar el estado de formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchEmpleado = async () => {
        try {
            const response = await axios.get('http://localhost:8080/empleados/obtener/documento/activo/7086037');
            const empleado = response.data.objeto;
            // Actualizar formData con los datos obtenidos
            setFormData({
                ...formData,
                nroDocumento: empleado.nroDocumento,
                nombres: empleado.persona.nombres,
                apellidos: empleado.persona.apellidos,
                nroRuc: empleado.nroRuc,
                fecNacimiento: empleado.fecNacimiento,
                asignacion: empleado.asignacion,
                direccion:empleado.cargo.departamento.direccion,
                sede: empleado.sede,
                empleado: empleado
                // Otros campos que desees actualizar
            });
        } catch (error) {
            console.error("Error al obtener empleado:", error);
        }
    };

    useEffect(() => {
        fetchEmpleado();
    }, []);

    const handleCalcular = async () => {
        try {
            const descuento = {entradaTardia: formData.entradaTardia,
                salidaAnticipada: formData.salidaAnticipada,
                ausencia: formData.ausencia,
                codPeriodo: "2025/05",
                empleado: formData.empleado};
                console.log(descuento);
            const response = await axios.post('http://localhost:8080/descuentos-salariales/calcular', descuento);
            const descuentoSalarial = response.data.objeto;
            setFormData({
                ...formData,
                nroDocumento: descuentoSalarial.empleado.nroDocumento,
                nombres: descuentoSalarial.empleado.persona.nombres,
                apellidos: descuentoSalarial.empleado.persona.apellidos,
                nroRuc: descuentoSalarial.empleado.nroRuc,
                fecNacimiento: descuentoSalarial.empleado.fecNacimiento,
                asignacion: descuentoSalarial.empleado.asignacion,
                direccion:descuentoSalarial.empleado.cargo.departamento.direccion,
                sede: descuentoSalarial.empleado.sede,
                empleado: descuentoSalarial.empleado,
                monto: descuentoSalarial.monto
                // Otros campos que desees actualizar
            });
                /*
            const response = await axios.post('http://localhost:8080/descuentos-salariales/calcular', {
                entradaTardia: formData.entradaTardia,
                salidaAnticipada: formData.salidaAnticipada,
                ausencia: formData.ausencia,
                codPeriodo: "2025/05",
                empleado: formData.empleado
            });*/
            
            // Aquí puedes procesar la respuesta de la API y actualizar el estado con los resultados si es necesario
            console.log("Resultado de cálculo:", descuentoSalarial);
        } catch (error) {
            console.error("Error al calcular:", error);
        }
    };

    const handleGuardar = async () => {
        try {
            const descuento = {entradaTardia: formData.entradaTardia,
                salidaAnticipada: formData.salidaAnticipada,
                ausencia: formData.ausencia,
                codPeriodo: "2025/05",
                empleado: formData.empleado};
                console.log(descuento);
            const response = await axios.post('http://localhost:8080/descuentos-salariales/crear', descuento);
            const descuentoSalarial = response.data.objeto;
            setFormData({
                ...formData,
                nroDocumento: descuentoSalarial.empleado.nroDocumento,
                nombres: descuentoSalarial.empleado.persona.nombres,
                apellidos: descuentoSalarial.empleado.persona.apellidos,
                nroRuc: descuentoSalarial.empleado.nroRuc,
                fecNacimiento: descuentoSalarial.empleado.fecNacimiento,
                asignacion: descuentoSalarial.empleado.asignacion,
                direccion:descuentoSalarial.empleado.cargo.departamento.direccion,
                sede: descuentoSalarial.empleado.sede,
                empleado: descuentoSalarial.empleado,
                monto: descuentoSalarial.monto
                // Otros campos que desees actualizar
            });
                /*
            const response = await axios.post('http://localhost:8080/descuentos-salariales/calcular', {
                entradaTardia: formData.entradaTardia,
                salidaAnticipada: formData.salidaAnticipada,
                ausencia: formData.ausencia,
                codPeriodo: "2025/05",
                empleado: formData.empleado
            });*/
            
            // Aquí puedes procesar la respuesta de la API y actualizar el estado con los resultados si es necesario
            console.log("Resultado de cálculo:", descuentoSalarial);
            toast.success("Descuento Salarial cargado exitosamente", { autoClose: 2000 });
                setTimeout(() => {
                    navigate("/descuentos");
                }, 2000);
        } catch (error) {
            console.error("Error al calcular:", error);
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
                        <p>Nro. 7.086.037</p>
                    </div>

                    <div className="campo-triple">
                        <div>
                            <label style={{ fontSize: '20px' }}>Nombre Completo</label>
                            <input 
                                type="text" 
                                value={formData.nombres + " " + formData.apellidos} 
                                disabled 
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '20px' }}>Asignación</label>
                            <input 
                                type="text" 
                                name="asignacion" 
                                value={formData.asignacion} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>
                </div>

                <div className="grid-form-columns">
                    <div className="col">
                        <div className="campo"><label>Entradas Tardías</label><input type="number" name="entradaTardia" 
                                value={formData.entradaTardia} 
                                onChange={handleChange} /></div>
                        <div className="campo"><label>Sede</label><input type="text" value = "SEDE CENTRAL" disabled/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Salidas Anticipadas</label><input type="number" name="salidaAnticipada" 
                                value={formData.salidaAnticipada} 
                                onChange={handleChange} /></div>
                        <div className="campo"><label>Horario de Entrada</label><input type="time" value="07:00"/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Ausencias</label><input type="number" name="ausencia" 
                                value={formData.ausencia} 
                                onChange={handleChange} /></div>
                        <div className="campo"><label>Horario de Salida</label><input type="time" value="13:00"/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Dependencia</label><input type="text" value = {formData.direccion.descripcion} disabled/></div>
                        <div className="campo"><label>Observación</label><input type="text" /></div>
                        <div className="campo"><label>Monto Total</label><input type="text" value = {formData.monto} /></div>
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
