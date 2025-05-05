import React, { useState }  from "react";
import "./AbmMarcacionesManuales.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from "axios";

const MarcacionesManuales = () => {

    const navigate = useNavigate();

    const [mostrarCampos, setMostrarCampos] = useState(false);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [fechasRango, setFechasRango] = useState([]);
    const [indiceActual, setIndiceActual] = useState(0);
    const [entrada, setEntrada] = useState("");
    const [salida, setSalida] = useState("");
    const [registros, setRegistros] = useState([]);

    const [modoEdicion, setModoEdicion] = useState(false);
    const [indiceEditando, setIndiceEditando] = useState(null);

    const [formData, setFormData] = useState({
        nroDocumento: "",
        nombres: "",
        apellidos: "",
        fechaDesde: "",
        fechaHasta: "",
        entrada: "",
        salida: "",
    });

    const handleBuscarPorDocumento = async () => {
        const nroDocumento = formData.nroDocumento;
        if (!nroDocumento) return;
        try {
            const response = await axios.get('http://localhost:8080/personas/obtener/documento/' + nroDocumento);
            if (response.data.codigoMensaje === "200") {
                toast.success("Persona encontrada", { autoClose: 2000 });
                const persona = response.data.objeto;
                localStorage.setItem('codPersona', persona.codPersona);
                setFormData(prev => ({
                    ...prev,
                    nombres: persona.nombres || '',
                    apellidos: persona.apellidos || '',
                    nroRuc: persona.nroRuc || '',
                    fecNacimiento: persona.fecNacimiento || '',
                    codNivelEstudio: persona.codNivelEstudio || '',
                    poseeDiscapacidad: persona.poseeDiscapacidad === "S",
                    descripcionDiscapacidad: persona.descripcionDiscapacidad || '',
                    direccionParticular: persona.direccionParticular || '',
                    codEstadoCivil: persona.estadoCivil?.codEstadoCivil || '',
                    lugarNacimiento: persona.lugarNacimiento || '',
                    telefono: persona.telefono || '',
                    correo: persona.correo || ''
                }));
            } else {
                toast.info("No se encontró la persona registrada, avanzar con el registro", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error al buscar persona:", error);
            toast.error("Error al buscar persona", { autoClose: 2000 });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generarRangoFechas = (desde, hasta) => {
        const resultado = [];
        let actual = new Date(desde);
        const fin = new Date(hasta);

        while (actual <= fin) {
            resultado.push(actual.toISOString().split("T")[0]);
            actual.setDate(actual.getDate() + 1);
        }

        return resultado;
    };

    const handleListarFechas = () => {
        if (!fechaDesde || !fechaHasta) {
            toast.error("No se ingreso Fecha Desde ni Fecha Hasta", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        // Si ya hay fechas generadas, solo alternar visibilidad
        if (fechasRango.length > 0) {
            setMostrarCampos(!mostrarCampos); // Solo mostrar/ocultar
            return;
        }

        // Si no hay fechas generadas aún, generarlas
        const rango = generarRangoFechas(fechaDesde, fechaHasta);
        setFechasRango(rango);
        setIndiceActual(0);
        setRegistros([]);
        setEntrada("");
        setSalida("");
        setMostrarCampos(true); // Mostrar campos
    };


    // Reemplaza handleGuardarFecha:
    const handleGuardarFecha = () => {

        const nuevaEntrada = {
            fecha: fechasRango[modoEdicion ? indiceEditando : indiceActual],
            entrada,
            salida,
        };

        if (!entrada || !salida) {
            toast.error("Falta completar Entrada y Salida", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }
        setEntrada("");
        setSalida("");

        if (modoEdicion) {
            const copia = [...registros];
            copia[indiceEditando] = nuevaEntrada;
            setRegistros(copia);
            setModoEdicion(false);
            setIndiceEditando(null);
        } else {
            setRegistros([...registros, nuevaEntrada]);
            if (indiceActual < fechasRango.length - 1) {
                setIndiceActual(indiceActual + 1);
            } else {
                toast.error("Se completaron todas las fechas", {
                    position: "top-right",
                    autoClose: 2500,
                });
            }
        }

        setEntrada("");
        setSalida("");

    };

    // Evento al hacer clic en un registro
    const handleEditarRegistro = (index) => {
        const registro = registros[index];
        setEntrada(registro.entrada);
        setSalida(registro.salida);
        setModoEdicion(true);
        setIndiceEditando(index);
    };

    const MySwal = withReactContent(Swal);

    const handleEliminarRegistro = (index) => {
        MySwal.fire({
            title: '¿Eliminar registro?',
            text: 'Esta acción no se puede deshacer. ¿Estás seguro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#D9534F',
            cancelButtonColor: '#6C757D',
            background: '#3d3f5a',
            color: '#FFFFFF',
            didOpen: () => {
                const icon = document.querySelector('.swal2-icon.swal2-warning');
                if (icon) {
                    icon.style.borderColor = '#FFFFFF'; // círculo
                    icon.style.color = '#FFFFFF';       // signo de exclamación
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const copia = [...registros];
                copia.splice(index, 1);
                setRegistros(copia);

                if (modoEdicion && indiceEditando === index) {
                    setModoEdicion(false);
                    setIndiceEditando(null);
                    setEntrada("");
                    setSalida("");
                }
            }
        });
    };

    const handleLimpiar = () => {
        setFormData({
            nroDocumento: "",
            nombres: "",
            apellidos: "",
            fechaDesde: "",
            fechaHasta: "",
            mostrarSello: "",
            mostrarExtras: "",
            limiteExtras: "",
            exoneracionEntrada: "",
            entrada: "",
            salida: "",
        });
        setFechasRango([]);
        setIndiceActual(0);
        setEntrada("");
        setSalida("");
        setRegistros([]);
        setMostrarCampos(false);
        setModoEdicion(false);
        setIndiceEditando(null);

        toast.info("Formulario limpio", {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const handleEnviarAlBackend = async () => {
        const codPersona = localStorage.getItem('codPersona');

        if (!codPersona) {
            toast.error("No se encontró codPersona en localStorage");
            return;
        }

        if (registros.length === 0) {
            toast.info("No hay registros para enviar");
            return;
        }

        const body = {
            nroMarcacion: null,
            persona: {
                codPersona: parseInt(codPersona)
            },
            marcacion: registros.map(r => {
                return r.entrada && r.salida
                    ? [
                        `${r.fecha}T${r.entrada}`,
                        `${r.fecha}T${r.salida}`
                    ]
                    : [];
            }).flat()
        };

        try {
            const response = await axios.post('http://localhost:8080/marcaciones/manuales/crear', body);
            if (response.data.codigoMensaje === "200") {
                toast.success("Marcaciones enviadas con éxito", { autoClose: 2000 });
                handleLimpiar();
            } else {
                toast.error("Error al guardar marcaciones: " + response.data.mensaje);
            }
        } catch (error) {
            console.error("Error al enviar marcaciones:", error);
            toast.error("Error al enviar marcaciones");
        }
    };

    return (
        <div className="marcaciones-container">
            <h1>Marcaciones Manuales</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>

            <div className="form-card-marc">
                <div className="fila-superior">
                    <div className="campo">
                        <label>Nro. de Documento</label>
                        <input
                            type="text"
                            name="nroDocumento"
                            value={formData.nroDocumento}
                            onChange={handleChange}
                            onBlur={handleBuscarPorDocumento}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleBuscarPorDocumento();
                                }
                            }}
                            required
                        /></div>
                    <div className="campo">
                    <label>Nombres</label>
                        <input name="nombres" value={formData.nombres} onChange={handleChange}/>
                    </div>
                    <div className="campo">
                    <label>Apellidos</label>
                        <input name="apellidos" value={formData.apellidos}
                               onChange={handleChange}/></div>
                </div>

                <div className="fila-superior">
                    <div className="campo">
                        <label>Fecha Desde</label>
                        <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)}/>
                    </div>
                    <div className="campo">
                        <label>Fecha Hasta</label>
                        <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)}/>
                    </div>
                    <div className="campo">
                        <label>&nbsp;</label>
                        <button className="btn-listar" onClick={handleListarFechas}>
                            {mostrarCampos ? 'OCULTAR FECHAS' : 'LISTAR FECHAS'}
                        </button>
                    </div>
                </div>
                {mostrarCampos && fechasRango.length > 0 && indiceActual < fechasRango.length && (
                    <div style={{marginTop: "-10px", fontSize: "18px"}}>
                        <h3>Fecha: {fechasRango[indiceActual]}</h3>
                        <label style={{fontSize: "18px"}}>Entrada: </label>
                        <input
                            type="time"
                            value={entrada}
                            onChange={(e) => setEntrada(e.target.value)}
                        />
                        <label>Salida: </label>
                        <input
                            type="time"
                            value={salida}
                            onChange={(e) => {
                                const nuevaSalida = e.target.value;
                                setSalida(nuevaSalida);
                                if (nuevaSalida && entrada) {
                                    setTimeout(() => {
                                        setRegistros((prev) => [
                                            ...prev,
                                            {
                                                fecha: fechasRango[indiceActual],
                                                entrada,
                                                salida: nuevaSalida,
                                            },
                                        ]);
                                        setEntrada("");
                                        setSalida("");
                                        if (indiceActual < fechasRango.length - 1) {
                                            setIndiceActual(indiceActual + 1);
                                        } else {
                                            toast.success("¡Listo! Se completaron todas las fechas", {
                                                position: "top-right",
                                                autoClose: 2500,
                                            });
                                        }
                                    }, 300); // Espera leve para que el cambio de estado no corte el input
                                }
                            }}
                        />
                        <button onClick={handleGuardarFecha}>Guardar</button>
                    </div>
                )}

                <div className="registro-scroll">
                    <ul>
                        {registros.map((r, i) => (
                            <li
                                key={i}
                                style={{
                                    cursor: "pointer",
                                    color: modoEdicion && i === indiceEditando ? "orange" : "white"
                                }}
                                onClick={() => handleEditarRegistro(i)}
                                onDoubleClick={() => handleEliminarRegistro(i)}
                            >

                                {r.fecha} → {r.entrada} - {r.salida}
                                {modoEdicion && i === indiceEditando && " (editando)"}
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="acciones-man">
                    <button className="btn-limpiar" onClick={handleLimpiar}>LIMPIAR</button>
                    <button className="btn-agregar" onClick={handleEnviarAlBackend}>AGREGAR</button>
                </div>
                <ToastContainer/>
            </div>

        </div>
    );
};

export default MarcacionesManuales;
