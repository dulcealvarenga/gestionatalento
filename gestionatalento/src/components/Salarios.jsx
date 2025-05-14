// src/components/Salaries.jsx
import React from 'react';
import './Salarios.css';
import { FaEdit } from 'react-icons/fa';

const Salarios = () => {
    return (
        <div className="salaries-container">
            <h1>Salarios</h1>

            <div className="actions-section">
                <button className="primary-btn">AGREGAR SALARIOS</button>
                <button className="primary-btn">INCLUIR AGUINALDO</button>

                <div className="search-group">
                    <select>
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                        {/* otros meses */}
                    </select>
                    <button className="primary-btn">Buscar</button>
                </div>
            </div>

            <div className="export-section">
                <h3>Exportar planilla de salarios</h3>
                <div className="export-group">
                    <select>
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                    </select>
                    <button className="primary-btn">Generar</button>
                    <button className="primary-btn">Exportar Aguinaldo</button>
                </div>
            </div>

            <div className="aditional-section">
                <h3>Adicionales</h3>
                <div className="aditional-buttons">
                    <button className="primary-btn">Altas</button>
                    <button className="primary-btn">Bajas</button>
                    <button className="primary-btn">Modificaciones</button>
                </div>
            </div>

            <table className="salaries-table">
                <thead>
                <tr>
                    <th>C.I Nro.</th>
                    <th>Nombre Completo</th>
                    <th>Cargo</th>
                    <th>Grado Salarial</th>
                    <th>Asig. Salarial</th>
                    <th>Obj. de Gasto</th>
                    <th>Programa</th>
                    <th>Situación Laboral</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {[1, 2].map((row, index) => (
                    <tr key={index}>
                        <td>1.234.567</td>
                        <td>Juan Perez</td>
                        <td>Asesor de Obras</td>
                        <td>2,000,000</td>
                        <td>2,000,000</td>
                        <td>Honorarios Profesionales</td>
                        <td>Ejecutivo Principal</td>
                        <td>Contratado</td>
                        <td><FaEdit className="edit-icon" /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Salarios;
