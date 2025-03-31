import React, { useState, useEffect, useRef } from "react";
import "./Menu.css";
import axios from "axios";

const Menu = () => {
    const [searchType, setSearchType] = useState("ci");
    const [searchValue, setSearchValue] = useState("");
    const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
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
            const response = await axios.get("http://localhost:8080/api/v1/Persona/consultaPersona");
            const personas = response.data;

            let resultados = [];

            if (searchType === "documento") {
                resultados = personas.filter(p => p.nroDocumento === searchValue);
            } else {
                resultados = personas.filter(p =>
                    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchValue.toLowerCase())
                );
            }

            if (resultados.length === 0) {
                setPersonaSeleccionada(null);
                setCoincidencias([]);
                setMensaje("No se encontraron coincidencias");
            } else if (resultados.length === 1) {
                setPersonaSeleccionada(resultados[0]);
                setCoincidencias([]);
                localStorage.setItem("personaBuscada", resultados[0].codPersona);
                console.log("Persona ", resultados[0].codPersona);
            } else {
                setCoincidencias(resultados);
                setPersonaSeleccionada(null);
            }

        } catch (error) {
            setMensaje("Error en la búsqueda");
            console.error("Error al buscar persona:", error);
        }
    };

    const handleSelect = (persona) => {
        setPersonaSeleccionada(persona);
        setCoincidencias([]);
        setSearchValue(`${persona.nombre} ${persona.apellido}`);
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
        setPersonaSeleccionada(null);
        setCoincidencias([]);
        setResultados([]);
        setDatosLaborales(null);
    }, [searchType]);

    useEffect(() => {
        const fetchDatosEmpleado = async () => {
            if (!personaSeleccionada?.codPersona) return;

            try {
                const response = await axios.get(`http://localhost:8080/empleados/buscar/Empleado/${personaSeleccionada.codPersona}`);
                setDatosLaborales(response.data);
            } catch (error) {
                console.error("Error al obtener datos del empleado:", error);
                setDatosLaborales(null);
            }
        };

        fetchDatosEmpleado();
    }, [personaSeleccionada]);

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
                    /> Nro. de Documento
                </label>
                <label style={{ fontSize: "22px", marginTop: "20px", margin: "35px" }}>
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
                            {coincidencias.map((persona, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(persona)}
                                >
                                    {persona.nombres} {persona.apellidos}
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
                            value={personaSeleccionada ? `${personaSeleccionada.nombres} ${personaSeleccionada.apellidos}` : ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px" }}>Fecha de Ingreso</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={datosLaborales?.fecIngreso || ""} />
                    </div>
                </div>
                <div className="data-row">
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Área de Desempeño</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={datosLaborales?.cargo?.departamento?.descripcion || ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Fecha de Egreso</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={datosLaborales?.fecEgreso || ""} />
                    </div>
                </div>
                <div className="data-row">
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Cargo</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={datosLaborales?.cargo?.descripcion || ""}
                        />
                    </div>
                    <div className="data-group">
                        <label style={{ fontSize: "23px", marginTop: "20px" }}>Antigüedad</label>
                        <input style={{ borderRadius: "20px" }}
                               type="text"
                               disabled
                               value={calcularAntiguedad(datosLaborales?.fecIngreso)}
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
                        value={personaSeleccionada?.poseeDiscapacidad === 'S'
                            ? `Discapacidad: ${personaSeleccionada.descripcionDiscapacidad || "No especificado"}`
                            : "Sin discapacidad"}

                    />
                </div>
            </div>
        </div>
    );
};

export default Menu;
