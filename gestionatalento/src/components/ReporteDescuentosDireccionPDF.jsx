// src/components/ReporteDescuentosDireccionPDF.jsx
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10 },
    header: { textAlign: "center", fontSize: 14, marginBottom: 5, fontWeight: "bold" },
    subheader: { fontSize: 10, marginBottom: 12, textAlign: "center" },
    direccion: { fontSize: 10, marginBottom: 11 },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#004b8d",
        color: "white",
        padding: 5,
        fontWeight: "bold"
    },
    row: { flexDirection: "row", borderBottom: "1pt solid #ccc", padding: 5 },
    colNro: { width: '5%', paddingHorizontal: 2 },
    colNroDoc: { width: '10%', paddingHorizontal: 2 },
    colNombre: { width: "20%", paddingHorizontal: 2 },
    colEntrada: { width: "20%", paddingHorizontal: 2 },
    colSalida: { width: "20%", paddingHorizontal: 2 },
    colAusencia: { width: "20%", paddingHorizontal: 2 },
    colMonto: { width: "15%", paddingHorizontal: 2 },
    firma: {
        marginTop: 20,
        fontSize: 9,
        textAlign: "center",
        color: "#666",
    },
});

const ReporteDescuentosDireccionPDF = ({ data }) => (
    <Document>
        {data.map((seccion, index) => (
            <Page size="A4" style={styles.page} key={index} orientation="landscape">
                <Text style={styles.header}>LISTADO DE FUNCIONARIOS CON MULTAS OBTENIDAS DEL RELOJ BIOMÉTRICO</Text>
                <Text style={styles.subheader}>DAP - DIVISIÓN DE MONITOREO Y SEGUIMIENTO DE PERSONAS</Text>
                <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: 'black',
                    marginBottom: 12,
                }} />
                <View style={styles.direccion}>
                    <Text>
                        <Text style={{ fontWeight: 'bold' }}>PARA: </Text>
                        {seccion.cabecera.direccion.descripcion}
                    </Text>
                </View>

                <View style={styles.direccion}>
                    <Text>
                        <Text style={{ fontWeight: 'bold' }}>FECHA: </Text>
                        {new Date().toLocaleDateString()}
                    </Text>
                </View>

                <View style={styles.tableHeader}>
                    <Text style={styles.colNro}>N°</Text>
                    <Text style={styles.colNroDoc}>C.I. N°</Text>
                    <Text style={styles.colNombre}>FUNCIONARIO</Text>
                    <Text style={styles.colEntrada}>ENTR. TARDÍAS</Text>
                    <Text style={styles.colSalida}>SAL. ANTICIPADAS</Text>
                    <Text style={styles.colAusencia}>AUSENCIAS</Text>
                    <Text style={styles.colMonto}>MONTO</Text>
                </View>

                {seccion.detalle.map((d, i) => (
                    <View style={styles.row} key={i}>
                        <Text style={styles.colNro}>{i + 1}</Text>
                        <Text style={styles.colNroDoc}>{d.empleado.persona.nroDocumento}</Text>
                        <Text style={styles.colNombre}>
                            {`${d.empleado.persona.nombres} ${d.empleado.persona.apellidos}`}
                        </Text>
                        <Text style={styles.colEntrada}>{d.entradaTardia}</Text>
                        <Text style={styles.colSalida}>{d.salidaAnticipada}</Text>
                        <Text style={styles.colAusencia}>{d.ausencia}</Text>
                        <Text style={styles.colMonto}>{Number(d.monto).toLocaleString("es-PY")}</Text>
                    </View>
                ))}

                <Text style={styles.firma}>- Se aceptan reclamos hasta 5 días hábiles posteriores a la fecha de recibido del documento</Text>
            </Page>
        ))}
    </Document>
);

export default ReporteDescuentosDireccionPDF;
