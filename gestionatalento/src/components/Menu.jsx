import React, { useState, useEffect, useRef } from "react";
import "./Menu.css";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const Menu = () => {
    const [searchType, setSearchType] = useState("ci");
    const [searchValue, setSearchValue] = useState("");
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [coincidencias, setCoincidencias] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const dropdownRef = useRef(null);
    const [resultados, setResultados] = useState([]);

    const [datosLaborales, setDatosLaborales] = useState(null);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    const handleSearch = async () => {
        try {
            if (searchType === "documento") {
                const response = await axios.get("http://localhost:8080/empleados/obtener/documento/" + searchValue);
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    const empleados = genericResponse.objeto;
                    let resultados = [];
                    resultados = empleados.filter(e =>
                        `${e.persona.nroDocumento}`.toLowerCase().includes(searchValue.toLowerCase())
                        );
                        console.log(resultados);
                    if (resultados.length === 0) {
                        setEmpleadoSeleccionado(null);
                        setCoincidencias([]);
                        setMensaje("No se encontraron coincidencias");
                    } else if (resultados.length === 1) {
                        const empleado = resultados[0];
                        console.log("empleado desde lista: ",empleado);
                        setEmpleadoSeleccionado(empleado);
                        setCoincidencias([]);
                        localStorage.setItem("empleadoBuscado", empleado.codEmpleado);
                    } else {
                        setCoincidencias(resultados);
                        console.log("coincidencias: ", resultados)
                        setEmpleadoSeleccionado(null);
                    }
                } else {
                    toast.error(genericResponse.mensaje, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                
            } else {
                const response = await axios.get("http://localhost:8080/empleados/obtenerLista");
                const genericResponse = response.data;
                if (genericResponse.codigoMensaje == "200") {
                    const empleados = genericResponse.objeto;
                    let resultados = [];
                    resultados = empleados.filter(e =>
                        `${e.persona.nombres} ${e.persona.apellidos}`.toLowerCase().includes(searchValue.toLowerCase())
                        );
                    if (resultados.length === 0) {
                        setEmpleadoSeleccionado(null);
                        setCoincidencias([]);
                        setMensaje("No se encontraron coincidencias");
                    } else if (resultados.length === 1) {
                        const empleado = resultados[0];
                        console.log("empleado desde lista: ",empleado);
                        setEmpleadoSeleccionado(empleado);
                        setCoincidencias([]);
                        localStorage.setItem("empleadoBuscado", empleado.codEmpleado);
                    } else {
                        setCoincidencias(resultados);
                        console.log("coincidencias: ", resultados)
                        setEmpleadoSeleccionado(null);
                    }
                } else {
                    toast.error(genericResponse.mensaje, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
                
            }
        } catch (error) {
            setMensaje("Error en la búsqueda");
            console.error("Error al buscar persona:", error);
        }
    };

    const handleSelect = (empleadoBusqueda) => {
        setEmpleadoSeleccionado(empleadoBusqueda);
        setCoincidencias([]);
        setSearchValue(`${empleadoBusqueda.persona.nombres} ${empleadoBusqueda.persona.apellidos}`);
    };

    // Cerrar dropdown si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setResultados([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSearchValue("");
        setEmpleadoSeleccionado(null);
        setCoincidencias([]);
        setResultados([]);
        setDatosLaborales(null);
    }, [searchType]);
/*
    useEffect(() => {
        const fetchDatosEmpleado = async () => {
            if (!empleadoSeleccionado?.codEmpleado) return;

            try {
                const response = await axios.get(`http://localhost:8080/empleados/obtener/id/${empleadoSeleccionado.codEmpleado}`);
                console.log("empleado obtenido por id: ",response);
                setDatosLaborales(response.data);
            } catch (error) {
                console.error("Error al obtener datos del empleado:", error);
                setDatosLaborales(null);
            }
        };

        fetchDatosEmpleado();
    }, [empleadoSeleccionado]);*/

    const calcularAntiguedad = (fechaIngreso) => {
        if (!fechaIngreso) return "";

        const inicio = new Date(fechaIngreso);
        const hoy = new Date();

        let años = hoy.getFullYear() - inicio.getFullYear();
        let meses = hoy.getMonth() - inicio.getMonth();
        let días = hoy.getDate() - inicio.getDate();

        if (días < 0) {
            meses--;
            const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
            días += ultimoDiaMesAnterior;
        }

        if (meses < 0) {
            años--;
            meses += 12;
        }

        const partes = [];
        if (años > 0) partes.push(`${años} año${años > 1 ? 's' : ''}`);
        if (meses > 0) partes.push(`${meses} mes${meses > 1 ? 'es' : ''}`);
        if (días > 0 || partes.length === 0) partes.push(`${días} día${días > 1 ? 's' : ''}`);

        return partes.join(", ");
    };

    return (
        <div className="main-grid">
            <div className="top-left">
                <h1>Inicio</h1>
                <p className="section-title">Búsqueda de Funcionarios</p>
                <label style={{ fontSize: "22px", marginTop: "20px" }}>
                    <input
                        type="radio"
                        name="search"
                        checked={searchType === "documento"}
                        onChange={() => setSearchType("documento")}
                        style={{ marginLeft: "-80px"}}
                    /> Nro. de Documento
                </label>
                <label style={{ fontSize: "22px", marginTop: "20px" }}>
                    <input
                        type="radio"
                        name="search"
                        checked={searchType === "nombre"}
                        onChange={() => setSearchType("nombre")}
                    /> Nombre
                </label>
                <div style={{position: "relative", width: "100%", maxWidth: "400px"}} ref={dropdownRef}>
                    <input
                        type="text"
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: "10px",
                            borderRadius: "20px",
                            backgroundColor: "#3b3b4f",
                            color: "white",
                            border: "none",
                            marginTop: "20px",
                            fontSize: "23px",
                        }}
                        placeholder="Ingrese búsqueda"
                        className="input"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />

                    {coincidencias.length > 1 && (
                        <div className="dropdown-results">
                            {coincidencias.map((empleadoBusqueda, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(empleadoBusqueda)}
                                >
                                    {empleadoBusqueda.persona.nombres} {empleadoBusqueda.persona.apellidos}. (Ingreso: {empleadoBusqueda.fecIngreso})
                                </li>
                            ))}
                        </div>
                    )}

                    {mensaje && (
                        <div style={{color: "orange", marginTop: "10px"}}>{mensaje}</div>
                    )}
                </div>
            </div>

            <div className="top-right">
                <label style={{fontSize: "30px", fontWeight: "bold", marginBottom: "50px" }}>
                    Información Adicional
                </label>
                <div className="button-row">
                    <button style={{ fontSize: "20px" }}>Datos Personales</button>
                    <button style={{ fontSize: "20px" }}>Datos Laborales</button>
                </div>
                <label style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "50px" }}>
                    Accesos Rápidos
                </label>
                <div className="button-row">
                    <button style={{ fontSize: "20px" }}>Justificativos</button>
                    <button style={{ fontSize: "20px" }}>Vacaciones</button>
                </div>
            </div>

            <div className="bottom-left">
                <div className="data-row">
                    <div className="data-group">
                        <label style={{ fontSize: "23px" }}>Nombre Completo</label>
                        <input
                            style={{ borderRadius: "20px" }}
                            type="text"
                            disabled
                            value={empleadoSeleccionado ? `${empleadoSeleccionado.persona.nombres} ${empleadoSeleccionado.persona.apellidos}` : ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px" }}>Fecha de Ingreso</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={
                                empleadoSeleccionado?.fecIngreso
                                  ? (new Date(empleadoSeleccionado.fecIngreso).getDate()).toString().padStart(2, '0') + "/"
                                    + (new Date(empleadoSeleccionado.fecIngreso).getMonth() + 1).toString().padStart(2, '0') + "/"
                                    + new Date(empleadoSeleccionado.fecIngreso).getFullYear()
                                  : ""
                                } />
                    </div>
                </div>
                <div className="data-row">
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Área de Desempeño</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={empleadoSeleccionado?.cargo?.departamento?.descripcion || ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Fecha de Egreso</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={
                                empleadoSeleccionado?.fecEgreso
                                  ? (new Date(empleadoSeleccionado.fecEgreso).getDate()).toString().padStart(2, '0') + "/"
                                    + (new Date(empleadoSeleccionado.fecEgreso).getMonth() + 1).toString().padStart(2, '0') + "/"
                                    + new Date(empleadoSeleccionado.fecEgreso).getFullYear()
                                  : ""
                                } />
                    </div>
                </div>
                <div className="data-row">
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Cargo</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={empleadoSeleccionado?.cargo?.descripcion || ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Antigüedad</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={calcularAntiguedad(empleadoSeleccionado?.fecIngreso)}
                        />
                    </div>
                </div>
            </div>

            <div className="bottom-right">
                <label style={{ fontSize: "23px", fontWeight: "bold" }}>Comentarios</label>
                <div>
                    <textarea
                        style={{ width: "96%", height: "200px", resize: "none" }}
                        disabled
                        value={empleadoSeleccionado?.poseeDiscapacidad === 'S'
                            ? `Discapacidad: ${empleadoSeleccionado.descripcionDiscapacidad || "No especificado"}`
                            : "Sin discapacidad"}

                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Menu;
