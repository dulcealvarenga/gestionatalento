import React, { useEffect } from "react";
import axios from "axios";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/constantes.js";

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 8,
    fontFamily: "Times-Roman",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 12,
    color: "#333333",
    fontFamily: "Helvetica",
  },
  personaLabel: {
    textAlign: "center",
    fontSize: 11,
    marginBottom: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#004b8d",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 4,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    textAlign: "center",
    fontSize: 10,
  },
  cellN: { flex: 1 },
  cellCI: { flex: 2 },
  cellNombre: { flex: 4 },
  cellFecha: { flex: 2 },
  cellHora: { flex: 3 },
  cellHE: { flex: 1 },
  justificativosTitulo: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "bold",
    color: "#004b8d",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 9,
    color: "#666",
  },
});
// Helpers
const generarFechasDelMes = (mes, anio) => {
  const fechas = [];
  let fecha = new Date(`${anio}-${String(mes).padStart(2, "0")}-01T00:00:00`);
  while (fecha.getMonth() + 1 === mes) {
    fechas.push(new Date(fecha));
    fecha.setUTCDate(fecha.getUTCDate() + 1);
  }
  return fechas;
};

const agruparMarcacionesPorDia = (marcaciones) => {
  const agrupadas = {};
  marcaciones.forEach((m) => {
    const f = new Date(m.fecMarcacion);
    const clave = f.toISOString().split("T")[0];
    if (!agrupadas[clave]) agrupadas[clave] = [];
    agrupadas[clave].push(f);
  });
  return agrupadas;
};

