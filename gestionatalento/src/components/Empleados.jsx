import React, { useState, useEffect } from "react";
import "./Empleados.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import FichaEmpleadoPDF from './FichaEmpleado';
import { saveAs } from "file-saver";
import { API_BASE_URL } from '../config/constantes.js';


const styles = StyleSheet.create({
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 10,
    },

    tableRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
    },

    tableRowAlt: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
    },

    tableRowHeader: {
        flexDirection: "row",
        backgroundColor: "#2f2f45",
        color: "#fff",
    },

    tableCell: {
        flex: 1,
        padding: 4,
        fontSize: 10,
        borderRight: "1px solid #ccc",
    },

    tableCellHeader: {
        flex: 1,
        padding: 4,
        fontSize: 11,
        fontWeight: "bold",
        color: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: "#343a40",
    },

    periodo: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: "center",
        color: "#666",
    },
});

const Empleados = () => {

    const [listaEmpleados, setListaEmpleados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const codEmpleado = localStorage.getItem("empleadoBuscado");
        if (codEmpleado) {
            axios.get(`${API_BASE_URL}empleados/obtener/id/${codEmpleado}`)
                .then(res => {
                    const objeto = {
                        empleado: res.data.objeto
                      };
                    setListaEmpleados([objeto]); // Lo envolvés en array porque tu tabla espera una lista
                    localStorage.removeItem("empleadoBuscado"); // Limpieza
                });
        } else {
            // Trae toda la lista si no vino filtrado
            axios.get(`${API_BASE_URL}empleados/obtenerLista`)
                .then(response => {
                    const genericResponse = response.data;
                    if (genericResponse.codigoMensaje == "200") {
                        setListaEmpleados(response.data.objeto);
                    }
                });
                
        }
    }, []); // El array vacío asegura que solo se ejecute cuando el componente se monta

    // para que traiga solo comisionados y pasantes
    const [soloComisionados, setSoloComisionados] = useState(false);
    const [soloPasantes, setSoloPasantes] = useState(false);

    // para mostrar formulario de edicion
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalInforme, setMostrarModalInforme] = useState(false);
    const [empleadoEditando, setEmpleadoEditando] = useState(null);
    const [periodo, setPeriodo] = useState("");
    const [modalInformeTipo, setModalInformeTipo] = useState(null); // "altas", "bajas", "modificaciones"
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
    const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);

    const handleEditar = (empleado) => {
        setEmpleadoEditando({
            ...empleado,
            persona: {
                ...empleado.persona,
                poseeDiscapacidad: empleado.persona.poseeDiscapacidad === "S"
            }
        });
        setMostrarModalEdicion(true);
        setMostrarModalInforme(false); // por si acaso
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        try {

            const personaActualizada = {
                codEmpleado: empleadoEditando.codEmpleado,
                codPersona: empleadoEditando.persona.codPersona,
                nroDocumento: empleadoEditando.persona.nroDocumento,
                nroRuc: empleadoEditando.persona.nroRuc,
                nombres: empleadoEditando.persona.nombres,
                apellidos: empleadoEditando.persona.apellidos,
                codNivelEstudio: empleadoEditando.persona.codNivelEstudio,
                codPaisNacimiento: empleadoEditando.persona.codPaisNacimiento,
                fecNacimiento: empleadoEditando.persona.fecNacimiento,
                lugarNacimiento: empleadoEditando.persona.lugarNacimiento,
                poseeDiscapacidad: empleadoEditando.persona.poseeDiscapacidad ? "S" : "N",
                descripcionDiscapacidad: empleadoEditando.persona.descripcionDiscapacidad,
                rutaFoto: empleadoEditando.persona.rutaFoto,
                estadoCivil : {
                    codEstadoCivil: empleadoEditando.persona.estadoCivil?.codEstadoCivil
                },
            };

            console.log("persona: ", personaActualizada);

            const response = await axios.put(`${API_BASE_URL}personas/actualizar`, personaActualizada);

            if (response.data.codigoMensaje !== "200") {
                toast.error(response.data.mensaje, {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            const empleadoActualizado = {
                codEmpleado: empleadoEditando.codEmpleado,
                persona: {
                    codPersona: empleadoEditando.persona.codPersona
                },
                estado: "A", // podrías sacar esto de tu estado si querés que sea dinámico
                fecActoAdministrativo: empleadoEditando.fecActoAdministrativo,
                fecIngreso: empleadoEditando.fecIngreso,
                fecEgreso: empleadoEditando.fecEgreso,
                observacion: empleadoEditando.observacion,
                asignacion: empleadoEditando.asignacion,
                nroResolucion: empleadoEditando.nroResolucion,
                horaEntrada: empleadoEditando.horaEntrada,
                horaSalida: empleadoEditando.horaSalida,
                cargo: {
                    codCargo: empleadoEditando.cargo?.codCargo
                },
                sede: {
                    codSede: empleadoEditando.sede?.codSede,
                    descripcion: empleadoEditando.sede.descripcion,
                },
                situacionLaboral: {
                    codSituacionLaboral: empleadoEditando.situacionLaboral?.codSituacionLaboral
                }
            };

            console.log("empleado: ", empleadoActualizado);

            const resEmpleado = await axios.put(`${API_BASE_URL}empleados/actualizar`, empleadoActualizado);

            if (resEmpleado.data.codigoMensaje !== "200") {
                throw new Error(resEmpleado.data.mensaje);
            }

            toast.success("Datos actualizados correctamente", {
                position: "top-right",
                autoClose: 3000,
            });

            setMostrarModalEdicion(false);

            // Si querés refrescar la lista:
            const res = await axios.get(`${API_BASE_URL}empleados/obtenerLista`);
            setListaEmpleados(res.data.objeto);

        } catch (error) {
            console.error("Error al actualizar la persona:", error);
        }
    };

    const abrirPDFEnPestana = async () => {
        const documento = await generarPDFIndividual(modalInformeTipo, periodo);
        const blob = await pdf(documento).toBlob();

        const url = URL.createObjectURL(blob);
        window.open(url, "_blank"); // abre en nueva pestaña
    };

    const generarPDFIndividual = async (tipo, periodo) => {
        const endpoint = {
            altas: `${API_BASE_URL}empleados/altas?periodo=${periodo}`,
            bajas: `${API_BASE_URL}empleados/bajas?periodo=${periodo}`,
            modificaciones: `${API_BASE_URL}empleados/modificacionSalario?periodo=${periodo}`,
        };

        try {
            const response = await axios.get(endpoint[tipo]);
            const datos = response.data.objeto;

            if (!Array.isArray(datos) || datos.length === 0) {
                return (
                    <Document>
                        <Page style={styles.page}>
                            <Text style={styles.title}>
                                Informe de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </Text>
                            <Text style={styles.periodo}>Período: {periodo}</Text>
                            <Text>No se encontraron registros para este período.</Text>
                        </Page>
                    </Document>
                );
            }

            return (
                <Document>
                    <Page style={styles.page}>
                        <Text style={styles.title}>
                            Informe de {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </Text>
                        <Text style={styles.periodo}>Período: {periodo}</Text>

                        <View style={styles.table}>
                            {tipo === "modificaciones" ? (
                                <>
                                    {/* Encabezado de modificaciones */}
                                    <View style={styles.tableRowHeader}>
                                        <Text style={styles.tableCell}>C.I.</Text>
                                        <Text style={styles.tableCell}>Apellidos</Text>
                                        <Text style={styles.tableCell}>Nombres</Text>
                                        <Text style={styles.tableCell}>Sal. Anterior</Text>
                                        <Text style={styles.tableCell}>Sal. Actual</Text>
                                        <Text style={styles.tableCell}>Fecha Modificación</Text>
                                    </View>

                                    {datos.map((item, i) => (
                                        <View
                                            key={i}
                                            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                                        >
                                            <Text style={styles.tableCell}>{item["C.I.N°"]}</Text>
                                            <Text style={styles.tableCell}>{item.APELLIDOS}</Text>
                                            <Text style={styles.tableCell}>{item.NOMBRES}</Text>
                                            <Text style={styles.tableCell}>
                                                {item["SAL. ANTERIOR"] !== undefined
                                                    ? item["SAL. ANTERIOR"].toLocaleString("es-PY")
                                                    : "-"}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item["SAL. ACTUAL"] !== undefined
                                                    ? item["SAL. ACTUAL"].toLocaleString("es-PY")
                                                    : "-"}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item["FECHA_MODIFICACION"] ?? "-"}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {/* Encabezado de altas o bajas */}
                                    <View style={styles.tableRowHeader}>
                                        <Text style={styles.tableCellHeader}>C.I.</Text>
                                        <Text style={styles.tableCellHeader}>Apellidos</Text>
                                        <Text style={styles.tableCellHeader}>Nombres</Text>
                                        <Text style={styles.tableCellHeader}>Dependencia</Text>
                                        <Text style={styles.tableCellHeader}>Cargo</Text>
                                        <Text style={styles.tableCellHeader}>Salario</Text>
                                        <Text style={styles.tableCellHeader}>
                                            {tipo === "bajas" ? "Fecha Baja" : "Fecha Alta"}
                                        </Text>
                                    </View>

                                    {datos.map((item, i) => (
                                        <View
                                            key={i}
                                            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                                        >
                                            <Text style={styles.tableCell}>{item.ci_nro}</Text>
                                            <Text style={styles.tableCell}>{item.apellidos}</Text>
                                            <Text style={styles.tableCell}>{item.nombres}</Text>
                                            <Text style={styles.tableCell}>{item.dependencia}</Text>
                                            <Text style={styles.tableCell}>{item.cargo}</Text>
                                            <Text style={styles.tableCell}>
                                                {item.salario !== undefined ? item.salario : "-"}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {tipo === "bajas"
                                                    ? item.fecha_baja ?? "-"
                                                    : item.fecha_alta ?? "-"}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>
                    </Page>
                </Document>
            );
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            return (
                <Document>
                    <Page style={styles.page}>
                        <Text>Error al generar el informe de {tipo}</Text>
                    </Page>
                </Document>
            );
        }
    };

    const actualizarPersona = (campo, valor) => {
        if (campo === "codEstadoCivil") {
            setEmpleadoEditando((prev) => ({
                ...prev,
                persona: {
                    ...prev.persona,
                    estadoCivil: {
                        codEstadoCivil: valor,
                        descripcion:
                            valor === 1
                                ? "SOLTERO/A"
                                : valor === 2
                                    ? "CASADO/A"
                                    : "VIUDO/A",
                        estado: "A",
                    },
                },
            }));
        } else if (campo === "poseeDiscapacidad" && !valor) {
            // Se desmarcó el checkbox: limpiar también la descripción
            setEmpleadoEditando((prev) => ({
                ...prev,
                persona: {
                    ...prev.persona,
                    poseeDiscapacidad: false,
                    descripcionDiscapacidad: ""
                }
            }));
        } else {
            setEmpleadoEditando((prev) => ({
                ...prev,
                persona: {
                    ...prev.persona,
                    [campo]: valor,
                },
            }));
        }
    };

    const actualizarEmpleado = (campo, valor) => {
        setEmpleadoEditando((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };


    const handleVerEmpleado = async (empleado) => {
        const blob = await pdf(<FichaEmpleadoPDF empleado={empleado} />).toBlob();

        // Generar nombre personalizado
        const nombre = `${empleado.persona.apellidos}_${empleado.persona.nombres}_CI${empleado.persona.nroDocumento}.pdf`
            .replace(/\s+/g, "_"); // Reemplaza espacios por guiones bajos

        saveAs(blob, nombre);
    };

    const [seccionActiva, setSeccionActiva] = useState("persona");


    return (
        <div className="empleados-container">
            <h1>Empleados</h1>
            <p className="acciones-title" style={{ fontSize: "22px"}}>Acciones</p>

            <div className="acciones-buttons-emp" >
                <button className="boton-accion-emp" onClick={() => navigate("/abmEmpleados")}>AGREGAR EMPLEADO</button>
                <button className="boton-accion-emp" onClick={() => navigate("/bajaEmpleados")}>BAJA DE EMPLEADOS</button>
                <div className="dropdown-emp">
                    <button
                        className="boton-accion-emp"
                        onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}
                    >
                        INFORMES
                    </button>
                    {mostrarMenuInformes && (
                        <div className="dropdown-menu-emp">
                            <button onClick={() => setModalInformeTipo("altas")}>
                                Altas
                            </button>
                            <button onClick={() => setModalInformeTipo("bajas")}>
                                Bajas
                            </button>
                            <button onClick={() => setModalInformeTipo("modificaciones")}>
                                Modificaciones
                            </button>
                            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                        </div>
                    )}
                </div>
            </div>

            {modalInformeTipo && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>
                            Generar Informe de{" "}
                            {modalInformeTipo.charAt(0).toUpperCase() +
                                modalInformeTipo.slice(1)}
                        </h2>
                        <label>Período (MMYYYY):</label>
                        <input
                            type="text"
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            placeholder="Ej: 042025"
                        />
                        <div className="modal-buttons">
                            <button className="modal-buttons" onClick={abrirPDFEnPestana}>
                                Generar PDF
                            </button>

                            <button onClick={() => setModalInformeTipo(null)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="filtro-comisionado-emp">
                <div className="filtro-item">
                    <input
                        type="checkbox"
                        id="comisionado"
                        checked={soloComisionados}
                        onChange={() => setSoloComisionados(!soloComisionados)}
                    />
                    <label htmlFor="comisionado" style={{fontSize: "22px"}}>Mostrar solo Comisionados</label>
                </div>
                <div className="filtro-item">
                    <input
                        type="checkbox"
                        id="pasante"
                        checked={soloPasantes}
                        onChange={() => setSoloPasantes(!soloPasantes)}
                    />
                    <label htmlFor="pasante" style={{fontSize: "22px"}}>
                        Mostrar solo Pasantes
                    </label>
                </div>
            </div>

                    <table className="tabla-empleados">
                        <thead>
                        <tr>
                            <th>Legajos</th>
                            <th>Foto</th>
                            <th>Nro. de Documento</th>
                            <th>Nombre Completo</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Fecha de Ingreso</th>
                            <th>Fecha de Egreso</th>
                            <th>Editar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {empleadosFiltrados.map((emp) => (
                            <tr key={emp.codEmpleado}>
                                <td>
                                    <button className="ver-btn" onClick={() => handleVerEmpleado(emp)}>ver</button>
                                </td>
                                <td>
                                    <img src="/avatar.png" alt="Foto" className="foto-empleado"/>
                                </td>
                                <td style={{fontSize: "20px"}}>{emp.persona.nroDocumento}</td>
                                <td style={{fontSize: "20px"}}>{emp.persona.nombres} {emp.persona.apellidos}</td>
                                <td style={{fontSize: "20px"}}>{emp.persona.fecNacimiento}</td>
                                <td style={{fontSize: "20px"}}>{emp.fecIngreso}</td>
                                <td style={{fontSize: "20px"}}>{emp.fecEgreso}</td>
                                <td className="direccion-cell" style={{fontSize: "20px"}}>
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
                    <div className="modal-content-edit">
                        <h2>Editar Datos</h2>
                        <div className="modal-tabs">
                            <button
                                className={seccionActiva === "persona" ? "tab-activa" : ""}
                                onClick={() => setSeccionActiva("persona")}
                            >
                                Datos de Persona
                            </button>
                            <button
                                className={seccionActiva === "empleado" ? "tab-activa" : ""}
                                onClick={() => setSeccionActiva("empleado")}
                            >
                                Datos de Empleado
                            </button>
                        </div>
                        <form onSubmit={handleGuardarCambios}>
                            {seccionActiva === "persona" && (
                                <div className="form-columns-emp">
                                    <div className="form-grid-con-foto">
                                        {/* Columna 1: Foto */}
                                        <div className="foto-columna">
                                            {empleadoEditando.persona.rutaFoto ? (
                                                <img
                                                    src={`${API_BASE_URL}fotos/${empleadoEditando.persona.rutaFoto}`}
                                                    alt="Foto del empleado"
                                                    className="foto-preview"
                                                />
                                            ) : (
                                                <img
                                                    src="/avatar.png"
                                                    alt="Foto por defecto"
                                                    className="foto-preview"
                                                />
                                            )}
                                            <label className="btn-cambiar-foto">
                                                Cambiar
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEmpleadoEditando((prev) => ({
                                                                ...prev,
                                                                persona: {
                                                                    ...prev.persona,
                                                                    nuevaFoto: file,
                                                                    rutaFotoPreview: reader.result,
                                                                },
                                                            }));
                                                        };
                                                        if (file) reader.readAsDataURL(file);
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        {/* Columnas 2 y 3: Campos */}
                                        <div className="datos-grid">
                                            <div className="campo">
                                                <label>Nro Documento:</label>
                                                <input type="text" value={empleadoEditando.persona.nroDocumento}
                                                       onChange={(e) => actualizarPersona("nroDocumento", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Nombre:</label>
                                                <input type="text" value={empleadoEditando.persona.nombres}
                                                       onChange={(e) => actualizarPersona("nombres", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Apellido:</label>
                                                <input type="text" value={empleadoEditando.persona.apellidos}
                                                       onChange={(e) => actualizarPersona("apellidos", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Fecha de Nacimiento:</label>
                                                <input type="date" value={empleadoEditando.persona.fecNacimiento}
                                                       onChange={(e) => actualizarPersona("fecNacimiento", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Lugar de Nacimiento:</label>
                                                <input type="text" value={empleadoEditando.persona.lugarNacimiento}
                                                       onChange={(e) => actualizarPersona("lugarNacimiento", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Pais de Nacimiento:</label>
                                                <input type="text" value={empleadoEditando.persona.pais.descripcion}
                                                       onChange={(e) => actualizarPersona("lugarNacimiento", e.target.value)}/>
                                            </div>
                                            <div className="campo">
                                                <label>Estado Civil:</label>
                                                <select
                                                    value={empleadoEditando.persona.estadoCivil?.codEstadoCivil || ""}
                                                    onChange={(e) => actualizarPersona("codEstadoCivil", parseInt(e.target.value))}>
                                                    <option value="1">Soltero/a</option>
                                                    <option value="2">Casado/a</option>
                                                    <option value="3">Viudo/a</option>
                                                </select>
                                            </div>
                                            <div className="campo">
                                                <label>
                                                    Último Título Obtenido:
                                                </label>
                                                <select name="codNivelEstudio"
                                                        value={empleadoEditando.persona.codNivelEstudio}
                                                        onChange={(e) => actualizarPersona("codNivelEstudio", e.target.value)}>
                                                    <option value="P">Primario</option>
                                                    <option value="S">Secundario</option>
                                                    <option value="T">Terciario</option>
                                                </select>
                                            </div>
                                            <div className="campo campo-discapacidad">
                                                <label>Discapacidad:</label>
                                                <div className="input-checkbox-contenedor">
                                                    <input
                                                        type="checkbox"
                                                        id="chkDiscapacidad"
                                                        checked={empleadoEditando.persona.poseeDiscapacidad}
                                                        onChange={(e) => actualizarPersona("poseeDiscapacidad", e.target.checked)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Descripción"
                                                        value={empleadoEditando.persona.descripcionDiscapacidad}
                                                        onChange={(e) => actualizarPersona("descripcionDiscapacidad", e.target.value)}
                                                        disabled={!empleadoEditando.persona.poseeDiscapacidad}
                                                        required={empleadoEditando.persona.poseeDiscapacidad}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    )}

                                    {seccionActiva === "empleado" && (
                                        <div className="form-columns-emp">
                                            <div className="fila-triple">
                                                <div className="campo">
                                                    <label>
                                                        Nro. de Documento:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={empleadoEditando.persona.nroDocumento}
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Nombre:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={`${empleadoEditando.persona.nombres || ""} ${empleadoEditando.persona.apellidos || ""}`}
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Situacion Laboral:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={empleadoEditando.situacionLaboral.descripcion}
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>

                                            <div className="fila-triple">
                                                <div className="campo">
                                                    <label>
                                                        Fecha de Ingreso:
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={empleadoEditando.fecIngreso}
                                                        onChange={(e) => actualizarEmpleado("fecIngreso", e.target.value)}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Fecha de Acto Administrativo:
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={empleadoEditando.fecActoAdministrativo}
                                                        onChange={(e) => actualizarEmpleado("fecActoAdministrativo", e.target.value)}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Nro. de Resolucion:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={empleadoEditando.nroResolucion}
                                                        onChange={(e) => actualizarEmpleado("nroResolucion", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="fila-triple">
                                                <div className="campo">
                                                    <label>
                                                        Cargo:
                                                    </label>
                                                    <select name="codCargo" value={empleadoEditando.cargo.descripcion}
                                                            onChange={(e) => actualizarEmpleado("cargo", e.target.value)}
                                                            required>
                                                        <option value="">{empleadoEditando.cargo.descripcion}</option>
                                                        <option value="1">AUXILIAR</option>
                                                        <option value="2">AUXILIAR</option>
                                                    </select>
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Salario:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={empleadoEditando.asignacion}
                                                        onChange={(e) => actualizarEmpleado("asignacion", e.target.value)}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Observación:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={empleadoEditando.observacion}
                                                        onChange={(e) => actualizarEmpleado("observacion", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="fila-triple">
                                                <div className="campo">
                                                    <label>
                                                        Sede:
                                                    </label>
                                                    <select name="codSede"
                                                            value={empleadoEditando.persona.fecNacimiento}
                                                            onChange={(e) => actualizarEmpleado("sede", e.target.value)}>
                                                        <option value="">{empleadoEditando.sede.descripcion}</option>
                                                        <option value="1">Sede Central</option>
                                                        <option value="2">Sede Antigua</option>
                                                        <option value="3">Biblioteca Municipal</option>
                                                        <option value="4">Juzgado de Faltas</option>
                                                    </select>
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Hora de Entrada:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={empleadoEditando.horaEntrada}
                                                        onChange={(e) => actualizarEmpleado("horaEntrada", e.target.value)}
                                                    />
                                                </div>
                                                <div className="campo">
                                                    <label>
                                                        Hora de Salida:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={empleadoEditando.horaSalida}
                                                        onChange={(e) => actualizarEmpleado("horaSalida", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="botones-modal">
                                        <button type="submit">Guardar</button>
                                        <button type="button" onClick={() => setMostrarModalEdicion(false)}>Cancelar
                                        </button>
                                    </div>
                                </form>
                                </div>
                                </div>
                                )}
                            <ToastContainer/>
                    </div>
                    );
                    };

                    export default Empleados;
