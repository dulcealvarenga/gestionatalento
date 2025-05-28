import React from 'react';
import {
    Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer';

// Estilos
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    title: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 20,
        textDecoration: 'underline',
    },
    textBlock: {
        marginVertical: 10,
        textAlign: 'justify',
        lineHeight: 1.5,
    },
    firma: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 11,
    },
    obs: {
        fontSize: 9,
        marginTop: 30,
        borderTop: '1 solid black',
        paddingTop: 5,
    },
});

// Función para calcular antigüedad desde fecha de ingreso
const calcularAntiguedad = (fecIngreso) => {
    const ingreso = new Date(fecIngreso);
    const hoy = new Date();
    const años = hoy.getFullYear() - ingreso.getFullYear();
    const meses = hoy.getMonth() - ingreso.getMonth();
    const días = hoy.getDate() - ingreso.getDate();
    return `${años} año(s), ${meses < 0 ? 12 + meses : meses} mes(es) y ${Math.abs(días)} día(s)`;
};

const CertificadoTrabajoPDF = ({ empleado }) => {
    const fechaHoy = new Date();
    const fechaLiteral = fechaHoy.toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const antiguedad = calcularAntiguedad(empleado.fecIngreso);

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>MUNICIPALIDAD DE LUQUE</Text>
                <Text style={styles.header}>DIRECCIÓN DE GESTIÓN Y DESARROLLO DE PERSONAS</Text>
                <Text style={{ textAlign: 'right' }}>Luque, {fechaLiteral}</Text>
                <Text style={styles.title}>D.A.P</Text>
                <Text style={styles.textBlock}>
                    <Text style={{ fontWeight: 'bold' }}>CERTIFICA QUE: </Text>
                    {empleado.persona.nombres} {empleado.persona.apellidos} con C.I. {empleado.persona.nroDocumento} es funcionario municipal {empleado.situacionLaboral.descripcion},
                    con una antigüedad de {antiguedad}, prestando servicios como {empleado.cargo.descripcion || "Auxiliar"} en la {empleado.cargo.departamento.direccion.descripcion || "Dirección de Gestión y Desarrollo de Personas"},
                    con un salario mensual de Gs. {empleado.asignacion || '2.000.000'}.
                </Text>
                <Text style={styles.textBlock}>
                    A pedido del interesado se expide el presente certificado para los fines que estime convenientes.
                </Text>

                <View style={styles.firma}>
                    <Text>___________________________________</Text>
                    <Text>Sandra Pamela Gómez Orrego</Text>
                    <Text>Jefa del Departamento de Administración de Personas</Text>
                </View>

                <View style={styles.obs}>
                    <Text>
                        OBS: El horario de atención para dar información sobre los funcionarios es de 07:00 a 13:00 hs, de lunes a viernes y sábados de 07:00 a 11:00 hs.
                        Teléfono: 64-22-15 (Internos 106-107).
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default CertificadoTrabajoPDF;
