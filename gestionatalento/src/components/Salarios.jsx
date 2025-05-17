// src/components/Salaries.jsx
import React, {useState} from 'react';
import './Salarios.css';
import { FaEdit } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import axios from "axios";

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

const Salarios = () => {

    const navigate = useNavigate();

    // para mostrar formulario de edicion
    const [periodo, setPeriodo] = useState("");
    const [modalInformeTipo, setModalInformeTipo] = useState(null); // "altas", "bajas", "modificaciones"

    const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);
    const [showConfirmModalSA, setShowConfirmModalSA] = useState(false);
    const [comentario, setComentario] = useState("");

    const abrirPDFEnPestana = async () => {
        const documento = await generarPDFIndividual(modalInformeTipo, periodo);
        const blob = await pdf(documento).toBlob();

        const url = URL.createObjectURL(blob);
        window.open(url, "_blank"); // abre en nueva pestaña
    };

    const generarPDFIndividual = async (tipo, periodo) => {
        const endpoint = {
            altas: `http://localhost:8080/empleados/altas?periodo=${periodo}`,
            bajas: `http://localhost:8080/empleados/bajas?periodo=${periodo}`,
            modificaciones: `http://localhost:8080/empleados/modificaionSalario?periodo=${periodo}`,
        };

        try {
            const response = await axios.get(endpoint[tipo]);
            const datos = response.data.objeto;

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
                                        <Text style={styles.tableCellHeader}>C.I.</Text>
                                        <Text style={styles.tableCellHeader}>Apellidos</Text>
                                        <Text style={styles.tableCellHeader}>Nombres</Text>
                                        <Text style={styles.tableCellHeader}>Salario Anterior</Text>
                                        <Text style={styles.tableCellHeader}>Salario Actual</Text>
                                        <Text style={styles.tableCellHeader}>Fecha Update</Text>
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
                                        <Text style={styles.tableCellHeader}>Fecha Alta</Text>
                                    </View>

                                    {datos.map((item, i) => (
                                        <View
                                            key={i}
                                            style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                                        >
                                            <Text style={styles.tableCell}>{item["C.I.N°"]}</Text>
                                            <Text style={styles.tableCell}>{item.APELLIDOS}</Text>
                                            <Text style={styles.tableCell}>{item.NOMBRES}</Text>
                                            <Text style={styles.tableCell}>{item.DEPENDENCIA}</Text>
                                            <Text style={styles.tableCell}>{item.CARGO}</Text>
                                            <Text style={styles.tableCell}>
                                                {item.SALARIO !== undefined ? item.SALARIO : "-"}
                                            </Text>
                                            <Text style={styles.tableCell}>
                                                {item.FECHA_ALTA !== undefined ? item.FECHA_ALTA : "-"}
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

    return (
        <div className="salaries-container">
            <h1>Salarios</h1>

            <div className="actions-section">
                <button className="primary-btn" onClick={() => navigate("/salarios/abm")}>AGREGAR SALARIOS</button>
                <button className="primary-btn" onClick={() => navigate("/salarios/aguinaldo")}>INCLUIR AGUINALDO
                </button>
                <select>
                    <option>Enero</option>
                    <option>Febrero</option>
                    <option>Marzo</option>
                    {/* otros meses */}
                </select>
                <button className="primary-btn">Buscar</button>
                <div className="dropdown-wrapper">
                    <button
                        className="primary-btn"
                        onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}
                    >
                        INFORMES
                    </button>
                    {mostrarMenuInformes && (
                        <div className="dropdown-content">
                            <button onClick={() => setModalInformeTipo("altas")}>Altas</button>
                            <button onClick={() => setModalInformeTipo("bajas")}>Bajas</button>
                            <button onClick={() => setModalInformeTipo("modificaciones")}>Modificaciones</button>
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

            <div className="export-section">
                <h3>Exportar planilla de salarios</h3>
                <div className="export-group">
                    <select>
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                    </select>
                    <button className="primary-btn">Generar</button>
                    <button className="primary-btn">Exportar Aguinaldo</button>
                    <button className="primary-btn" onClick={() => setShowConfirmModalSA(true)}>Cierre</button>
                </div>
            </div>

            {showConfirmModalSA && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmar Cierre de Periodo</h2>
                        <label>Periodo a Cerrar</label>
                        <input type="text" name="periodo" value='05/2025' readOnly={true}/>
                        <label>Comentario</label>
                        <input
                            type="text"
                            name="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setShowConfirmModalSA(false)}>Confirmar</button>
                            <button onClick={() => setShowConfirmModalSA(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="salaries-table">
                <thead>
                <tr>
                <th>C.I Nro.</th>
                    <th>Nombre Completo</th>
                    <th>Cargo</th>
                    <th>Grado Salarial</th>
                    <th>Asig. Salarial</th>
                    <th>Obj. de Gasto</th>
                    <th>Programa</th>
                    <th>Situación Laboral</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {[1, 2].map((row, index) => (
                    <tr key={index}>
                        <td>1.234.567</td>
                        <td>Juan Perez</td>
                        <td>Asesor de Obras</td>
                        <td>2,000,000</td>
                        <td>2,000,000</td>
                        <td>Honorarios Profesionales</td>
                        <td>Ejecutivo Principal</td>
                        <td>Contratado</td>
                        <td><FaEdit className="edit-icon" /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Salarios;
