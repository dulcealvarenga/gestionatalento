// src/components/InventarioContratosPDF.jsx
import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 10 },
    header: { fontSize: 18, textAlign: "center", marginBottom: 10, fontWeight: "bold" },
    title: { fontSize: 16, textAlign: "center", marginBottom: 10 },
    tableHeader: { flexDirection: "row", backgroundColor: "#004b8d", color: "#fff", padding: 5 },
    row: { flexDirection: "row", borderBottom: "1pt solid #ccc", padding: 5 },
    cell: { flex: 1, paddingHorizontal: 2 },
});

const InventarioContratosPDF = ({ contratos }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">

            <Text style={styles.header}>Municipalidad de Luque</Text>
            <Text style={styles.header}>Dirección de Gestión de Personas</Text>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 12,
            }} />

            <Text style={styles.title}>Inventario de Contratos</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.cell}>ID</Text>
                <Text style={styles.cell}>Documento</Text>
                <Text style={styles.cell}>Nombre</Text>
                <Text style={styles.cell}>Periodo</Text>
                <Text style={styles.cell}>Estado</Text>
                <Text style={styles.cell}>Observación</Text>
                <Text style={styles.cell}>Firmante 1</Text>
                <Text style={styles.cell}>Firmante 2</Text>
            </View>

            {contratos.map((c, i) => (
                <View key={i} style={styles.row}>
                    <Text style={styles.cell}>{c.nroContrato}</Text>
                    <Text style={styles.cell}>{c.nroDocumento}</Text>
                    <Text style={styles.cell}>{`${c.nombres} ${c.apellidos}`}</Text>
                    <Text style={styles.cell}>{c.periodo?.codPeriodo}</Text>
                    <Text style={styles.cell}>{c.estado === "1" ? "Cargado" : "Confirmado"}</Text>
                    <Text style={styles.cell}>{c.observacion || "-"}</Text>
                    <Text style={styles.cell}>{c.nomFirmante1 || "-"}</Text>
                    <Text style={styles.cell}>{c.nomFirmante2 || "-"}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default InventarioContratosPDF;
