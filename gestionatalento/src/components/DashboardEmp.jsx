import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';
import { FaUsers, FaArrowDown, FaArrowUp, FaUserEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import "./dashboardemp.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
    const [altas, setAltas] = useState([]);
    const [bajas, setBajas] = useState([]);
    const [meses, setMeses] = useState([]);
    const [modificaciones, setModificaciones] = useState([]);
    const [ultimosMovimientos, setUltimosMovimientos] = useState([]);
    const [topModificadores, setTopModificadores] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function cargarDatos() {
            try {
                // Llamada al JSON local
                const res = await axios.get("/datos.json");
                const data = res.data;

                // Llamada a tu API
                const response = await axios.get(`${API_BASE_URL}empleados/dashboard/obtenerNovedades`);
                const datas = response.data;

                // Parsear datos para el gráfico
                const labels = datas.map(item => item.mes);
                const altas = datas.map(item => item.cantidadAltas);
                const bajas = datas.map(item => item.cantidadBajas);

                // Guardar los datos
                setAltas(altas || []);
                setBajas(bajas || []);
                setMeses(labels || []);
                setModificaciones(data.modificaciones || []);

                // Últimos movimientos
                const ultimos = [
                    ...(data.altas || []),
                    ...(data.bajas || []),
                    ...(data.modificaciones || [])
                ]
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .slice(0, 5);

                setUltimosMovimientos(ultimos);

                // Top modificadores
                const usuariosMod = {};
                (data.modificaciones || []).forEach(mod => {
                    usuariosMod[mod.nombre] = (usuariosMod[mod.nombre] || 0) + 1;
                });

                const topUsuarios = Object.entries(usuariosMod)
                    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
                    .sort((a, b) => b.cantidad - a.cantidad)
                    .slice(0, 5);

                setTopModificadores(topUsuarios);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        }

        cargarDatos(); // Ejecutar la función
    }, []);

    const chartData = {
        labels: meses,
        datasets: [
            {
                label: 'Altas',
                data: altas,
                borderColor: '#4f83ff',
                tension: 0.3,
            },
            {
                label: 'Bajas',
                data: bajas,
                borderColor: '#4caf50',
                tension: 0.3,
            }
        ]
    };

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>

            <div className="stats-row">
                <div className="card">
                    <FaUsers size={30}/>
                    <p className="card-number">100</p>
                    <p className="card-label">Empleados Activos</p>
                </div>
                <div className="card">
                    <FaArrowDown size={30}/>
                    <p className="card-number">{bajas.length}</p>
                    <p className="card-label">Bajas<br/>En el mes</p>
                </div>
                <div className="card">
                    <FaArrowUp size={30}/>
                    <p className="card-number">{altas.length}</p>
                    <p className="card-label">Altas<br/>En el mes</p>
                </div>
                <div className="card">
                    <FaUserEdit size={30}/>
                    <p className="card-number">{modificaciones.length}</p>
                    <p className="card-label">Modificaciones<br/>En el mes</p>
                </div>
                <div className="card" onClick={() => navigate("/dashboard/kpi")} style={{cursor: "pointer"}}>
                    <FaUsers size={30}/>
                    <p className="card-number">%</p>
                    <p className="card-label">KPI</p>
                </div>
            </div>

            <div className="bottom-section">
                <div className="chart-box">
                    <h3>Altas y Bajas Mensuales</h3>
                    <Line data={chartData}/>
                </div>

                <div className="row-separado">
                    {/* Últimos movimientos */}
                    <div className="movimientos-box mitad">
                        <h3>Últimos Movimientos</h3>
                        <div className="tabla-movimientos">
                            <div className="mov-header">
                                <span>Tipo</span>
                                <span>Fecha</span>
                                <span>Empleado</span>
                            </div>
                            {ultimosMovimientos.map((m, idx) => (
                                <div key={idx} className="mov-item">
                                    <span>{m.tipo}</span>
                                    <span>{m.fecha}</span>
                                    <span>{m.nombre}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Modificaciones */}
                    <div className="movimientos-box mitad">
                        <h3>Top Modificaciones</h3>
                        <div className="tabla-movimientos">
                            <div className="mov-header">
                                <span>Usuario</span>
                                <span>Cantidad</span>
                            </div>
                            {topModificadores.map((u, idx) => (
                                <div key={idx} className="mov-item">
                                    <span>{u.nombre}</span>
                                    <span>{u.cantidad}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;