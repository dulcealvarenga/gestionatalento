// src/components/FichaEmpleadoPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#003366',
        fontFamily: 'Times-Roman',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#333333',
        fontFamily: 'Helvetica',
    },
    sectionCI: {
        marginVertical: 10,
        fontSize: 13,
        fontWeight: 'black',
        fontFamily: 'Helvetica',
    },
    section: {
        marginVertical: 10,
        border: '1px solid #eee',
        borderRadius: 4
    },
    label: {
        fontWeight: 'bold',
        fontFamily: 'Helvetica',
    },
    field: {
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    labelCell: {
        width: '40%',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#003366',
        backgroundColor: '#f9f9f9',
        paddingRight: 8,
    },
    valueCell: {
        width: '60%',
        fontSize: 11,
        color: '#000',
    },
    valueCell1: {
        width: '100%',
        fontSize: 11,
        color: '#000',
    },
    header: {
        fontSize: 14,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#004b8d',
        fontFamily: 'Helvetica',
    },
    referenciaBox: {
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 6,
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },

    referenciaIcono: {
        fontSize: 12,
        marginRight: 6,
        color: '#004b8d',
    },

    experienciaBox: {
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 6,
    },

    logoContainer: {
        marginTop: 12,
        alignItems: 'flex-end',
    },
});

const FichaEmpleadoPDF = ({ empleado }) => {
    const persona = empleado.persona;

    const getDescripcionPaises = (codigo) => {
        switch (codigo) {
            case 1: return 'PARAGUAY';
            case 2: return 'ARGENTINA';
            case 3: return 'ESTADOS UNIDOS';
        }
    };

    const getDescripcionEstudio = (codigo) => {
        switch (codigo) {
            case 'S': return 'SECUNDARIO';
            case 'P': return 'PRIMARIO';
            case 'U': return 'UNIVERSITARIO';
            case 'B': return 'BACHILLER';
            case 'M': return 'MAESTRÍA';
            case 'D': return 'DOCTORADO';
            default: return 'NO ESPECIFICADO';
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <Text style={styles.title}>LEGAJO DE FUNCIONARIO</Text>
                <Text style={styles.subtitle}>DIRECCIÓN DE GESTIÓN Y DESARROLLO DE PERSONAS</Text>
                <View style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#004b8d',
                    marginBottom: 12,
                }} />

                <Text style={styles.field}><Text style={styles.sectionCI}>C.I. Nº</Text> {persona.nroDocumento}</Text>

                <View style={styles.section}>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Nombre Completo</Text>
                        <Text style={styles.valueCell}>{persona.nombres.toUpperCase()} {persona.apellidos.toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Fecha de Ingreso</Text>
                        <Text style={styles.valueCell}>{empleado.fecIngreso}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Cargo</Text>
                        <Text style={styles.valueCell}>{empleado.cargo.descripcion}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Situacion Laboral</Text>
                        <Text style={styles.valueCell}>{empleado.situacionLaboral.descripcion}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Fecha de Nacimiento</Text>
                        <Text style={styles.valueCell}>{persona.fecNacimiento}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Pais de Nacimiento</Text>
                        <Text style={styles.valueCell}>{getDescripcionPaises(persona.codPaisNacimiento)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Lugar de Nacimiento</Text>
                        <Text style={styles.valueCell}>{persona.lugarNacimiento.toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Direccion</Text>
                        <Text style={styles.valueCell}>CALLE 1 CASI CALLE 2</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Telefono</Text>
                        <Text style={styles.valueCell}>0991 234 567</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Estado Civil</Text>
                        <Text style={styles.valueCell}>{persona.estadoCivil.descripcion}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.labelCell}>Estudios Culminados</Text>
                        <Text style={styles.valueCell}>{getDescripcionEstudio(empleado.persona.codNivelEstudio)}</Text>
                    </View>
                </View>

                {/* REFERENCIAS */}
                <Text style={styles.header}>REFERENCIAS</Text>
                <View style={styles.referenciaBox}>
                    <Image
                        src="/telef.png"  // si está en /public/logo.png
                        style={{ width: 12, height: 12, marginRight: 12 }}
                    />
                    <Text style={styles.valueCell}>LAURA CALCENA | 0983315795</Text>
                </View>

                {/* EXPERIENCIA LABORAL */}
                <Text style={styles.header}>EXPERIENCIA LABORAL</Text>
                <View style={styles.experienciaBox}>
                    <Image
                        src="/calendario.png"  // si está en /public/logo.png
                        style={{ width: 16, height: 12, marginRight: 12 }}
                    />
                    <Text style={styles.valueCell1}>Junta de Gobierno | Cargo: CONTABILIDAD Y ADMINISTRACIÓN</Text>
                </View>

                <Text style={{ marginTop: 30, fontSize: 10, textAlign: 'center', color: '#666' }}>
                    Documento generado automáticamente por el sistema de gestión de personas.
                </Text>
            </Page>
        </Document>
    );
};

export default FichaEmpleadoPDF;
