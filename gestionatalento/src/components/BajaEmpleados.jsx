import React, { useState } from "react";
import axios from "axios";
import "./BajaEmpleados.css";

const BajaEmpleados = () => {
    const [form, setForm] = useState({
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
            const personasRes = await axios.get("http://localhost:8080/api/v1/Persona/consultaPersona");
            const persona = personasRes.data.find(p => p.nroDocumento === documento);

            if (!persona) {
                alert("No se encontró ninguna persona con ese documento.");
                return;
            }

            // Paso 2: buscar empleado por codPersona
            const empleadoRes = await axios.get(`http://localhost:8080/empleados/buscar/Empleado/${persona.codPersona}`);
            const empleado = empleadoRes.data;

            // Paso 3: cargar datos en el form
            setForm((prev) => ({
                ...prev,
                codPersona: persona.codPersona,
                nombres: persona.nombres,
                apellidos: persona.apellidos,
                cargo: empleado.cargo?.descripcion || "",
                situacionLaboral: empleado.situacionLaboral?.descripcion || ""
            }));
        } catch (error) {
            console.error("Error al buscar empleado por documento:", error);
            alert("Ocurrió un error al buscar el funcionario.");
        }
    };


    const handleDarDeBaja = async () => {
        try {
            await axios.delete(`http://localhost:8080/empleados/${form.codPersona}/eliminarEmpleado`);
            alert("Funcionario dado de baja con éxito ✅");
            setForm({
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
                       onChange={handleChange}/>
                <input name="situacionLaboral" placeholder="Situación Laboral" value={form.situacionLaboral} disabled/>
                <input name="fecEgreso" type="date" value={form.fecEgreso} onChange={handleChange}/>
                <input name="observacion" placeholder="Comentario" value={form.observacion} onChange={handleChange}/>

                <button className="baja-btn" onClick={handleDarDeBaja}>DAR DE BAJA</button>
            </div>
        </div>
    );
};

export default BajaEmpleados;