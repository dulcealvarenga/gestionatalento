import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DescuentosSalariales.css";
import { FaPen } from "react-icons/fa";

const DescuentosSalariales = () => {
  const navigate = useNavigate();
  const [mes, setMes] = useState("Enero");
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

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

  const fetchData = async () => {
    const periodo = `${anio}${mesesNumericos[mes]}`;
    try {
      const response = await axios.get(
        `http://localhost:8080/empleados/descuentos?periodo=${periodo}`
      );
      setData(response.data.objeto || []);
    } catch (error) {
      console.error("Error al obtener descuentos salariales:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes, anio]);

  return (
    <div className="descuentos-container">
      <h1>Descuentos Salariales</h1>
      <p className="acciones-title">Acciones</p>
      <div className="barra-acciones">
        <button
          className="btn"
          onClick={() => navigate("/abmDescuentoSalarial")}
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
        <input
          type="number"
          className="select-mes"
          value={anio}
          min="2000"
          max={new Date().getFullYear() + 10}
          onChange={(e) => setAnio(e.target.value)}
        />
        <button className="btn">EXPORTAR MARCACIONES</button>
        <button className="btn">EXONERADOS</button>
        <button className="btn">EXPORTAR BORRADOR</button>
        <button className="btn">EXPORTAR RECIBIDOS</button>
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
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.periodo}</td>
              <td>{d.ci}</td>
              <td>{d.nombre}</td>
              <td>{d.asignacion}</td>
              <td>{d.tardias}</td>
              <td>{d.anticipos}</td>
              <td>{d.ausencias}</td>
              <td>{d.dependencia}</td>
              <td>
                <button
                  onClick={() =>
                    navigate("/abmDescuentoSalarial", { state: { datos: d } })
                  }
                >
                  <FaPen />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DescuentosSalariales;
