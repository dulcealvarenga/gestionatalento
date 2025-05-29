import React, { useState } from 'react';
import './DashKPI.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";

Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const KPI = () => {
    const [direccion, setDireccion] = useState('');
    const [departamento, setDepartamento] = useState('');
    const navigate = useNavigate();

    // Datos de ejemplo (puedes reemplazar por datos reales)
    const dataKPI = {
        rotacion: 12.5,
        puntualidad: 85,
        ausencias: 5
    };

    const kpiTotal = ((dataKPI.puntualidad + (100 - dataKPI.rotacion) + (dataKPI.ausencias/100)) / 3).toFixed(2);

    const barData = {
        labels: ['Rotación', 'Puntualidad', 'Ausencias'],
        datasets: [{
            label: 'Indicadores (%)',
            data: [dataKPI.rotacion, dataKPI.puntualidad, dataKPI.cumplimiento],
            backgroundColor: ['#f94144', '#90be6d', '#577590']
        }]
    };

    const doughnutData = {
        labels: ['Asistencias Imprevistas', 'Días Trabajados'],
        datasets: [{
            data: [dataKPI.ausencias, 100 - dataKPI.ausencias],
            backgroundColor: ['#f3722c', '#43aa8b']
        }]
    };

    return (
        <div className="kpi-container">
            <h1>Indicador Clave de Desempeño (KPI)</h1>
            <div className="volver" onClick={() => navigate("/dashboard")}>← Volver</div>
            <div className="filtros">
                <select value={direccion} onChange={e => setDireccion(e.target.value)}>
                    <option value="">Seleccionar Dirección</option>
                    <option value="1">Direccion de Transito</option>
                    <option value="2">Direccion de PMT</option>
                </select>

                <select value={departamento} onChange={e => setDepartamento(e.target.value)}>
                    <option value="">Seleccionar Departamento</option>
                    <option value="1">Departamento de Transito</option>
                    <option value="2">Departamento de PMT</option>
                </select>
            </div>

            <div className="indicadores">
                <div className="indicador">
                    <h3>Rotación</h3>
                    <p>{dataKPI.rotacion}%</p>
                </div>
                <div className="indicador">
                    <h3>Puntualidad</h3>
                    <p>{dataKPI.puntualidad}%</p>
                </div>
                <div className="indicador">
                    <h3>Ausencias No Planificadas</h3>
                    <p>{dataKPI.ausencias}%</p>
                </div>
                <div className="kpi-final">
                    <h3>KPI Final</h3>
                    <p>{kpiTotal}%</p>
                </div>
            </div>

            <div className="graficos-kpi">
                <div className="grafico-kpi">
                    <Bar data={barData}/>
                </div>
                <div className="grafico-kpi">
                    <Doughnut
                        data={doughnutData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '50%', // Grosor del donut
                            plugins: {
                                legend: {
                                    position: 'right',
                                    align: 'center',
                                    labels: {
                                        color: 'white',
                                        font: {
                                            size: 16
                                        },
                                        padding: 10,
                                        usePointStyle: true
                                    }
                                }
                            },

                        }}
                    />

                </div>
            </div>
        </div>
    );
};

export default KPI;
