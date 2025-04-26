import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  FaUsers,
  FaArrowDown,
  FaArrowUp,
  FaUserEdit,
  FaSignInAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./dashboardemp.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate(); // <-- AGREGAR ESTA LÍNEA
  const [altas, setAltas] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [modificaciones, setModificaciones] = useState([]);
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);
  const [totalLogins, setTotalLogins] = useState(0);
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    axios.get("/datos.json").then((res) => {
      const data = res.data;
      setAltas(data.altas || []);
      setBajas(data.bajas || []);
      setModificaciones(data.modificaciones || []);

      const ultimos = [
        ...(data.altas || []),
        ...(data.bajas || []),
        ...(data.modificaciones || []),
      ]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

      setUltimosMovimientos(ultimos);
    });

    axios.get("http://localhost:8080/auth/count").then((res) => {
      const total = res.data.reduce(
        (acc, curr) => acc + curr.cantidadLogins,
        0
      );
      setTotalLogins(total);
      setLoginData(res.data);
    });
  }, []);

  const chartData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Altas",
        data: [10, 15, 20, 25, 12, 30, 18],
        borderColor: "#4f83ff",
        tension: 0.3,
      },
      {
        label: "Bajas",
        data: [5, 10, 8, 12, 6, 9, 7],
        borderColor: "#4caf50",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="stats-row">
        <div className="card">
          <FaUsers size={30} />
          <p className="card-number">300</p>
          <p className="card-label">Empleados Activos</p>
        </div>
        <div className="card">
          <FaArrowDown size={30} />
          <p className="card-number">{bajas.length}</p>
          <p className="card-label">
            Bajas
            <br />
            En el mes
          </p>
        </div>
        <div className="card">
          <FaArrowUp size={30} />
          <p className="card-number">{altas.length}</p>
          <p className="card-label">
            Altas
            <br />
            En el mes
          </p>
        </div>
        <div className="card">
          <FaUserEdit size={30} />
          <p className="card-number">{modificaciones.length}</p>
          <p className="card-label">
            Modificaciones
            <br />
            En el mes
          </p>
        </div>
        <div
          className="card card-clickable"
          onClick={() => navigate("/detalleLogins", { state: { loginData } })}
        >
          <FaSignInAlt size={30} />
          <p className="card-number">{totalLogins}</p>
          <p className="card-label">
            Total
            <br />
            Inicios de sesión
          </p>
        </div>
      </div>

      <div className="bottom-section">
        <div className="chart-box">
          <h3>Altas y bajas mensuales</h3>
          <Line data={chartData} />
        </div>

        <div className="movimientos-box">
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
      </div>
    </div>
  );
};

export default Dashboard;
