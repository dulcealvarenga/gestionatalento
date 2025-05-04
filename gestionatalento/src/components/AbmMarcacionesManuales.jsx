import React, { useState }  from "react";
import "./AbmMarcacionesManuales.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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

    const [nroDocumento, setNroDocumento] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");

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
        setNroDocumento("");
        setNombres("");
        setApellidos("");
        setFechaDesde("");
        setFechaHasta("");
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


    return (
        <div className="marcaciones-container">
            <h1>Marcaciones Manuales</h1>
            <p className="volver-btn" onClick={() => navigate(-1)}>← Volver</p>

            <div className="form-card-marc">
                <div className="fila-superior">
                    <div className="campo">
                        <label>Nro. de Documento</label>
                        <input type="text" value={nroDocumento} onChange={(e) => setNroDocumento(e.target.value)}/>
                    </div>
                    <div className="campo">
                    <label>Nombres</label>
                        <input type="text" value={nombres} onChange={(e) => setNombres(e.target.value)}/>
                    </div>
                    <div className="campo">
                    <label>Apellidos</label>
                        <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)}/>
                    </div>
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
                                            toast.error("¡Listo! Se completaron todas las fechas", {
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
                    <button className="btn-agregar">AGREGAR</button>
                </div>
                <ToastContainer/>
            </div>

        </div>
    );
};

export default MarcacionesManuales;
