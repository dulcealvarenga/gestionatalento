import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    title: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    title2: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#004b8d',
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1 solid black',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    colTipo: { width: '10%' },
    colDesc: { width: '30%' },
    colNroDoc: { width: '18%' },
    colFunc: { width: '22%' },
    colFin: { width: '15%' },
    footer: {
        fontSize: 10,
        marginTop: 25,
        textAlign: 'center',
        color: '#888',
    },
});

const ReporteVencidosPDF = ({ data }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>MUNICIPALIDAD DE LUQUE</Text>
            <Text style={styles.title}>DIRECCIÓN DE GESTIÓN Y DESARROLLO DE PERSONAS</Text>
            <Text style={styles.subtitle}>DEPARTAMENTO DE ADMINISTRACIÓN DE PERSONAS</Text>
            <Text style={styles.title2}>REPORTE DE DOCUMENTOS VENCIDOS</Text>

            <View style={styles.tableHeader}>
                <Text style={styles.colTipo}>Tipo</Text>
                <Text style={styles.colDesc}>Descripción</Text>
                <Text style={styles.colNroDoc}>Nro. Documento</Text>
                <Text style={styles.colFunc}>Funcionario</Text>
                <Text style={styles.colFin}>Vencimiento</Text>
            </View>

            {data.map((doc, index) => (
                <View style={styles.tableRow} key={index}>
                    <Text style={styles.colTipo}>{doc.tipo}</Text>
                    <Text style={styles.colDesc}>{doc.descripcion}</Text>
                    <Text style={styles.colNroDoc}>{doc.persona.nroDocumento}</Text>
                    <Text style={styles.colFunc}>{`${doc.persona?.nombres || ""} ${doc.persona?.apellidos || ""}`}</Text>
                    <Text style={styles.colFin}>{doc.fechaFin}</Text>
                </View>
            ))}

            <Text style={styles.footer}>
                Documento generado automáticamente por el sistema de gestión de personas.
            </Text>
        </Page>
    </Document>
);

export default ReporteVencidosPDF;