// Componente PDF
const RecibosPDF = ({ data, mes, anio }) => {
  const fechasMes = generarFechasDelMes(mes, anio);

  return (
    <Document>
      {Object.values(data).map((personaData, index) => {
        const { persona, marcaciones, justificativos } = personaData;

        // Agrupar marcaciones por día real
        const agrupadas = {};
        marcaciones.forEach((m) => {
          const fecha = new Date(m.marcacionManual.fecMarcacion);
          const clave = fecha.toISOString().split("T")[0];
          if (!agrupadas[clave]) agrupadas[clave] = [];
          agrupadas[clave].push(m.marcacionManual.fecMarcacion);
        });

        return (
          <Page key={index} size="A4" style={styles.page}>
            <Text style={styles.title}>
              INFORME DE HORARIOS DE ENTRADA Y SALIDA
            </Text>
            <Text style={styles.subtitle}>
              DEPARTAMENTO DE ADMINISTRACIÓN DE PERSONAS
            </Text>
            <Text style={styles.personaLabel}>
              PERSONA: C.I N° {persona.nroDocumento} -{" "}
              {`${persona.nombres} ${persona.apellidos}`.toUpperCase()}
            </Text>

            {/* Tabla de marcaciones */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.cellN]}>N°</Text>
                <Text style={[styles.tableCell, styles.cellCI]}>C.I</Text>
                <Text style={[styles.tableCell, styles.cellNombre]}>
                  NOMBRE COMPLETO
                </Text>
                <Text style={[styles.tableCell, styles.cellFecha]}>FECHA</Text>
                <Text style={[styles.tableCell, styles.cellHora]}>
                  ENTRADA - SALIDA
                </Text>
                <Text style={[styles.tableCell, styles.cellHE]}>H.E</Text>
              </View>

              {fechasMes.map((fecha, i) => {
                const clave = fecha.toISOString().split("T")[0];
                const horas = (agrupadas[clave] || [])
                  .map((h) => new Date(h))
                  .sort((a, b) => a.getTime() - b.getTime());

                const entrada =
                  horas.length > 0
                    ? horas[0].toLocaleTimeString("es-PY", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "-";

                const salida =
                  horas.length > 1
                    ? horas[horas.length - 1].toLocaleTimeString("es-PY", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "-";

                const entradaSalida =
                  entrada === "-" && salida === "-"
                    ? "-"
                    : `${entrada} - ${salida}`;

                return (
                  <View style={styles.tableRow} key={i}>
                    <Text style={[styles.tableCell, styles.cellN]}>
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellCI]}>
                      {persona.nroDocumento}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellNombre]}>
                      {`${persona.nombres} ${persona.apellidos}`.toUpperCase()}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellFecha]}>
                      {fecha.toLocaleDateString("es-PY")}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellHora]}>
                      {entradaSalida}
                    </Text>
                    <Text style={[styles.tableCell, styles.cellHE]}>-</Text>
                  </View>
                );
              })}
            </View>

            {/* Tabla de justificativos */}
            <Text style={styles.justificativosTitulo}>
              JUSTIFICATIVOS DEL MES
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, { flex: 2 }]}>Fecha</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>OBS BREVE</Text>
                <Text style={[styles.tableCell, { flex: 5 }]}>
                  OBS COMPLETA
                </Text>
              </View>
              {[...justificativos]
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map((j, i) => (
                  <View style={styles.tableRow} key={i}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {new Date(j.fecha)
                        .toISOString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 3 }]}>
                      {j.tipoJustificativo?.descripcion || "-"}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 5 }]}>
                      {j.descripcion || "-"}
                    </Text>
                  </View>
                ))}
            </View>

            <View style={styles.footer}>
              <Text>DIV. DE MONITOREO Y SEGUIMIENTO DE PERSONAS</Text>
              <Text>(Firma y Sello)</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const InformeRecibos = () => {
  const [params] = useSearchParams();
  const mes = parseInt(params.get("mes"), 10);

  useEffect(() => {
    const generar = async () => {
      try {
        if (!mes) return alert("Falta el parámetro 'mes'.");

        const [resMarc, resJust] = await Promise.all([
          axios.get(`${API_BASE_URL}marcaciones/manuales/obtenerLista`),
          axios.get(`${API_BASE_URL}justificativos/obtenerListaJustificativos`),
        ]);

        const marcaciones = resMarc.data.objeto || [];
        const justificativos = resJust.data.objeto || [];

        // Obtener el año más probable del conjunto de datos filtrados
        const anio = (() => {
          const fechas = [...marcaciones, ...justificativos]
            .map((item) => {
              const val =
                item.fecMarcacion ||
                item.marcacionManual?.fecMarcacion ||
                item.fecha;
              return val ? new Date(val) : null;
            })
            .filter((f) => f && f.getMonth() + 1 === mes);
          return fechas.length > 0
            ? fechas[0].getFullYear()
            : new Date().getFullYear();
        })();

        const filtrarPorMesYAnio = (items, campo) =>
          items.filter((item) => {
            let val = item;
            for (const p of campo.split(".")) val = val?.[p];
            if (!val) return false;

            const [year, month] = val.split("T")[0].split("-");
            return parseInt(month) === mes && parseInt(year) === anio;
          });

        const marcMes = filtrarPorMesYAnio(
          marcaciones,
          "marcacionManual.fecMarcacion"
        );
        const justMes = filtrarPorMesYAnio(justificativos, "fecha");

        const agrupados = {};
        [...marcMes, ...justMes].forEach((item) => {
          const p = item.persona || item.marcacionManual?.persona;
          const cod = p.codPersona;
          if (!agrupados[cod])
            agrupados[cod] = {
              persona: p,
              marcaciones: [],
              justificativos: [],
            };
          if (item.marcacionManual) agrupados[cod].marcaciones.push(item);
          else agrupados[cod].justificativos.push(item);
        });

        if (Object.keys(agrupados).length === 0) {
          alert("No hay datos disponibles para este mes.");
          return;
        }

        const blob = await pdf(
          <RecibosPDF data={agrupados} mes={mes} anio={anio} />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recibos_${mes}_${anio}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generando PDF:", error);
        alert("Error al generar el informe.");
      }
    };

    generar();
  }, [mes]);

  return <div style={{ padding: 20 }}>Generando informe de recibos...</div>;
};

export default InformeRecibos;
