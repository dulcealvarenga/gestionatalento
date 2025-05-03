// Actualizado Vacaciones.jsx para consumir API backend
import React, { useState, useEffect } from "react";
import "./Vacaciones.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Vacaciones = () => {
    const navigate = useNavigate();
    const [vacaciones, setVacaciones] = useState([]);
    const [mes, setMes] = useState("Enero");
    const [anio, setAnio] = useState(new Date().getFullYear());

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

    const fetchVacaciones = async () => {
        const periodo = `${anio}${mesesNumericos[mes]}`;
        try {
            const response = await axios.get(
                `http://localhost:8080/vacaciones?periodo=${periodo}`
            );
            setVacaciones(response.data.objeto || []);
        } catch (error) {
            alert("Error al obtener vacaciones: " + error.message);
        }
    };

    useEffect(() => {
        fetchVacaciones();
    }, []);

    return (
        <div className="vacaciones-container">
            <div className="cabecera-vacaciones">
                <h1>Vacaciones</h1>
                <p className="acciones-title">Acciones</p>
                <div className="acciones-barra">
                    <button
                        className="boton-accion"
                        onClick={() => navigate("/abmVacaciones")}
                    >
                        AGREGAR
                    </button>
                    <select
                        className="select-mes"
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                    >
                        {meses.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="select-anio"
                        value={anio}
                        onChange={(e) => setAnio(e.target.value)}
                    >
                        {anios.map((a) => (
                            <option key={a}>{a}</option>
                        ))}
                    </select>
                    <button className="boton-buscar" onClick={fetchVacaciones}>
                        BUSCAR
                    </button>
                </div>
            </div>
            <table className="tabla-vacaciones">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>C.I Nro.</th>
                    <th>Nombre Completo</th>
                    <th>Dependencia</th>
                    <th>Anulado</th>
                    <th>Descripción</th>
                </tr>
                </thead>
                <tbody>
                {vacaciones.map((v, index) => (
                    <tr key={index}>
                        <td>{v.id}</td>
                        <td>{v.fecha}</td>
                        <td>{v.ci}</td>
                        <td>{v.nombreCompleto}</td>
                        <td>{v.dependencia}</td>
                        <td>{v.anulado}</td>
                        <td>{v.descripcion}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Vacaciones;
