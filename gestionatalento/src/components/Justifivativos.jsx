import React, { useState, useEffect } from "react";
import "./Justificativos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Justificativos = () => {
    const navigate = useNavigate();
    const [justificativos, setJustificativos] = useState([]);
    const [mes, setMes] = useState("Enero");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const irAAbmJustificativos = () => {
        navigate("/justificativos/abm");
    };

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const mesesNumericos = {
        Enero: "01",
        Febrero: "02",
        Marzo: "03",
        Abril: "04",
        Mayo: "05",
        Junio: "06",
        Julio: "07",
        Agosto: "08",
        Septiembre: "09",
        Octubre: "10",
        Noviembre: "11",
        Diciembre: "12",
    };

    const anios = Array.from(
        { length: 30 },
        (_, i) => new Date().getFullYear() + 2 - i
    );

    const fetchJustificativos = async () => {
        const periodo = `${anio}${mesesNumericos[mes]}`;
        try {
            const response = await axios.get(
                'http://localhost:8080/justificativos/obtenerListaJustificativos'
            );
            console.log(response.data.objeto);
            setJustificativos(response.data.objeto || []);
        } catch (error) {
            console.error("Error al obtener justificativos:", error);
            setJustificativos([]);
        }
    };

    useEffect(() => {
        fetchJustificativos();
    }, []);

    return (
        <div className="justificativos-container">
            <div className="cabecera-justificativos">
                <h1>Justificativos</h1>
                <p className="acciones-title">Acciones</p>

                <div className="acciones-barra">
                    <button className="boton-accion" onClick={irAAbmJustificativos}>
                        AGREGAR
                    </button>

                    <select
                        className="select-mes"
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                    >
                        {meses.map((m) => (
                            <option key={m} value={m}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        className="select-anio"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear() + 10}
                    />

                    <button className="boton-buscar" onClick={fetchJustificativos}>
                        BUSCAR
                    </button>
                </div>
            </div>

            <table className="tabla-justificativos">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>C.I Nro.</th>
                    <th>Nombre Completo</th>
                    <th>Tipo Justificativo</th>
                    <th>Descripcion</th>
                </tr>
                </thead>
                <tbody>
                {justificativos.map((j, index) => (
                    <tr key={index}>
                        <td>{j.nroJustificativo}</td>
                        <td>{j.fecha}</td>
                        <td>{j.persona.nroDocumento}</td>
                        <td>{(j.persona.nombres || "") + " " + (j.persona.apellidos || "")}</td>
                        <td>{j.tipoJustificativo.descripcion}</td>
                        <td>{j.descripcion}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Justificativos;
