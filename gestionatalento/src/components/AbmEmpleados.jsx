import React, { useState, useEffect } from "react";
import "./AbmEmpleados.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
        telefono: "",
        correo: "",
        poseeDiscapacidad: false,
        descripcionDiscapacidad: "",
        rutaFoto: "",
        codCargo: "",
        fecIngreso: "",
        fecActoAdministrativo: "",
        asignacion: "",
        codSede: "",
        codSituacionLaboral: "",
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
        const docBuscado = localStorage.getItem("personaBuscada");
        if (docBuscado) {
            axios.get("http://localhost:8080/api/v1/Persona/consultaPersona")
                .then(res => {
                    const persona = res.data.find(p => p.nroDocumento === docBuscado);
                    if (persona) {
                        setFormData(persona);
                    }
                    localStorage.removeItem("personaBuscada");
                });
        }
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.poseeDiscapacidad && formData.descripcionDiscapacidad.trim() === "") {
            setError("La descripción de la discapacidad es obligatoria.");
            return; // Detener el envío del formulario
        }

        if (step === 2){
            const codPersonaLocal = localStorage.getItem("codPersona");
            console.log(localStorage.getItem("codPersona"));
            if (!codPersonaLocal) {
                const persona = new Object;
                const estadoCivil = new Object;

                estadoCivil.codEstadoCivil = formData.codEstadoCivil;
                // Asignar valores a través de los setters
                persona.nroDocumento = formData.nroDocumento;
                persona.nombres = formData.nombres;
                persona.apellidos = formData.apellidos;
                persona.nroRuc = formData.nroRuc;
                persona.lugarNacimiento = formData.lugarNacimiento;
                persona.codPaisNacimiento = formData.codPaisNacimiento;
                persona.fecNacimiento = formData.fecNacimiento;
                persona.codNivelEstudio = formData.codNivelEstudio;
                persona.poseeDispacidad = formData.poseeDispacidad;
                if (formData.poseeDiscapacidad){
                    persona.descripcionDiscapacidad = "S";
                } else{
                    persona.descripcionDiscapacidad = "N";
                }
                persona.estadoCivil = estadoCivil;
                persona.rutaFoto = formData.rutaFoto;
                console.log("Datos enviados:", persona);

                
                // Aquí puedes enviar los datos al backend con un POST o PUT
                axios.post("http://localhost:8080/api/v1/Persona/crearPersona", persona)
                    .then((response) => {
                        console.log("Datos guardados correctamente", response);
                        // Agregar la alerta personalizada aquí
                        alert("Persona creada correctamente");
                        localStorage.setItem('codPersona', response.data.codPersona);
                        console.log("persona", localStorage.getItem('codPersona'));
                        // Aquí puedes redirigir al usuario a otra página después del envío
                        //navigate("/empleados"); // Reemplaza "/otra-pagina" con la URL que desees
                    })
                    .catch((error) => {
                        console.error("Error al guardar los datos:", error);
                    });
            }else{
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
                axios.post("http://localhost:8080/empleados/crearEmpleados", empleado)
                    .then((response) => {
                        console.log("Datos guardados correctamente", response);

                        // Agregar la alerta personalizada aquí
                        alert("Empleado creado correctamente");
                        localStorage.setItem('codPersona', response.codPersona);

                        // Aquí puedes redirigir al usuario a otra página después del envío
                        //navigate("/empleados"); // Reemplaza "/otra-pagina" con la URL que desees
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
        alert("Por favor, completa todos los campos obligatorios antes de continuar.");
        return;
    }

    // Si todo está completo, avanzar al Step 2
    setStep(2);
    };

    return (
        <div className="abm-empleados-container">
            <h1>ABM Empleados</h1>
            <p className="volver" onClick={() => navigate(-1)}>← Volver</p>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="formulario">
                        {/* Campos del Step 1 */}
                        <div className="campo">
                            <label>Nro. de Documento</label>
                            <input type="text" name="nroDocumento" value={formData.nroDocumento} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Nombres</label>
                            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Apellidos</label>
                            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>R.U.C.</label>
                            <input type="text" name="nroRuc" value={formData.nroRuc} onChange={handleChange} />
                        </div>
                        <div className="campo">
                            <label>Fecha de Nacimiento</label>
                            <input type="date" name="fecNacimiento" value={formData.fecNacimiento} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Último Título Obtenido</label>
                            <select name="codNivelEstudio" value={formData.codNivelEstudio} onChange={handleChange} required>
                                <option value="P">Primario</option>
                                <option value="S">Secundario</option>
                                <option value="T">Terciario</option>
                            </select> 
                        </div>
                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" name="poseeDiscapacidad" checked={formData.poseeDiscapacidad} onChange={handleChange} required/>
                                ¿Posee Discapacidad?
                            </label>
                        </div>
                        <div className="campo">
                            <label>Discapacidad</label>
                            <input type="text"
                            name="descripcionDiscapacidad"
                            value={formData.descripcionDiscapacidad}
                            onChange={handleChange}
                            disabled={!formData.poseeDiscapacidad}
                            required={formData.poseeDiscapacidad} />
                        </div>
                        <div className="campo">
                            <label>Dirección Particular</label>
                            <input type="text" name="direccionParticular" value={formData.direccionParticular} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Estado Civil</label>
                            <select name="codEstadoCivil" value={formData.codEstadoCivil} onChange={handleChange} required>
                                <option value="1">Soltero/a</option>
                                <option value="2">Casado/a</option>
                                <option value="3">Viudo/a</option>
                            </select> 
                        </div>
                        <div className="campo">
                            <label>Número de Teléfono</label>
                            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Correo Electrónico</label>
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Foto de la Persona</label>
                            <input type="file" name="rutaFoto" value={formData.rutaFoto} onChange={handleChange}/>
                        </div>
                        <div className="campo">
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
                    <div className="formulario">
                        {/* Campos del Step 2 */}
                        <div className="campo">
                            <label>Dependencia</label>
                            <select name="codDireccion" value={formData.codDireccion} onChange={handleChange} required>
                                <option value="1">DIRECCION DE GESTION Y DESARROLLO DE PERSONAS</option>
                                <option value="2">DIRECCION DE GESTION AMBIENTAL Y DESARROLLO HUMANO</option>
                                <option value="3">DIRECCION DE TRANSITO</option>
                                <option value="4">DIRECCION DE PMT</option>
                                <option value="5">DIRECCION DE ADMINISTRACION Y FINANZAS</option>
                            </select> 
                        </div>
                        <div className="campo">
                            <label>Cargo</label>
                            <select name="codCargo" value={formData.codCargo} onChange={handleChange} required>
                                <option value="1">AUXILIAR</option>
                                <option value="2">AUXILIAR</option>
                            </select> 
                        </div>
                        <div className="campo">
                            <label>Fecha de Inicio</label>
                            <input type="date" name="fecIngreso" value={formData.fecIngreso} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Fecha de Acto Administrativo</label>
                            <input type="date" name="fecActoAdministrativo" value={formData.fecActoAdministrativo} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Asignación</label>
                            <input type="number"
                            name="asignacion"
                            value={formData.asignacion}
                            onChange={handleChange}  required/>
                        </div>
                        <div className="campo">
                            <label>Sede</label>
                            <select name="codSede" value={formData.codSede} onChange={handleChange} required>
                                <option value="1">Sede Central</option>
                                <option value="2">Sede Antigua</option>
                                <option value="3">Biblioteca Municipal</option>
                                <option value="4">Juzgado de Faltas</option>
                            </select> 
                        </div>
                        <div className="campo">
                            <label>Situación Laboral</label>
                            <select name="codSituacionLaboral" value={formData.codSituacionLaboral} onChange={handleChange} required>
                                <option value="1">Contratado</option>
                                <option value="3">Comisionado</option>
                                <option value="4">Pasantia Educativa</option>
                                <option value="5">Pasantia Universitaria</option>
                                <option value="2">Permanente</option>
                            </select> 
                        </div>
                        <div className="campo">
                            <label>Horario de Entrada</label>
                            <input type="time" name="horaEntrada" value={formData.horaEntrada} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Horario de Salida</label>
                            <input type="time" name="horaSalida" value={formData.horaSalida} onChange={handleChange} required/>
                        </div>
                        <div className="campo">
                            <label>Nro. de Resolución</label>
                            <input type="text" name="nroResolucion" value={formData.nroResolucion} onChange={handleChange} required/>
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
        </div>
    );
};

export default AbmEmpleados;
