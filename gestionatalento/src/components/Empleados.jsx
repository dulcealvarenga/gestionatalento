import React, { useState, useEffect } from "react";
import "./Empleados.css";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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

  const [soloComisionados, setSoloComisionados] = useState(false);
  const [soloPasantes, setSoloPasantes] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarMenuInformes, setMostrarMenuInformes] = useState(false);
  const [modalInformeTipo, setModalInformeTipo] = useState(null); // "altas", "bajas", "modificaciones"
  const [periodo, setPeriodo] = useState("");
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  useEffect(() => {
    const codEmpleado = localStorage.getItem("empleadoBuscado");
    if (codEmpleado) {
      axios
        .get(`http://localhost:8080/empleados/obtener/id/${codEmpleado}`)
        .then((res) => {
          setListaEmpleados([res.data.objeto]);
          localStorage.removeItem("empleadoBuscado");
        });
    } else {
      axios
        .get("http://localhost:8080/empleados/obtenerLista")
        .then((res) => setListaEmpleados(res.data.objeto));
    }
  }, []);

  let empleadosFiltrados = listaEmpleados;
  if (soloComisionados) {
    empleadosFiltrados = empleadosFiltrados.filter(
      (e) =>
        e.empleado.situacionLaboral?.descripcion?.toUpperCase() ===
        "COMISIONADO"
    );
  }
  if (soloPasantes) {
    empleadosFiltrados = empleadosFiltrados.filter((e) => {
      const cod = e.empleado.situacionLaboral?.codSituacionLaboral;
      return cod === 4 || cod === 5;
    });
  }

  const handleEditar = (empleado) => {
    setEmpleadoEditando(empleado);
    setMostrarModalEdicion(true);
    setModalInformeTipo(null);
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    try {
      const personaActualizada = {
        codEmpleado: empleadoEditando.codEmpleado,
        codPersona: empleadoEditando.empleado.persona.codPersona,
        nroDocumento: empleadoEditando.empleado.persona.nroDocumento,
        nroRuc: empleadoEditando.empleado.persona.nroRuc,
        nombres: empleadoEditando.empleado.persona.nombres,
        apellidos: empleadoEditando.empleado.persona.apellidos,
        codNivelEstudio: empleadoEditando.empleado.persona.codNivelEstudio,
        codPaisNacimiento: empleadoEditando.empleado.persona.codPaisNacimiento,
        fecNacimiento: empleadoEditando.empleado.persona.fecNacimiento,
        lugarNacimiento: empleadoEditando.empleado.persona.lugarNacimiento,
        poseeDiscapacidad: empleadoEditando.empleado.persona.poseeDiscapacidad,
        descripcionDiscapacidad:
          empleadoEditando.empleado.persona.descripcionDiscapacidad,
        rutaFoto: empleadoEditando.empleado.persona.rutaFoto,
        estadoCivil: {
          codEstadoCivil:
            empleadoEditando.empleado.persona.estadoCivil?.codEstadoCivil,
        },
      };
      await axios.put(
        "http://localhost:8080/personas/actualizar",
        personaActualizada
      );
      setMostrarModalEdicion(false);
      const res = await axios.get(
        "http://localhost:8080/empleados/obtenerLista"
      );
      setListaEmpleados(res.data.objeto);
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
    }
  };

  const actualizarPersona = (campo, valor) => {
    setEmpleadoEditando((prev) => ({
      ...prev,
      empleado: {
        ...prev.empleado,
        persona: {
          ...prev.empleado.persona,
          [campo]: valor,
        },
      },
    }));
  };
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
    <div className="empleados-container">
      <h1>Empleados</h1>
      <p className="acciones-title" style={{ fontSize: "22px" }}>
        Acciones
      </p>

      <div className="acciones-buttons">
        <button
          className="boton-accion"
          onClick={() => navigate("/abmEmpleados")}
        >
          AGREGAR EMPLEADO
        </button>
        <button
          className="boton-accion"
          onClick={() => navigate("/bajaEmpleados")}
        >
          BAJA DE EMPLEADOS
        </button>
        <div className="dropdown">
          <button
            className="boton-accion"
            onClick={() => setMostrarMenuInformes(!mostrarMenuInformes)}
          >
            INFORMES
          </button>
          {mostrarMenuInformes && (
            <div className="dropdown-menu">
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

      <div className="filtro-comisionado">
        <input
          type="checkbox"
          id="comisionado"
          checked={soloComisionados}
          onChange={() => setSoloComisionados(!soloComisionados)}
        />
        <label htmlFor="comisionado" style={{ fontSize: "22px" }}>
          Mostrar solo Comisionados
        </label>
        <input
          type="checkbox"
          id="pasante"
          checked={soloPasantes}
          onChange={() => setSoloPasantes(!soloPasantes)}
          style={{ marginLeft: "30px" }}
        />
        <label htmlFor="pasante" style={{ fontSize: "22px" }}>
          Mostrar solo Pasantes
        </label>
      </div>

      <table className="tabla-empleados">
        <thead>
          <tr>
            <th style={{ fontSize: "20px" }}>Legajos</th>
            <th style={{ fontSize: "20px" }}>Foto</th>
            <th style={{ fontSize: "20px" }}>Nro. de Documento</th>
            <th style={{ fontSize: "20px" }}>Nombre Completo</th>
            <th style={{ fontSize: "20px" }}>Fecha de Nacimiento</th>
            <th style={{ fontSize: "20px" }}>Fecha de Ingreso</th>
            <th style={{ fontSize: "20px" }}>Fecha de Egreso</th>
            <th style={{ fontSize: "20px" }}>Editar</th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map((emp) => (
            <tr key={emp.codEmpleado}>
              <td>
                <button className="ver-btn">ver</button>
              </td>
              <td>
                <img src="/avatar.png" alt="Foto" className="foto-empleado" />
              </td>
              <td style={{ fontSize: "20px" }}>
                {emp.empleado.persona.nroDocumento}
              </td>
              <td style={{ fontSize: "20px" }}>
                {emp.empleado.persona.nombres} {emp.empleado.persona.apellidos}
              </td>
              <td style={{ fontSize: "20px" }}>
                {emp.empleado.persona.fecNacimiento}
              </td>
              <td style={{ fontSize: "20px" }}>{emp.empleado.fecIngreso}</td>
              <td style={{ fontSize: "20px" }}>{emp.empleado.fecEgreso}</td>
              <td className="direccion-cell" style={{ fontSize: "20px" }}>
                <span
                  className="editar-icon"
                  onClick={() => handleEditar(emp)}
                  title="Editar dirección"
                >
                  &#9998;
                </span>
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
                      value={empleadoEditando.empleado.persona.nroDocumento}
                      onChange={(e) =>
                        actualizarPersona("nroDocumento", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={empleadoEditando.empleado.persona.nombres}
                      onChange={(e) =>
                        actualizarPersona("nombres", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Apellido:
                    <input
                      type="text"
                      value={empleadoEditando.empleado.persona.apellidos}
                      onChange={(e) =>
                        actualizarPersona("apellidos", e.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="columna">
                  <label>
                    Fecha de Nacimiento:
                    <input
                      type="date"
                      value={empleadoEditando.empleado.persona.fecNacimiento}
                      onChange={(e) =>
                        actualizarPersona("fecNacimiento", e.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="botones-modal">
                <button type="submit">Guardar</button>
                <button
                  type="button"
                  onClick={() => setMostrarModalEdicion(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;
