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
    colNro: { width: "5%", paddingHorizontal: 2 },
    colDireccion: { width: "23%", paddingHorizontal: 2 },
    colCI: { width: "10%", paddingHorizontal: 2 },
    colNombre: { width: "15%", paddingHorizontal: 2 },
    colGenerado: { width: "10%", paddingHorizontal: 2 },
    colReservado: { width: "10%", paddingHorizontal: 2 },
    colUtilizado: { width: "10%", paddingHorizontal: 2 },
    colDisponible: { width: "10%", paddingHorizontal: 2 },
    colFecha: { width: "10%", paddingHorizontal: 2 },
});

const InventarioVacacionesDispPDF = ({ vacaciones }) => (
    <Document>
        <Page style={styles.page} size="A4" orientation="landscape">
            <Text style={styles.header}>Municipalidad de Luque</Text>
            <Text style={styles.header}>Dirección de Gestión de Personas</Text>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 12,
            }} />

            <Text style={styles.title}>Inventario de Vacaciones Generadas por Funcionarios</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.colNro}>Nro</Text>
                <Text style={styles.colDireccion}>Cargo</Text>
                <Text style={styles.colCI}>CI</Text>
                <Text style={styles.colNombre}>Nombre</Text>
                <Text style={styles.colGenerado}>Generados</Text>
                <Text style={styles.colReservado}>Reservados</Text>
                <Text style={styles.colUtilizado}>Utilizados</Text>
                <Text style={styles.colDisponible}>Disponibles</Text>
                <Text style={styles.colFecha}>Generación</Text>
            </View>

            {vacaciones.map((c, i) => {
                const persona = c.empleado?.persona || {};
                const direccion = c.empleado?.cargo?.descripcion || "-";
                const diasDisponibles = c.cantidadGenerada - c.cantidadReservado;

                return (
                    <View key={i} style={styles.row}>
                        <Text style={styles.colNro}>{c.nroInventario}</Text>
                        <Text style={styles.colDireccion}>{direccion}</Text>
                        <Text style={styles.colCI}>{persona.nroDocumento}</Text>
                        <Text style={styles.colNombre}>{`${persona.nombres} ${persona.apellidos}`}</Text>
                        <Text style={styles.colGenerado}>{c.cantidadGenerada}</Text>
                        <Text style={styles.colReservado}>{c.cantidadReservado}</Text>
                        <Text style={styles.colUtilizado}>{c.cantidadUtilizado}</Text>
                        <Text style={styles.colDisponible}>{diasDisponibles}</Text>
                        <Text style={styles.colFecha}>{c.fecUltimaGeneracion}</Text>
                    </View>
                );
            })}
        </Page>
    </Document>
);

export default InventarioVacacionesDispPDF;
