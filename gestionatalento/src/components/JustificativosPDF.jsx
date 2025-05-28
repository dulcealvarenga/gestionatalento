import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';

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
    subtitle: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    solicitud: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        borderBottom: 'solid black',
        marginBottom: 10,
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '35%',
        fontWeight: 'bold',
    },
    value: {
        width: '65%',
        borderBottom: '1 solid black',
        paddingLeft: 5,
    },
    value2: {
        width: '65%',
        borderBottom: '1 solid black',
        paddingLeft: 5,
        marginBottom: 10,
    },
    checkGroup: {
        marginVertical: 10,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    checkbox: {
        width: 10,
        height: 10,
        border: '1 solid black',
        marginRight: 5,
    },
    footerSignatures: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        fontSize: 10,
        marginTop: 45,
        textAlign: 'center',
        color: '#888',
    },
    signatureBlock: {
        width: '30%',
        textAlign: 'center',
    },
    obs: {
        fontSize: 9,
        marginTop: 20,
        borderTop: '1 solid black',
        paddingTop: 5,
    },
    checkGroupColumn: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },

    checkRowColumn: {
        width: '30%', // 🧠 Ajustás para que entre 3 por fila
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
});

const JustificativosPDF = ({ data }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.title}>MUNICIPALIDAD DE LUQUE</Text>
            <Text style={styles.title}>DIRECCIÓN DE GESTIÓN Y DESARROLLO DE PERSONAS</Text>
            <Text style={styles.subtitle}>DEPARTAMENTO DE ADMINISTRACIÓN DE PERSONAS</Text>
            <View style={{
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                marginBottom: 20,
            }} />
            <Text style={styles.solicitud}>SOLICITUD DE AUTORIZACIÓN DE PERMISO</Text>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Nombre y Apellido:</Text>
                    <Text style={styles.value}>{data.persona?.nombres} {data.persona?.apellidos}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Dirección / Dependencia:</Text>
                    <Text style={styles.value}>{data.dependencia}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>C.I.N.:</Text>
                    <Text style={styles.value}>{data.persona?.nroDocumento}</Text>
                </View>
            </View>

            <Text>Permiso Solicitado:</Text>
            <View style={styles.checkGroupColumn}>
                {[
                    "Reposo Medico",
                    "Permiso por Maternidad",
                    "Permiso por Lactancia",
                    "Permiso por Paternidad",
                    "Duelo",
                    "Permiso Particular",
                    "Orden de Trabajo",
                    "Otros",
                ].map((item, idx) => (
                    <View key={idx} style={styles.checkRowColumn}>
                        <View style={[styles.checkbox, data.tipoJustificativo?.descripcion === item && { backgroundColor: 'black' }]} />
                        <Text>{item}</Text>
                    </View>
                ))}
            </View>

            <Text style={{ marginBottom: 10 }}>Tiempo de duración del permiso:</Text>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Desde la fecha:</Text>
                    <Text style={styles.value}>{data.fechaDesde} </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Hasta la fecha:</Text>
                    <Text style={styles.value2}>{data.fechaHasta}</Text>
                </View>
            </View>

            <View style={styles.footerSignatures}>
                <View style={styles.signatureBlock}>
                    <Text style={{ marginBottom: 10 }}>Firma del Director o Jefe Inmediato</Text>
                </View>
                <View style={styles.signatureBlock}>
                    <Text style={{ marginBottom: 10 }}>Firma del Solicitante {"\n"}</Text>
                </View>
            </View>
            <View style={styles.footerSignatures}>
                <View style={styles.signatureBlock}>
                    <Text>Firma del Jefe del Dpto. de Admin. de Personas</Text>
                </View>
                <View style={styles.signatureBlock}>
                    <Text>Firma del Director de Gestión y Desarrollo de Personas</Text>
                </View>
            </View>

            <View style={styles.obs}>
                <Text>
                    OBS: El permiso solicitado puede ser rechazado por alguna anormalidad en el mismo, justificando
                    plenamente el motivo del rechazo según lo estipulado en el Artículo N° 32 del Reglamento Interno
                    de la Municipalidad de Luque.
                </Text>
            </View>

            <Text style={styles.footer}>
                Documento generado automáticamente por el sistema de gestión de personas.
            </Text>
        </Page>
    </Document>
);

export default JustificativosPDF;
