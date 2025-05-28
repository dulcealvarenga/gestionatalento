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

const InventarioVacacionesPDF = ({ vacaciones }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">

            <Text style={styles.header}>Municipalidad de Luque</Text>
            <Text style={styles.header}>Dirección de Gestión de Personas</Text>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 12,
            }} />

            <Text style={styles.title}>Inventario de Vacaciones Cargadas por Funcionarios</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.cell}>ID</Text>
                <Text style={styles.cell}>CI</Text>
                <Text style={styles.cell}>Nombre</Text>
                <Text style={styles.cell}>Fecha</Text>
                <Text style={styles.cell}>Estado</Text>
                <Text style={styles.cell}>Observación</Text>
            </View>

            {vacaciones.map((c, i) => (
                <View key={i} style={styles.row}>
                    <Text style={styles.cell}>{c.nroJustificativo}</Text>
                    <Text style={styles.cell}>{c.persona.nroDocumento}</Text>
                    <Text style={styles.cell}>{`${c.persona.nombres} ${c.persona.apellidos}`}</Text>
                    <Text style={styles.cell}>{c.fecha}</Text>
                    <Text style={styles.cell}>{c.estado === "V" ? "Verificado" : "Cargado"}</Text>
                    <Text style={styles.cell}>{c.descripcion || "-"}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default InventarioVacacionesPDF;
