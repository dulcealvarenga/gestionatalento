import React from "react";
import { useNavigate } from "react-router-dom";
import "./DescSalariales.css";

const DescuentosSalariales = () => {

    const navigate = useNavigate();

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
                    <th>Dependencia</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>2024/10</td>
                    <td>1.234.567</td>
                    <td>Juan Perez</td>
                    <td>4,451,243</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>Junta Municipal</td>
                    <td>
                        <span
                            className="editar-icon"
                            title="Editar"
                        >&#9998;</span>
                    </td>
                </tr>
                {/* Agregá más filas si querés */}
                </tbody>
            </table>
        </div>
    );
};

export default DescuentosSalariales;
