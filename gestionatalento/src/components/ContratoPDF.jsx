import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Times-Roman',
        lineHeight: 1.6
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        marginBottom: 12,
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
    },
    signatureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    signature: {
        width: '40%',
        textAlign: 'center',
    },
    firmaLine: {
        borderTop: '1pt solid #000',
        marginTop: 40,
        marginBottom: 4,
        width: '80%',
        alignSelf: 'center',
    },
    footer: {
        fontSize: 10,
        marginTop: 45,
        textAlign: 'center',
        color: '#888',
    }
});

const ContratoPDF = ({ contrato }) => {
    const {
        nombres,
        apellidos,
        nroDocumento,
        fecDesde,
        fecHasta,
        asignacion,
        montoLetras,
        nomFirmante1,
        nomFirmante2,
        situacionLaboral = {}
    } = contrato;

    const fechaHoy = new Date().toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>CONTRATO DE PRESTACIÓN DE SERVICIOS</Text>
                <Text style={styles.subtitle}>MUNICIPALIDAD DE LUQUE</Text>

                <Text style={styles.text}>
                    En la ciudad de LUQUE, a los {fechaHoy}, entre la MUNICIPALIDAD DE LUQUE,
                    representada en este acto por el/la Intendente/a Municipal <Text style={styles.bold}>{nomFirmante1}</Text>, en adelante denominada
                    "LA MUNICIPALIDAD", por una parte;
                    y por la otra parte, el/la señor/a <Text style={styles.bold}>{nombres} {apellidos}</Text>, con Cédula de Identidad N° {nroDocumento},
                    en adelante denominado/a "EL CONTRATADO/A", se celebra el presente CONTRATO DE PRESTACIÓN DE SERVICIOS, sujeto a las siguientes cláusulas:
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>PRIMERA – OBJETO:</Text> LA MUNICIPALIDAD contrata los servicios de EL CONTRATADO/A
                    para desempeñar tareas asignadas conforme a las necesidades institucionales.
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>SEGUNDA – DURACIÓN:</Text> El presente contrato tendrá una vigencia desde el {fecDesde}
                    hasta el {fecHasta}, pudiendo ser renovado o rescindido por cualquiera de las partes con preaviso de quince (15) días.
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>TERCERA – HONORARIOS:</Text> EL CONTRATADO/A percibirá en concepto de honorarios mensuales
                    la suma de Gs. {asignacion?.toLocaleString()} ({montoLetras}), que será abonada dentro de los primeros diez (10)
                    días hábiles del mes siguiente al mes trabajado.
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>CUARTA – OBLIGACIONES DEL CONTRATADO:</Text> Cumplir el horario asignado, prestar los
                    servicios con responsabilidad, asistir a capacitaciones si fueran requeridas, y reportar a su superior inmediato.
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>SEXTA – RESCISIÓN:</Text> El contrato podrá rescindirse por cualquiera de las partes por incumplimiento
                    de las cláusulas establecidas, o por razones administrativas debidamente justificadas.
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.bold}>SÉPTIMA – FIRMA:</Text> En prueba de conformidad, se firman dos ejemplares de un mismo tenor y efecto.
                </Text>

                <View style={styles.signatureContainer}>
                    <View style={styles.signature}>
                        <View style={styles.firmaLine}></View>
                        <Text>{nomFirmante1}</Text>
                        <Text>Representante Municipal</Text>
                    </View>
                    <View style={styles.signature}>
                        <View style={styles.firmaLine}></View>
                        <Text>{nomFirmante2}</Text>
                        <Text>Representante Municipal</Text>
                    </View>
                    <View style={styles.signature}>
                        <View style={styles.firmaLine}></View>
                        <Text>{nombres} {apellidos}</Text>
                        <Text>Contratado/a</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Documento generado automáticamente por el sistema de gestión de personas.
                </Text>
            </Page>
        </Document>
    );
};

export default ContratoPDF;
