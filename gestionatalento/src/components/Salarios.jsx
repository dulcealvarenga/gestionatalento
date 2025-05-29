// src/components/Salaries.jsx
import React, { useState, useEffect } from "react";
import "./Salarios.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import axios from "axios";
import { API_BASE_URL } from "../config/constantes.js";

const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#2f2f45",
    color: "#fff",
  },
  tableCell: {
    flex: 1,
    padding: 2, // reducido
    fontSize: 8, // más pequeño
    borderRight: "1px solid #ccc",
  },
  tableCellHeader: {
    flex: 1,
    padding: 2, // reducido
    fontSize: 9, // más pequeño
    fontWeight: "bold",
  },
  title: {
    fontSize: 14, // reducido
    fontWeight: "bold",
    marginBottom: 2, // reducido
    textAlign: "center",
  },
  periodo: {
    fontSize: 8, // reducido
    marginBottom: 3,
    textAlign: "center",
    color: "#666",
  },
});

const Salarios = () => {
  const navigate = useNavigate();

  // para mostrar formulario de edicion
  const [periodo, setPeriodo] = useState("");
  const [periodoBuscar, setPeriodoBuscar] = useState("");
  const [modalInformeTipo, setModalInformeTipo] = useState(null); // "altas", "bajas", "modificaciones"

  const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);
  const [showConfirmModalSA, setShowConfirmModalSA] = useState(false);
  const [comentario, setComentario] = useState("");
  const [salarios, setSalarios] = useState([]);

  const abrirPDFEnPestana = async () => {
    const documento = await generarPDFIndividual(modalInformeTipo, periodo);
    const blob = await pdf(documento).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // abre en nueva pestaña
  };

  const [mes, setMes] = useState("MAYO");

  const generarPDFIndividual = async (tipo, periodo) => {
    const endpoint = {
      altas: `${API_BASE_URL}empleados/altas?periodo=${periodo}`,
      bajas: `${API_BASE_URL}empleados/bajas?periodo=${periodo}`,
      modificaciones: `${API_BASE_URL}empleados/modificaionSalario?periodo=${periodo}`,
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

  useEffect(() => {
    const obtenerSalarios = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}salarios/obtenerLista`);
        const lista = res.data.objeto || [];
        setTodosLosSalarios(lista); // copia completa
        setSalarios(lista); // visible en la tabla
      } catch (err) {
        console.error("Error al obtener salarios:", err);
        setTodosLosSalarios([]);
        setSalarios([]);
      }
    };

    obtenerSalarios();
  }, []);

  const [todosLosSalarios, setTodosLosSalarios] = useState([]);

  const filtrarPorPeriodo = () => {
    const filtrado = todosLosSalarios.filter(
      (s) => s.periodo.codPeriodo === periodoBuscar
    );
    setSalarios(filtrado);
  };

  const handleClickGenerar = async () => {
    const getNombreMes = (periodo) => {
      const anio = periodo.substring(0, 4);
      const mes = periodo.substring(5, 7);
      const nombresMeses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const nombreMes = nombresMeses[parseInt(mes, 10) - 1] || "Mes inválido";
      return `${nombreMes} ${anio}`;
    };

    try {
      const response = await axios.get(`${API_BASE_URL}salarios/obtenerLista`);
      const registros = response.data.objeto || [];

      // Filtro por periodo ingresado
      const periodoFormateado = periodo.trim();
      const mesFormateado = getNombreMes(periodoFormateado);
      const filtrados = periodoFormateado
        ? registros.filter((r) => r.periodo.codPeriodo === periodoFormateado)
        : registros;

      if (filtrados.length === 0) {
        alert("No hay datos para el período ingresado.");
        return;
      }

      // Agrupar por claves de cabecera
      const agrupado = {};
      filtrados.forEach((r) => {
        const clave = JSON.stringify({
          presupuesto: r.presupuesto?.descripcion,
          programa: r.programa?.descripcion,
          subprograma: r.subprograma?.descripcion,
          objetoGasto: r.objetoGasto?.descripcion,
          fuenteFinanciamiento: r.fuenteFinanciamiento?.descripcion,
        });

        if (!agrupado[clave]) {
          agrupado[clave] = {
            cabecera: {
              presupuesto: r.presupuesto,
              programa: r.programa,
              subprograma: r.subprograma,
              objetoGasto: r.objetoGasto,
              fuenteFinanciamiento: r.fuenteFinanciamiento,
            },
            detalle: [],
          };
        }

        agrupado[clave].detalle.push({
          ci: r.empleado?.persona?.nroDocumento || "-",
          nombre: `${r.empleado?.persona?.nombres || ""} ${
            r.empleado?.persona?.apellidos || ""
          }`,
          cargo: r.empleado?.cargo?.descripcion || "-",
          grado: r.gradoSalarial?.descripcion || "-",
          asignacion: r.asignacion || 0,
        });
      });

      const listaAgrupada = Object.values(agrupado);

      const doc = (
        <Document>
          {listaAgrupada.map((item, index) => {
            const total = item.detalle.reduce(
              (sum, d) => sum + Number(d.asignacion || 0),
              0
            );
            const totalFormateado = total.toLocaleString("es-PY");

            return (
              <Page
                key={index}
                size="A4"
                style={{
                  padding: 30,
                  fontSize: 10,
                  fontFamily: "Helvetica",
                }}
              >
                <View style={{ textAlign: "center", marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: "#003366",
                    }}
                  >
                    MUNICIPALIDAD DE LUQUE
                  </Text>
                  <Text style={{ fontSize: 12, marginTop: 2 }}>
                    PLANILLA DE SUELDO - Junta Municipal
                  </Text>
                </View>

                {/* Cabecera */}
                <View style={{ marginBottom: 10 }}>
                  {[
                    ["Periodo", mesFormateado || "-"],
                    [
                      "Tipo de Presupuesto",
                      item.cabecera?.presupuesto?.descripcion || "-",
                    ],
                    ["Programa", item.cabecera?.programa?.descripcion || "-"],
                    [
                      "Subprograma",
                      item.cabecera?.subprograma?.descripcion || "-",
                    ],
                    [
                      "Objeto de Gasto",
                      item.cabecera?.objetoGasto?.descripcion || "-",
                    ],
                    [
                      "Fuente de Financiamiento",
                      item.cabecera?.fuenteFinanciamiento?.descripcion || "-",
                    ],
                  ].map(([label, value], i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: "#000",
                        fontSize: 10,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: "bold",
                          backgroundColor: "#f0f4f8",
                          padding: 4,
                        }}
                      >
                        {label}
                      </Text>
                      <Text style={{ flex: 2, padding: 4 }}>{value}</Text>
                    </View>
                  ))}
                </View>

                {/* Tabla */}
                <View style={{ borderWidth: 1, borderColor: "#000" }}>
                  {/* Encabezado */}
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#003366",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <Text style={{ flex: 0.5, padding: 4 }}>N°</Text>
                    <Text style={{ flex: 1, padding: 4 }}>C.I</Text>
                    <Text style={{ flex: 1.5, padding: 4 }}>Nombre</Text>
                    <Text style={{ flex: 2, padding: 4 }}>Cargo</Text>
                    <Text style={{ flex: 1.5, padding: 4 }}>Grado</Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 4,
                        textAlign: "right",
                      }}
                    >
                      Asignación
                    </Text>
                  </View>

                  {/* Detalle */}
                  {item.detalle.map((d, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        fontSize: 9,
                        borderBottomWidth: 0.5,
                        borderColor: "#ccc",
                      }}
                    >
                      <Text style={{ flex: 0.6, padding: 4 }}>{i + 1}</Text>
                      <Text style={{ flex: 1.2, padding: 4 }}>{d.ci}</Text>
                      <Text style={{ flex: 1.8, padding: 4 }}>{d.nombre}</Text>
                      <Text
                        style={{
                          flex: 2.5,
                          padding: 4,
                          fontSize: 8.5,
                        }}
                      >
                        {d.cargo}
                      </Text>
                      <Text style={{ flex: 2, padding: 4 }}>{d.grado}</Text>
                      <Text
                        style={{
                          flex: 1,
                          padding: 4,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(d.asignacion).toLocaleString("es-PY")}
                      </Text>
                    </View>
                  ))}

                  {/* Total */}
                  <View
                    style={{
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    <Text style={{ flex: 6, padding: 4 }}>TOTAL</Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 4,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {totalFormateado}
                    </Text>
                  </View>
                </View>

                {/* Pie */}
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 8,
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Documento generado automáticamente por el sistema de gestión
                  de personas.
                </Text>
              </Page>
            );
          })}
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("No se pudo generar el informe.");
    }
  };

  return (
    <div className="salaries-container">
      <h1>Salarios</h1>
      <p className="acciones-title-salario">Acciones</p>
      <div className="actions-section">
        <button
          className="primary-btn"
          onClick={() => navigate("/salarios/abm")}
        >
          AGREGAR SALARIOS
        </button>
        {/* Este es un comentario dentro de JSX
                <button className="primary-btn" onClick={() => navigate("/salarios/aguinaldo")}>INCLUIR AGUINALDO
                </button>*/}
        <input
          type="text"
          placeholder="Periodo (Ej: 2025/05)"
          value={periodoBuscar}
          onChange={(e) => setPeriodoBuscar(e.target.value)}
          className="periodo-input"
        />
        <button className="primary-btn" onClick={filtrarPorPeriodo}>
          Buscar
        </button>
        <div className="dropdown-wrapper">
          <button
            className="primary-btn"
            onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}
          >
            INFORMES
          </button>
          {mostrarMenuInformes && (
            <div className="dropdown-content">
              <button onClick={() => setModalInformeTipo("altas")}>
                Altas
              </button>
              <button onClick={() => setModalInformeTipo("bajas")}>
                Bajas
              </button>
              <button onClick={() => setModalInformeTipo("modificaciones")}>
                Modificaciones
              </button>
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
          <input
            type="text"
            placeholder="Periodo (Ej: 2025/05)"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="periodo-input"
          />
          <button
            className="primary-btn"
            onClick={() => handleClickGenerar(mes)}
          >
            Generar
          </button>
          {/* Este es un comentario dentro de JSX
                    <button className="primary-btn">Exportar Aguinaldo</button>*/}
          <button
            className="primary-btn"
            onClick={() => setShowConfirmModalSA(true)}
          >
            Cierre
          </button>
        </div>
      </div>

      {showConfirmModalSA && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar Cierre de Periodo</h2>
            <label>Periodo a Cerrar</label>
            <input type="text" name="periodo" value="05/2025" readOnly={true} />
            <label>Comentario</label>
            <input
              type="text"
              name="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmModalSA(false)}>
                Confirmar
              </button>
              <button onClick={() => setShowConfirmModalSA(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="salaries-table">
        <thead>
          <tr>
            <th>C.I Nro.</th>
            <th>Funcionario</th>
            <th>Cargo</th>
            <th>Grado Salarial</th>
            <th>Asignación</th>
            <th>Periodo</th>
            <th>Obj. de Gasto</th>
            <th>Programa</th>
            <th>Subprograma</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {salarios.map((s, index) => (
            <tr key={index}>
              <td>{s.empleado.persona.nroDocumento}</td>
              <td>{`${s.empleado.persona.nombres} ${s.empleado.persona.apellidos}`}</td>
              <td>{s.empleado.cargo.descripcion}</td>
              <td>{s.gradoSalarial.descripcion}</td>
              <td>{s.asignacion.toLocaleString("es-PY")}</td>
              <td>{s.periodo.codPeriodo}</td>
              <td>{s.objetoGasto.descripcion}</td>
              <td>{s.programa.descripcion}</td>
              <td>{s.subprograma.descripcion}</td>
              <td>
                <FaEdit className="edit-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salarios;
