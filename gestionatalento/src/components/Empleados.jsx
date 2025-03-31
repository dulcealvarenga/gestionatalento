import React, { useState, useEffect } from "react";
import "./Empleados.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#E4E4E4",
        padding: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    section: {
        marginBottom: 10,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHeader: {
        fontWeight: "bold",
        borderBottom: "1px solid #000",
        padding: "5px",
    },
    tableCell: {
        borderBottom: "1px solid #ccc",
        padding: "5px",
    },
});

const Empleados = () => {

    const [listaEmpleados, setListaEmpleados] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const codPersona = localStorage.getItem("personaBuscada");

        if (codPersona) {
            axios.get(`http://localhost:8080/empleados/buscar/Empleado/${codPersona}`)
                .then(res => {
                    setListaEmpleados([res.data]); // Lo envolvés en array porque tu tabla espera una lista
                    localStorage.removeItem("personaBuscada"); // Limpieza
                });
        } else {
            // Trae toda la lista si no vino filtrado
            axios.get("http://localhost:8080/empleados/obtenerEmpleados")
                .then(res => setListaEmpleados(res.data));
        }
    }, []);

    // para que traiga solo comisionados y pasantes
    const [soloComisionados, setSoloComisionados] = useState(false);
    const [soloPasantes, setSoloPasantes] = useState(false);

    // para mostrar formulario de edicion
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalInforme, setMostrarModalInforme] = useState(false);
    const [empleadoEditando, setEmpleadoEditando] = useState(null);
    let empleadosFiltrados = listaEmpleados;

    if (soloComisionados) {
        empleadosFiltrados = empleadosFiltrados.filter(
            (e) => e.situacionLaboral?.descripcion?.toUpperCase() === "COMISIONADO"
        );
    }

    if (soloPasantes) {
        empleadosFiltrados = empleadosFiltrados.filter(
            (e) => {
                const cod = e.situacionLaboral?.codSituacionLaboral;
                return cod === 4 || cod === 5;
            }
        );
    }
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);

    const handleEditar = (empleado) => {
        setEmpleadoEditando(empleado);
        setMostrarModalEdicion(true);
        setMostrarModalInforme(false); // por si acaso
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();

        try {
            const personaActualizada = {
                codPersona: empleadoEditando.persona.codPersona,
                nroDocumento: empleadoEditando.persona.nroDocumento,
                nroRuc: empleadoEditando.persona.nroRuc || "",
                nombres: empleadoEditando.persona.nombres,
                apellidos: empleadoEditando.persona.apellidos,
                codNivelEstudio: empleadoEditando.persona.codNivelEstudio || "S",
                codPaisNacimiento: empleadoEditando.persona.codPaisNacimiento || 1,
                fecNacimiento: empleadoEditando.persona.fecNacimiento,
                lugarNacimiento: empleadoEditando.persona.lugarNacimiento || "Asunción",
                poseeDiscapacidad: empleadoEditando.persona.poseeDiscapacidad || "N",
                descripcionDiscapacidad: empleadoEditando.persona.descripcionDiscapacidad || "",
                rutaFoto: empleadoEditando.persona.rutaFoto || "",
                estadoCivil: {
                    codEstadoCivil: empleadoEditando.persona.estadoCivil?.codEstadoCivil || 1
                }
            };

            await axios.put("http://localhost:8080/api/v1/Persona/actualizar", personaActualizada);
            console.log("Persona actualizada correctamente");

            setMostrarModalEdicion(false);

            // Si querés refrescar la lista:
            const res = await axios.get("http://localhost:8080/empleados/obtenerEmpleados");
            setListaEmpleados(res.data);

        } catch (error) {
            console.error("Error al actualizar la persona:", error);
        }
    };


    /*const generarAltasBajasPDF = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Persona/altasBajasPDF", {
                params: { fechaInicio, fechaFin },
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Altas_Bajas.pdf");
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error al generar el informe de Altas y Bajas", error);
        }
        setMostrarModal(false);
    }; */

    const generarPDFAltasBajas = async () => {
        try {
            const response = await fetch("/datos.json");
            const data = await response.json();

            const datos = [
                ...(data.altas || []),
                ...(data.bajas || []),
                ...(data.modificaciones || [])
            ];

            return (
                <Document>
                    <Page style={styles.page}>
                        <Text style={styles.title}>Informe de Altas, Bajas y Modificaciones</Text>
                        <View style={styles.section}>
                            <Text>Fecha de Inicio: {fechaInicio}</Text>
                            <Text>Fecha de Fin: {fechaFin}</Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.tableHeader}>Nro. Documento | Nombre | Tipo | Fecha</Text>
                            {datos.map((item, index) => (
                                <Text key={index} style={styles.tableCell}>
                                    {item.nroDocumento} | {item.nombre} | {item.tipo} | {item.fecha}
                                </Text>
                            ))}
                        </View>
                    </Page>
                </Document>
            );
        } catch (error) {
            console.error("Error al generar PDF:", error);
            return (
                <Document>
                    <Page style={styles.page}>
                        <Text>Error al generar PDF</Text>
                    </Page>
                </Document>
            );
        }
    };

    const actualizarPersona = (campo, valor) => {
        setEmpleadoEditando((prev) => ({
            ...prev,
            persona: {
                ...prev.persona,
                [campo]: valor,
            },
        }));
    };

    return (
        <div className="empleados-container">
            <h1>Empleados</h1>
            <p className="acciones-title" style={{ fontSize: "22px"}}>Acciones</p>

            <div className="acciones-buttons">
                <button className="boton-accion" onClick={() => navigate("/abmEmpleados")}>AGREGAR EMPLEADO</button>
                <button className="boton-accion" onClick={() => navigate("/bajaEmpleados")}>BAJA DE EMPLEADOS</button>
                <div className="dropdown">
                    <button className="boton-accion"
                            onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}>INFORMES
                    </button>
                    {mostrarMenuInformes && (
                        <div className="dropdown-menu">
                            <button onClick={() => setMostrarModalInforme(true)}>Altas y Bajas</button>
                            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                        </div>
                    )}
                </div>
            </div>

            {mostrarModalInforme && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Generar Informe de Altas y Bajas</h2>
                        <label>Fecha Inicio:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                        <label>Fecha Fin:</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <PDFDownloadLink
                                document={generarPDFAltasBajas()} // Se pasa la función que genera el PDF
                                fileName="Altas_Bajas.pdf"

                            >
                                {({ loading }) =>
                                    loading ? (
                                        <button className="modal-buttons">Generando PDF...</button> // Estilo mientras carga
                                    ) : (
                                        <button className="modal-buttons">Generar PDF</button> // Estilo del botón cuando está listo
                                    )
                                }
                            </PDFDownloadLink>
                            <button onClick={() => setMostrarModalInforme(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="filtro-comisionado">
                <input
                    type="checkbox"
                    id="comisionado"
                    checked={soloComisionados}
                    onChange={() => setSoloComisionados(!soloComisionados)}
                />
                <label htmlFor="comisionado" style={{fontSize: "22px"}}>Mostrar solo Comisionados</label>
                <input
                    type="checkbox"
                    id="pasante"
                    checked={soloPasantes}
                    onChange={() => setSoloPasantes(!soloPasantes)}
                    style={{marginLeft: "30px"}}
                />
                <label htmlFor="pasante" style={{fontSize: "22px"}}>
                    Mostrar solo Pasantes
                </label>
            </div>

            <table className="tabla-empleados">
                <thead>
                <tr>
                    <th style={{fontSize: "20px"}}>Legajos</th>
                    <th style={{fontSize: "20px"}}>Foto</th>
                    <th style={{fontSize: "20px"}}>Nro. de Documento</th>
                    <th style={{ fontSize: "20px"}}>Nombre Completo</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Nacimiento</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Ingreso</th>
                    <th style={{ fontSize: "20px"}}>Fecha de Egreso</th>
                    <th style={{ fontSize: "20px"}}>Editar</th>
                </tr>
                </thead>
                <tbody>
                {empleadosFiltrados.map((emp) => (
                    <tr key={emp.id}>
                        <td>
                            <button className="ver-btn">ver</button>
                        </td>
                        <td>
                            <img src="/avatar.png" alt="Foto" className="foto-empleado" />
                        </td>
                        <td style={{ fontSize: "20px"}}>{emp.persona.nroDocumento}</td>
                        <td style={{ fontSize: "20px"}}>{emp.persona.nombres} {emp.persona.apellidos}</td>
                        <td style={{ fontSize: "20px"}}>{emp.persona.fecNacimiento}</td>
                        <td style={{ fontSize: "20px"}}>{emp.fecIngreso}</td>
                        <td style={{ fontSize: "20px"}}>{emp.fecEgreso}</td>
                        <td className="direccion-cell" style={{ fontSize: "20px"}}>
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
            {mostrarModalEdicion && empleadoEditando && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Datos</h2>

                        <form onSubmit={handleGuardarCambios}>
                            <div className="form-columns">
                                <div className="columna">
                                    <label>
                                        Nro. de Documento:
                                        <input
                                            type="text"
                                            value={empleadoEditando.persona.nroDocumento}
                                            onChange={(e) => actualizarPersona("nroDocumento", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Nombre:
                                        <input
                                            type="text"
                                            value={empleadoEditando.persona.nombres}
                                            onChange={(e) => actualizarPersona("nombres", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Apellido:
                                        <input
                                            type="text"
                                            value={empleadoEditando.persona.apellidos}
                                            onChange={(e) => actualizarPersona("apellidos", e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className="columna">
                                    <label>
                                        Fecha de Nacimiento:
                                        <input
                                            type="date"
                                            value={empleadoEditando.persona.fecNacimiento}
                                            onChange={(e) => actualizarPersona("fecNacimiento", e.target.value)}
                                        />
                                    </label>

                                    {/*<label>
                                        Fecha de Ingreso:
                                        <input
                                            type="date"
                                            value={empleadoEditando.fecIngreso}
                                            onChange={(e) => actualizarCampo("fecIngreso", e.target.value)}
                                        />
                                    </label>*/}

                                    {/*<label>
                                        Dirección:
                                        <input
                                            type="text"
                                            value={empleadoEditando.direccion}
                                            onChange={(e) => actualizarCampo("direccion", e.target.value)}
                                        />
                                    </label> */}
                                </div>
                            </div>

                            <div className="botones-modal">
                                <button type="submit">Guardar</button>
                                <button type="button" onClick={() => setMostrarModalEdicion(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Empleados;
