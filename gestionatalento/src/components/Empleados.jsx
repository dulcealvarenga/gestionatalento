import React, { useState, useEffect } from "react";
import "./Empleados.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Empleados = () => {

    const [listaEmpleados, setListaEmpleados] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const docBuscado = localStorage.getItem("personaBuscada");

        if (docBuscado) {
            axios.get("http://localhost:8080/api/v1/Persona/consultaPersona")
                .then(res => {
                    const personas = res.data;
                    const filtradas = personas.filter(p => p.nroDocumento === docBuscado);
                    setListaEmpleados(filtradas);
                    localStorage.removeItem("personaBuscada"); // Limpieza
                });
        } else {
            // Trae toda la lista si no vino filtrado
            axios.get("http://localhost:8080/api/v1/Persona/consultaPersona")
                .then(res => setListaEmpleados(res.data));
        }
    }, []);

    // para que traiga solo comisionados
    const [soloComisionados, setSoloComisionados] = useState(false);
    // para mostrar formulario de edicion
    const [mostrarModal, setMostrarModal] = useState(false);
    const [empleadoEditando, setEmpleadoEditando] = useState(null);
    const empleadosFiltrados = soloComisionados
        ? listaEmpleados.filter((e) => e.comisionado)
        : listaEmpleados;

    const handleEditar = (empleado) => {
        setEmpleadoEditando(empleado);
        setMostrarModal(true);
    };

    const actualizarCampo = (campo, valor) => {
        setEmpleadoEditando(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const handleGuardarCambios = (e) => {
        e.preventDefault();
        console.log("Empleado actualizado:", empleadoEditando);

        // Aquí hacés el PUT o POST al backend si ya tenés definido.
        setMostrarModal(false);
    };

    return (
        <div className="empleados-container">
            <h1>Empleados</h1>
            <p className="acciones-title" style={{ fontSize: "22px"}}>Acciones</p>

            <div className="acciones-buttons">
                <button className="boton-accion" onClick={() => navigate("/abmEmpleados")}>AGREGAR EMPLEADO</button>
                <button className="boton-accion">PASANTES</button>
                <button className="boton-accion">BAJA DE EMPLEADOS</button>
                <button className="boton-accion">INFORMES</button>
            </div>

            <div className="filtro-comisionado">
                <input
                    type="checkbox"
                    id="comisionado"
                    checked={soloComisionados}
                    onChange={() => setSoloComisionados(!soloComisionados)}
                />
                <label htmlFor="comisionado" style={{ fontSize: "22px"}}>Mostrar solo Comisionados</label>
            </div>

            <table className="tabla-empleados">
                <thead>
                <tr>
                    <th style={{ fontSize: "20px"}}>Legajos</th>
                    <th style={{ fontSize: "20px"}}>Foto</th>
                    <th style={{ fontSize: "20px"}}>Nro. de Documento</th>
                    <th style={{ fontSize: "20px"}}>Nombre Completo</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Nacimiento</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Ingreso</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Egreso</th>
                    <th style={{ fontSize: "20px"}}>Dirección</th>
                </tr>
                </thead>
                <tbody>
                {empleadosFiltrados.map((emp) => (
                    <tr key={emp.id}>
                        <td>
                            <button className="ver-btn">ver</button>
                        </td>
                        <td>
                            <img src={emp.rutaFoto} alt="Foto" className="foto-empleado" />
                        </td>
                        <td style={{ fontSize: "20px"}}>{emp.nroDocumento}</td>
                        <td style={{ fontSize: "20px"}}>{emp.nombre || emp.apellido}</td>
                        <td style={{ fontSize: "20px"}}>{emp.fecNacimiento}</td>
                        <td style={{ fontSize: "20px"}}>{emp.ingreso}</td>
                        <td style={{ fontSize: "20px"}}>{emp.egreso}</td>
                        <td className="direccion-cell" style={{ fontSize: "20px"}}>
                            {emp.direccion}
                            <span
                                className="editar-icon"
                                onClick={() => handleEditar(emp)}
                                title="Editar dirección"
                            >&#9998;</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {mostrarModal && empleadoEditando && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Empleado</h2>

                        <form onSubmit={handleGuardarCambios}>
                            <div className="form-columns">
                                <div className="columna">
                                    <label>
                                        Nro. de Documento:
                                        <input
                                            type="text"
                                            value={empleadoEditando.nroDocumento}
                                            onChange={(e) => actualizarCampo("nroDocumento", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Nombre:
                                        <input
                                            type="text"
                                            value={empleadoEditando.nombre}
                                            onChange={(e) => actualizarCampo("nombre", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Apellido:
                                        <input
                                            type="text"
                                            value={empleadoEditando.apellido}
                                            onChange={(e) => actualizarCampo("apellido", e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className="columna">
                                    <label>
                                        Fecha de Nacimiento:
                                        <input
                                            type="date"
                                            value={empleadoEditando.fecNacimiento}
                                            onChange={(e) => actualizarCampo("fecNacimiento", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Fecha de Ingreso:
                                        <input
                                            type="date"
                                            value={empleadoEditando.fecIngreso}
                                            onChange={(e) => actualizarCampo("fecIngreso", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Dirección:
                                        <input
                                            type="text"
                                            value={empleadoEditando.direccion}
                                            onChange={(e) => actualizarCampo("direccion", e.target.value)}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="botones-modal">
                                <button type="submit">Guardar</button>
                                <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Empleados;
