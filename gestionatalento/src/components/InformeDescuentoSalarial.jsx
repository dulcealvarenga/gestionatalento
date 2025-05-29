import React, { useEffect, useState } from "react";
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
  page: { padding: 50, fontSize: 12, fontFamily: "Helvetica" },
  title: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#003366",
    fontFamily: "Times-Roman",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "normal",
    color: "#333333",
    fontFamily: "Helvetica",
    textTransform: "uppercase",
  },
  header: {
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "left",
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
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    textAlign: "center",
    fontSize: 11,
  },
  cellN: { flex: 1 },
  cellCI: { flex: 2 },
  cellNombre: { flex: 4 },
  cellAsignacion: { flex: 2 },
  cellMonto: { flex: 2 },
  footer: { marginTop: 30, textAlign: "center", fontSize: 10, color: "#666" },
});
const InformePDF = ({ data, periodo, fecha }) => {
  const totalPaginas = Math.ceil(data.length / 36);
  const paginar = (arr, tam) => {
    const paginas = [];
    for (let i = 0; i < arr.length; i += tam) {
      paginas.push(arr.slice(i, i + tam));
    }
    return paginas;
  };
  const paginas = paginar(data, 36);

  return (
    <Document>
      {paginas.map((pagina, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <Text style={styles.title}>MUNICIPALIDAD DE LUQUE</Text>
          <Text style={styles.subtitle}>
            DESCUENTO SALARIAL - PÁGINA {index + 1} DE {totalPaginas}
          </Text>

          <View style={styles.header}>
            <Text>PERIODO: {periodo}</Text>
            <Text>FECHA: {fecha}</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>N°</Text>
              <Text style={[styles.tableCell, styles.cellCI]}>C.I N°</Text>
              <Text style={[styles.tableCell, styles.cellNombre]}>
                NOMBRES Y APELLIDOS
              </Text>
              <Text style={[styles.tableCell, styles.cellAsignacion]}>
                ASIGNACIÓN
              </Text>
              <Text style={[styles.tableCell, styles.cellMonto]}>MONTO</Text>
            </View>
            {pagina.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {index * 36 + idx + 1}
                </Text>
                <Text style={[styles.tableCell, styles.cellCI]}>
                  {item.empleado.persona.nroDocumento}
                </Text>
                <Text style={[styles.tableCell, styles.cellNombre]}>
                  {`${item.empleado.persona.nombres} ${item.empleado.persona.apellidos}`.toUpperCase()}
                </Text>
                <Text style={[styles.tableCell, styles.cellAsignacion]}>
                  {Number(item.empleado.asignacion).toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, styles.cellMonto]}>
                  {Number(item.monto).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          {index === totalPaginas - 1 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 7, textAlign: "right" }]}>
                TOTAL:
              </Text>
              <Text style={[styles.tableCell, styles.cellMonto]}>
                {Number(
                  data.reduce((acc, val) => acc + Number(val.monto), 0)
                ).toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text>Lic. Jessica Gómez Hermida</Text>
            <Text>Directora</Text>
            <Text>Dirección de Gestión y Desarrollo de Personas</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

const InformeDescuentoSalarial = () => {
  const [generado, setGenerado] = useState(false);
  const [searchParams] = useSearchParams();
  const periodoParam = searchParams.get("periodo"); // ejemplo: "2025/03"

  useEffect(() => {
    const generarYDescargarPDF = async () => {
      try {
        if (!periodoParam) {
          alert("No se especificó el período en la URL.");
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}descuentos-salariales/obtenerLista`
        );
        const descuentos = res.data.objeto || [];

        const descuentosFiltrados = descuentos.filter(
          (d) => d.periodo.codPeriodo === periodoParam
        );

        if (descuentosFiltrados.length === 0) {
          alert("No hay datos para el período seleccionado.");
          return;
        }

        const [anio, mes] = periodoParam.split("/");
        const nombresMeses = [
          "ENERO",
          "FEBRERO",
          "MARZO",
          "ABRIL",
          "MAYO",
          "JUNIO",
          "JULIO",
          "AGOSTO",
          "SEPTIEMBRE",
          "OCTUBRE",
          "NOVIEMBRE",
          "DICIEMBRE",
        ];
        const periodo = `${nombresMeses[parseInt(mes, 10) - 1]} ${anio}`;
        const fecha = new Date().toLocaleDateString("es-PY");

        const blob = await pdf(
          <InformePDF
            data={descuentosFiltrados}
            periodo={periodo}
            fecha={fecha}
          />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "descuento_salarial.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGenerado(true);
      } catch (e) {
        console.error("Error generando PDF:", e);
        alert("Hubo un error al generar el PDF.");
      }
    };

    if (!generado) {
      generarYDescargarPDF();
    }
  }, [generado, periodoParam]);

  return <div style={{ padding: 20 }}>Generando PDF...</div>;
};

export default InformeDescuentoSalarial;
