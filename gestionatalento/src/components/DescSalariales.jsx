import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DescSalariales.css";
import axios from "axios";

const DescuentosSalariales = () => {

    const [descuentos, setDescuentos] = useState([]);
    const navigate = useNavigate();

    const fetchDescuentos = async () => {
        try {
            const response = await axios.get('http://localhost:8080/descuentos-salariales/obtenerLista');
            console.log(response.data.objeto);
            setDescuentos(response.data.objeto || []);
        } catch (error) {
            console.error("Error al obtener descuentos:", error);
            setDescuentos([]);
        }
    };

    useEffect(() => {
        fetchDescuentos();
    }, []);

    return (
        <div className="descuentos-container">
            <h1>Descuentos Salariales</h1>
            <p className="acciones-title">Acciones</p>


            <div className="acciones-top-row">
                <button className="btn-agregar" onClick={() => navigate("/descuentos/abm")}>AGREGAR</button>
                <select className="select-mes">
                    <option>Enero</option>
                    <option>Febrero</option>
                </select>
                <button className="btn-buscar">BUSCAR</button>
            </div>
            <div className="acciones-buttons">
            <button>EXPORTAR MARCACIONES</button>
                <button>EXONERADOS</button>
                <button>EXPORTAR BORRADOR</button>
                <button>EXPORTAR RECIBIDOS</button>
            </div>

            <table className="tabla-descuentos">
                <thead>
                <tr>
                    <th>Periodo</th>
                    <th>C.I Nro.</th>
                    <th>Nombre Completo</th>
                    <th>Asignación</th>
                    <th>Ent. Tardías</th>
                    <th>Sal. Anticip.</th>
                    <th>Ausencias</th>
                    <th>Monto Descuento</th>
                    <th>Dependencia</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {descuentos.map((d, index) => (
                    <tr key={index}>
                        <td>{d.codPeriodo}</td>
                        <td>{d.empleado.persona.nroDocumento}</td>
                        <td>{(d.empleado.persona.nombres || "") + " " + (d.empleado.persona.apellidos || "")}</td>
                        <td>{d.empleado.asignacion}</td>
                        <td>{d.entradaTardia}</td>
                        <td>{d.salidaAnticipada}</td>
                        <td>{d.ausencia}</td>
                        <td>{d.monto}</td>
                        <td>{d.empleado.cargo.departamento.direccion.descripcion}</td>
                        <td></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DescuentosSalariales;
