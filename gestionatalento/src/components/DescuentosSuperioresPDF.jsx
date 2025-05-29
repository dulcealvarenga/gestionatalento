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
    colPeriodo: { width: "10%", paddingHorizontal: 2 },
    colCI: { width: "10%", paddingHorizontal: 2 },
    colNombre: { width: "15%", paddingHorizontal: 2 },
    colEntrada: { width: "15%", paddingHorizontal: 2 },
    colSalida: { width: "15%", paddingHorizontal: 2 },
    colAusencia: { width: "15%", paddingHorizontal: 2 },
    colMonto: { width: "15%", paddingHorizontal: 2 },
    colObservacion: { width: "10%", paddingHorizontal: 2 },
});

const DescuentosSuperioresPDF = ({ descuentos }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">
            <Text style={styles.header}>Municipalidad de Luque</Text>
            <Text style={styles.header}>Dirección de Gestión de Personas</Text>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 12,
            }} />

            <Text style={styles.title}>Inventario de Descuentos Aplicados Superiores</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.colPeriodo}>Periodo</Text>
                <Text style={styles.colCI}>CI</Text>
                <Text style={styles.colNombre}>Nombre</Text>
                <Text style={styles.colEntrada}>Entradas Tardias</Text>
                <Text style={styles.colSalida}>Salidas Anticipadas</Text>
                <Text style={styles.colAusencia}>Ausencias</Text>
                <Text style={styles.colMonto}>Monto</Text>
                <Text style={styles.colObservacion}>Observacion</Text>
            </View>

            {descuentos.map((c, i) => {
                const persona = c.empleado?.persona || {};

                return (
                    <View key={i} style={styles.row}>
                        <Text style={styles.colPeriodo}>{c.periodo.codPeriodo}</Text>
                        <Text style={styles.colCI}>{persona.nroDocumento}</Text>
                        <Text style={styles.colNombre}>{`${persona.nombres} ${persona.apellidos}`}</Text>
                        <Text style={styles.colEntrada}>{c.entradaTardia}</Text>
                        <Text style={styles.colSalida}>{c.salidaAnticipada}</Text>
                        <Text style={styles.colAusencia}>{c.ausencia}</Text>
                        <Text style={styles.colMonto}>{c.monto}</Text>
                        <Text style={styles.colObservacion}>{c.observacion}</Text>
                    </View>
                );
            })}
        </Page>
    </Document>
);

export default DescuentosSuperioresPDF;
