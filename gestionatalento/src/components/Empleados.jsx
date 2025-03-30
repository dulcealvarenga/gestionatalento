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
        const docBuscado = localStorage.getItem("personaBuscada");
        console.log(docBuscado);

        if (docBuscado) {
            axios.get("http://localhost:8080/api/v1/Persona/consultaPersona")
                .then(res => {
                    const personas = res.data;
                    const filtradas = personas.filter(p => Number(p.nroDocumento) === Number(docBuscado));
                    console.log(docBuscado, typeof docBuscado);
                    console.log(personas.nroDocumento, typeof personas.nroDocumento);
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
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);

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



    return (
        <div className="empleados-container">
            <h1>Empleados</h1>
            <p className="acciones-title" style={{ fontSize: "22px"}}>Acciones</p>

            <div className="acciones-buttons">
                <button className="boton-accion" onClick={() => navigate("/abmEmpleados")}>AGREGAR EMPLEADO</button>
                <button className="boton-accion">PASANTES</button>
                <button className="boton-accion">BAJA DE EMPLEADOS</button>
                <div className="dropdown">
                    <button className="boton-accion"
                            onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}>INFORMES
                    </button>
                    {mostrarMenuInformes && (
                        <div className="dropdown-menu">
                            <button onClick={() => setMostrarModal(true)}>Altas y Bajas</button>
                            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                        </div>
                    )}
                </div>
            </div>

            {mostrarModal && (
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
                            <button onClick={() => setMostrarModal(false)}>Cancelar</button>
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
                            <img src="/avatar.png" alt="Foto" className="foto-empleado" />
                        </td>
                        <td style={{ fontSize: "20px"}}>{emp.nroDocumento}</td>
                        <td style={{ fontSize: "20px"}}>{emp.nombre} {emp.apellido}</td>
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
