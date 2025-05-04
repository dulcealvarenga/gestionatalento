import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "./BajaEmpleados.css";

const BajaEmpleados = () => {
    const [form, setForm] = useState({
        codEmpleado: "",
        nroDocumento: "",
        codPersona: "",
        nombres: "",
        apellidos: "",
        cargo: "",
        situacionLaboral: "",
        fecActoAdministrativo: "",
        fecEgreso: "",
        observacion: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const buscarEmpleadoPorDocumento = async () => {
        const nroDocumento = form.nroDocumento;
        if (!nroDocumento) return;
        try {
            // Paso 1: buscar todas las personas
            const response = await axios.get("http://localhost:8080/empleados/obtener/documento/activo/" + nroDocumento);
            const genericResponse = response.data;
            if (genericResponse.codigoMensaje == "200"){
                const empleado = genericResponse.objeto;

                // Paso 3: cargar datos en el form
                setForm((prev) => ({
                    ...prev,
                    codEmpleado: empleado.codEmpleado,
                    codPersona: empleado.persona.codPersona,
                    nombres: empleado.persona.nombres,
                    apellidos: empleado.persona.apellidos,
                    cargo: empleado.cargo.descripcion,
                    situacionLaboral: empleado.situacionLaboral.descripcion,
                    fecActoAdministrativo : empleado.fecActoAdministrativo
                }));
                return true;
            }else{
                toast.error(genericResponse.mensaje, { autoClose: 2000 });
                return false;
            }        
        } catch (error) {
            console.error("Error al buscar empleado por documento:", error);
            toast.error("No se pudo dar de baja al funcionario ", { autoClose: 2000 });
            return false;
        }
    };


    const handleDarDeBaja = async () => {
        const requiredInputs = document.querySelectorAll("input[required], select[required]");

        // Filtrar los que están vacíos
        const emptyFields = Array.from(requiredInputs).filter(input => !input.value.trim());

        if (emptyFields.length > 0) {
            toast.info("Debe completar los datos obligatorios", { autoClose: 2000 });
            return;
        }
        try {
            const empleadoBaja = new Object;
            empleadoBaja.codEmpleado = form.codEmpleado;
            empleadoBaja.fecEgreso = form.fecEgreso;
            const existeEmpleado = buscarEmpleadoPorDocumento();
            if (existeEmpleado == true) {
                const response = await axios.put('http://localhost:8080/empleados/bajar', empleadoBaja);
                const genericResponse = response.data;

                if (genericResponse.codigoMensaje == "200") {
                    toast.success(genericResponse.mensaje, { autoClose: 2000 });
                    setForm({
                        codEmpleado: "",
                        nroDocumento: "",
                        codPersona: "",
                        nombres: "",
                        apellidos: "",
                        cargo: "",
                        situacionLaboral: "",
                        fecActoAdministrativo: "",
                        fecEgreso: "",
                        observacion: ""
                    });
                } else {
                    toast.error(genericResponse.mensaje, { autoClose: 2000 });
                }
            }
            
        } catch (error) {
            console.error("Error al dar de baja:", error);
            toast.error("No se pudo dar de baja al funcionario ", { autoClose: 2000 });
        }
    };

    return (
        <div className="baja-container">
            <h2>Baja de Funcionarios</h2>
            <button className="volver" onClick={() => window.history.back()}>← Volver</button>

            <div className="baja-form">
                <input
                    name="nroDocumento"
                    placeholder="Nro. de Documento"
                    value={form.nroDocumento}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // Evita que el form se recargue
                            buscarEmpleadoPorDocumento;
                        }
                    }}
                    onBlur={buscarEmpleadoPorDocumento}
                />
                <input name="nombres" placeholder="Nombres" value={form.nombres} disabled/>

                <input name="apellidos" placeholder="Apellidos" value={form.apellidos} disabled/>

                <input name="cargo" placeholder="Cargo" value={form.cargo} disabled/>

                <input
                    name="fecActoAdministrativo"
                    type="date"
                    value={form.fecActoAdministrativo}
                    onChange={handleChange} disabled
                />

                <input name="situacionLaboral" placeholder="Situación Laboral" value={form.situacionLaboral} disabled/>
                
                Fecha de Egreso:
                <input name="fecEgreso" type="date" value={form.fecEgreso} onChange={handleChange} required/>
                <input name="observacion" placeholder="Comentario" value={form.observacion} onChange={handleChange}/>

                <button className="baja-btn" onClick={handleDarDeBaja}>DAR DE BAJA</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BajaEmpleados;