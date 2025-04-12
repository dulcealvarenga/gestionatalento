import React, { useState } from "react";
import axios from "axios";
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


    const buscarEmpleadoPorDocumento = async (documento) => {
        try {
            // Paso 1: buscar todas las personas
            const empleadoResponse = await axios.get("http://localhost:8080/empleados/obtener/documento/" + documento);
            if (empleadoResponse.data.codigoEstado == "200"){
                // Paso 2: buscar empleado por codPersona
                const empleadoRes = await axios.get("http://localhost:8080/empleados/obtener/documento/" + documento);
                const empleado = empleadoRes.data.objeto;

                // Paso 3: cargar datos en el form
                setForm((prev) => ({
                    ...prev,
                    codEmpleado: empleado.codEmpleado,
                    codPersona: persona.codPersona,
                    nombres: persona.nombres,
                    apellidos: persona.apellidos,
                    cargo: empleado.cargo.descripcion,
                    situacionLaboral: empleado.situacionLaboral.descripcion,
                    fecActoAdministrativo : empleado.fecActoAdministrativo
                }));
            }else{
                alert("No se encontró ninguna persona con ese documento.");
                return;
            }        
        } catch (error) {
            console.error("Error al buscar empleado por documento:", error);
            alert("Ocurrió un error al buscar el funcionario.");
        }
    };


    const handleDarDeBaja = async () => {
        try {
            
            const empleadoBaja = new Object;
            empleadoBaja.codEmpleado = form.codEmpleado;
            empleadoBaja.fecEgreso = form.fecEgreso;
            console.log(empleadoBaja);
            await axios.put('http://localhost:8080/empleados/bajar', empleadoBaja);

            alert("Funcionario dado de baja con éxito ✅");
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
        } catch (error) {
            console.error("Error al dar de baja:", error);
            alert("No se pudo dar de baja al funcionario ❌");
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
                            buscarEmpleadoPorDocumento(form.nroDocumento);
                        }
                    }}
                />
                <input name="nombres" placeholder="Nombres" value={form.nombres} disabled/>
                <input name="apellidos" placeholder="Apellidos" value={form.apellidos} disabled/>
                <input name="cargo" placeholder="Cargo" value={form.cargo} disabled/>
                <input name="fecActoAdministrativo" type="date" value={form.fecActoAdministrativo}
                       onChange={handleChange} disabled/>
                <input name="situacionLaboral" placeholder="Situación Laboral" value={form.situacionLaboral} disabled/>
                Fecha de Egreso:
                <input name="fecEgreso" type="date" value={form.fecEgreso} onChange={handleChange}/>
                <input name="observacion" placeholder="Comentario" value={form.observacion} onChange={handleChange}/>

                <button className="baja-btn" onClick={handleDarDeBaja}>DAR DE BAJA</button>
            </div>
        </div>
    );
};

export default BajaEmpleados;