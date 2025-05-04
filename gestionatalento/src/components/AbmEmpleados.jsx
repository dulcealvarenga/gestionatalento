import React, { useState, useEffect } from "react";
import "./AbmEmpleados.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { loadFonts } from './Fonts';
loadFonts();

const AbmEmpleados = () => {
    const [formData, setFormData] = useState({
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        nroRuc: "",
        fecNacimiento: "",
        codNivelEstudio: 1,
        direccionParticular: "",
        codEstadoCivil: 1,
        lugarNacimiento: "",
        telefono: "",
        correo: "",
        poseeDiscapacidad: false,
        descripcionDiscapacidad: "",
        rutaFoto: "",
        codCargo: 1,
        fecIngreso: "",
        fecActoAdministrativo: "",
        asignacion: "",
        codSede: 1,
        codSituacionLaboral: 1,
        nroResolucion: "",
        horaEntrada: "",
        horaSalida: "",
        codDireccion: ""
    });

    const [step, setStep] = useState(1); // Estado para controlar los pasos
    const navigate = useNavigate();
    if (formData.nroDocumento.trim()===""){
        localStorage.removeItem("codPersona");
    }
    useEffect(() => {
        const docBuscado = localStorage.getItem("empleadoBuscado");
        /*if (docBuscado) {
            axios.get("http://localhost:8080/empleados/obtener/id/" + docBuscado)
                .then(res => {
                    const persona = res.data.find(p => p.nroDocumento === docBuscado);
                    if (persona) {
                        setFormData(persona);
                    }
                    localStorage.removeItem("empleadoBuscado");
                });
        }*/
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "poseeDiscapacidad" && !checked) {
            setFormData(prev => ({
                ...prev,
                poseeDiscapacidad: checked,
                descripcionDiscapacidad: "" // Vaciar el campo de discapacidad (descripcion)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.poseeDiscapacidad && formData.descripcionDiscapacidad.trim() === "") {
            setError("La descripción de la discapacidad es obligatoria.");
            return; // Detener el envío del formulario
        }

        if (step === 2){
            const persona = new Object;
            const estadoCivil = new Object;

            // Asignar valores a través de los setters
            persona.codPersona = localStorage.getItem("codPersona");
            persona.nroDocumento = formData.nroDocumento;
            persona.nombres = formData.nombres;
            persona.apellidos = formData.apellidos;
            persona.nroRuc = formData.nroRuc;
            persona.lugarNacimiento = formData.lugarNacimiento;
            persona.codPaisNacimiento = 1;//formData.codPaisNacimiento;
            persona.fecNacimiento = formData.fecNacimiento;
            persona.codNivelEstudio = formData.codNivelEstudio;
            if (formData.poseeDiscapacidad){
                persona.poseeDiscapacidad = "S";
            } else{
                persona.poseeDiscapacidad = "N";
            }
            persona.descripcionDiscapacidad = formData.descripcionDiscapacidad;

            estadoCivil.codEstadoCivil = formData.codEstadoCivil;
            persona.estadoCivil = estadoCivil;
            persona.lugarNacimiento = formData.lugarNacimiento;
            persona.rutaFoto = formData.rutaFoto;
            console.log("Datos enviados:", persona);

            
            // Aquí puedes enviar los datos al backend con un POST o PUT
            const response = await axios.post("http://localhost:8080/personas/crear", persona);
            const genericResponse = response.data;
            if (genericResponse.codigoMensaje === "409") {
                const response = await axios.put("http://localhost:8080/personas/actualizar", persona);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    toast.success("Persona Actualizada", { autoClose: 2000 });
                }
            } else if (genericResponse.codigoMensaje === "200") {
                localStorage.setItem('codPersona', genericResponse.objeto.codPersona);
            }
            if(formData.asignacion > 0){
                const empleado = new Object;
                const persona = new Object;
                const cargo = new Object;
                const sede = new Object;
                const situacionLaboral = new Object;

                persona.codPersona = localStorage.getItem("codPersona");
                cargo.codCargo = formData.codCargo;
                sede.codSede = formData.codSede;
                situacionLaboral.codSituacionLaboral = formData.codSituacionLaboral;

                empleado.persona = persona;
                empleado.cargo = cargo;
                empleado.sede = sede;
                empleado.situacionLaboral = situacionLaboral;
                empleado.asignacion = formData.asignacion;
                empleado.estado = "A";
                empleado.fecActoAdministrativo = formData.fecActoAdministrativo;
                empleado.fecIngreso = formData.fecIngreso;
                empleado.horaEntrada = formData.horaEntrada;
                empleado.horaSalida = formData.horaSalida;
                empleado.nroResolucion = formData.nroResolucion;
                empleado.observacion = formData.observacion;
                console.log("Empleado enviado", empleado);
                axios.post("http://localhost:8080/empleados/crear", empleado)
                    .then((response) => {
                        if (response.data.codigoMensaje == "200") {
                            toast.info(response.data.mensaje, { autoClose: 2000 });
                            localStorage.removeItem("codPersona");
                            navigate("/empleados");
                        }else{
                            toast.error(response.data.mensaje, { autoClose: 2000 });
                        }
                        localStorage.setItem('codPersona', response.data.objeto.persona.codPersona);
                    })
                    .catch((error) => {
                        console.error("Error al guardar los datos:", error);
                    });
            }
        }
    };

    const goToStep1 = () => {
        setStep(1); // Retroceder al paso 1
    };

    const goToStep2 = () => {
        // Seleccionar todos los inputs del Step 1 que tengan el atributo "required"
    const requiredInputs = document.querySelectorAll("input[required], select[required]");

    // Filtrar los que están vacíos
    const emptyFields = Array.from(requiredInputs).filter(input => !input.value.trim());

    if (emptyFields.length > 0) {
        toast.info("Debe completar los datos obligatorios", { autoClose: 2000 });
        return;
    }

    // Si todo está completo, avanzar al Step 2
    setStep(2);
    };

    const handleBuscarPorDocumento = async () => {
        const nroDocumento = formData.nroDocumento;
        if (!nroDocumento) return;
        try {
            const response = await axios.get('http://localhost:8080/personas/obtener/documento/' + nroDocumento);
            if (response.data.codigoMensaje === "200") {
                toast.success("Persona encontrada", { autoClose: 2000 });
                const persona = response.data.objeto;
                localStorage.setItem('codPersona', persona.codPersona);
                setFormData(prev => ({
                    ...prev,
                    nombres: persona.nombres || '',
                    apellidos: persona.apellidos || '',
                    nroRuc: persona.nroRuc || '',
                    fecNacimiento: persona.fecNacimiento || '',
                    codNivelEstudio: persona.codNivelEstudio || '',
                    poseeDiscapacidad: persona.poseeDiscapacidad === "S",
                    descripcionDiscapacidad: persona.descripcionDiscapacidad || '',
                    direccionParticular: persona.direccionParticular || '',
                    codEstadoCivil: persona.estadoCivil?.codEstadoCivil || '',
                    lugarNacimiento: persona.lugarNacimiento || '',
                    telefono: persona.telefono || '',
                    correo: persona.correo || ''
                }));
            } else {
                toast.info("No se encontró la persona registrada, avanzar con el registro", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error al buscar persona:", error);
            toast.error("Error al buscar persona", { autoClose: 2000 });
        }
    };

    return (
        <div className="abm-empleados-container">
            <h1>ABM Empleados</h1>
            <p className="volver" onClick={() => navigate(-1)}>← Volver</p>

            <form onSubmit={handleSubmit} onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
            }}>
                {step === 1 && (
                    <div className="formulario-empleado">
                        {/* Campos del Step 1 */}
                        <div className="campo-empleado">
                            <label>Nro. de Documento</label>
                            <input 
                                type="text"
                                name="nroDocumento"
                                value={formData.nroDocumento}
                                onChange={handleChange}
                                onBlur={handleBuscarPorDocumento}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleBuscarPorDocumento();
                                    }
                                }}
                                required
                            />
                        </div>
                        <div className="campo-empleado">
                            <label>Nombres</label>
                            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Apellidos</label>
                            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>R.U.C.</label>
                            <input type="text" name="nroRuc" value={formData.nroRuc} onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Fecha de Nacimiento</label>
                            <input type="date" name="fecNacimiento" value={formData.fecNacimiento} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Último Título Obtenido</label>
                            <select name="codNivelEstudio" value={formData.codNivelEstudio} onChange={handleChange} >
                                <option value="P">Primario</option>
                                <option value="S">Secundario</option>
                                <option value="T">Terciario</option>
                            </select> 
                        </div>
                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" name="poseeDiscapacidad" checked={formData.poseeDiscapacidad} onChange={handleChange} />
                                ¿Posee Discapacidad?
                            </label>
                        </div>
                        <div className="campo-empleado">
                            <label>Discapacidad</label>
                            <input type="text"
                            name="descripcionDiscapacidad"
                            value={formData.descripcionDiscapacidad}
                            onChange={handleChange}
                            disabled={!formData.poseeDiscapacidad}
                            required={formData.poseeDiscapacidad} />
                        </div>
                        <div className="campo-empleado">
                            <label>Dirección Particular</label>
                            <input type="text" name="direccionParticular" value={formData.direccionParticular} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Estado Civil</label>
                            <select name="codEstadoCivil" value={formData.codEstadoCivil} onChange={handleChange}>
                                <option value="1">Soltero/a</option>
                                <option value="2">Casado/a</option>
                                <option value="3">Viudo/a</option>
                            </select> 
                        </div>
                        <div className="campo-empleado">
                            <label>Lugar de Nacimiento</label>
                            <input type="text" name="lugarNacimiento" value={formData.lugarNacimiento} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Número de Teléfono</label>
                            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Correo Electrónico</label>
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required/>
                        </div>
                        <div className="campo-empleado">
                            <label>Foto de la Persona</label>
                            <input type="file" name="rutaFoto" value={formData.rutaFoto} onChange={handleChange}/>
                        </div>
                        <div className="campo-empleado">
                            {formData.foto && (
                                <div className="image-preview">
                                    <img 
                                        src="logo.png"
                                      	
                                        style={{ width: '200px', height: 'auto', marginTop: '10px' }} 
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="formulario-empleado">
                        {/* Campos del Step 2 */}
                        <div className="campo-empleado">
                            <label>Dependencia</label>
                            <select name="codDireccion" value={formData.codDireccion} onChange={handleChange} required>
                                <option value="1">DIRECCION DE GESTION Y DESARROLLO DE PERSONAS</option>
                                <option value="2">DIRECCION DE GESTION AMBIENTAL Y DESARROLLO HUMANO</option>
                                <option value="3">DIRECCION DE TRANSITO</option>
                                <option value="4">DIRECCION DE PMT</option>
                                <option value="5">DIRECCION DE ADMINISTRACION Y FINANZAS</option>
                            </select> 
                        </div>
                        <div className="campo-empleado">
                            <label>Cargo</label>
                            <select name="codCargo" value={formData.codCargo} onChange={handleChange} required>
                                <option value="1">AUXILIAR</option>
                                <option value="2">AUXILIAR</option>
                            </select> 
                        </div>
                        <div className="campo-empleado">
                            <label>Fecha de Inicio</label>
                            <input type="date" name="fecIngreso" value={formData.fecIngreso} onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Fecha de Acto Administrativo</label>
                            <input type="date" name="fecActoAdministrativo" value={formData.fecActoAdministrativo} onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Asignación</label>
                            <input type="number"
                            name="asignacion"
                            value={formData.asignacion}
                            onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Sede</label>
                            <select name="codSede" value={formData.codSede} onChange={handleChange} >
                                <option value="1">Sede Central</option>
                                <option value="2">Sede Antigua</option>
                                <option value="3">Biblioteca Municipal</option>
                                <option value="4">Juzgado de Faltas</option>
                            </select> 
                        </div>
                        <div className="campo-empleado">
                            <label>Situación Laboral</label>
                            <select name="codSituacionLaboral" value={formData.codSituacionLaboral} onChange={handleChange} >
                                <option value="1">Contratado</option>
                                <option value="3">Comisionado</option>
                                <option value="4">Pasantia Educativa</option>
                                <option value="5">Pasantia Universitaria</option>
                                <option value="2">Permanente</option>
                            </select> 
                        </div>
                        <div className="campo-empleado">
                            <label>Horario de Entrada</label>
                            <input type="time" name="horaEntrada" value={formData.horaEntrada} onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Horario de Salida</label>
                            <input type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} />
                        </div>
                        <div className="campo-empleado">
                            <label>Nro. de Resolución</label>
                            <input type="text" name="nroResolucion" value={formData.nroResolucion} onChange={handleChange} />
                        </div>
                    </div>
                )}

                {/* Contenedor de los botones */}
                <div className="boton-container">
                {step === 2 && (
                    <button type="button" className="guardar" onClick={goToStep1}>
                        Anterior
                    </button>
                )}
                    <button type="submit" className="guardar" onClick={goToStep2}>
                        {step === 1 ? "Siguiente" : "Guardar"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AbmEmpleados;
