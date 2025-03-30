import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2"; // Importamos el gráfico de barras de Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { FaUserPlus, FaUserTimes, FaUserEdit } from 'react-icons/fa';
import "./dashboardemp.css";

// Registramos los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [altas, setAltas] = useState([]);
    const [bajas, setBajas] = useState([]);
    const [modificaciones, setModificaciones] = useState([]);

    useEffect(() => {
        axios.get("/public/datos.json")
            .then(response => {
                setAltas(response.data.altas || []); // Asegura que no sea undefined
                setBajas(response.data.bajas || []);
                setModificaciones(response.data.modificaciones || []);
            })
            .catch(error => {
                console.error("Error al cargar los datos", error);
                setAltas([]); // Evita errores si falla la carga
                setBajas([]);
                setModificaciones([]);
            });
    }, []);


    // Configuración del gráfico de barras
    const data = {
        labels: ['Altas', 'Bajas', 'Modificaciones'], // Etiquetas
        datasets: [
            {
                label: 'Empleados',
                data: [altas.length, bajas.length, modificaciones.length], // Cantidad de empleados por tipo
                backgroundColor: ['#4caf50', '#f44336', '#ff9800'], // Colores para cada barra
                borderRadius: 8,
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard de Empleados</h2>

            {/* Gráfico de barras */}
            <div className="chart-container">
                <Bar data={data} />
            </div>

            {/* Iconos para Altas, Bajas y Modificaciones */}
            <div className="dashboard-stats">
                <div className="stat-item">
                    <FaUserPlus size={30} color="#4caf50" />
                    <p>Altas: {altas.length}</p>
                </div>
                <div className="stat-item">
                    <FaUserTimes size={30} color="#f44336" />
                    <p>Bajas: {bajas.length}</p>
                </div>
                <div className="stat-item">
                    <FaUserEdit size={30} color="#ff9800" />
                    <p>Modificaciones: {modificaciones.length}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
