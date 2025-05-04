import React from "react";
import { useNavigate } from "react-router-dom";
import "./HorasExtras.css";

const HorasExtras = () => {
    const navigate = useNavigate();

    // Simulación de datos
    const registros = [
        {
            id: 1,
            foto: "/avatar.png",
            documento: "1.234.567",
            nombre: "Juan Jose",
            apellido: "Perez Villar",
            horaSalida: "12:30",
            exonera: "N",
            horasExtras: 0,
        },
        {
            id: 2,
            foto: "/avatar.png",
            documento: "1.234.567",
            nombre: "Juan Jose",
            apellido: "Perez Villar",
            horaSalida: "12:30",
            exonera: "N",
            horasExtras: 0,
        },
        {
            id: 3,
            foto: "/avatar.png",
            documento: "1.234.567",
            nombre: "Juan Jose",
            apellido: "Perez Villar",
            horaSalida: "12:30",
            exonera: "N",
            horasExtras: 0,
        },
        {
            id: 4,
            foto: "/avatar.png",
            documento: "1.234.567",
            nombre: "Juan Jose",
            apellido: "Perez Villar",
            horaSalida: "12:30",
            exonera: "N",
            horasExtras: 0,
        },
    ];

    return (
        <div className="horas-extras-container">
            <h1>Horas Extras</h1>
            <p className="acciones-label">Acciones</p>

            <div className="filtros-horas-extras">
                <div className="acciones-filtros">
                    <input type="date"/>
                    <input type="date"/>
                    <select>
                        <option value="">Mostrar Sello</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="botones-acciones">
                        <button className="btn-volver" onClick={() => navigate("/marcaciones")}>← Volver</button>
                        <button className="btn-agregar" onClick={() => navigate("/marcaciones/horasExtras/abm")}>AGREGAR</button>
                        <button className="btn-exportar">EXPORTAR</button>
                </div>
            </div>

                <table className="tabla-horas-extras">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Foto</th>
                        <th>Nro. de Documento</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Hora de Salida</th>
                        <th>Exon.</th>
                        <th>Horas Extras Planilla</th>
                    </tr>
                    </thead>
                    <tbody>
                    {registros.map((r) => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td><img src={r.foto} alt="Foto"/></td>
                            <td>{r.documento}</td>
                            <td>{r.nombre}</td>
                            <td>{r.apellido}</td>
                            <td>{r.horaSalida}</td>
                            <td>{r.exonera}</td>
                            <td>{r.horasExtras}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            );
            };

            export default HorasExtras;
