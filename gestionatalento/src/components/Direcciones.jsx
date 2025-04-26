import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Direcciones.css";
import { FaPen } from "react-icons/fa";

const Direcciones = () => {
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState([]);
  const [filtroDescripcion, setFiltroDescripcion] = useState("Todas");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    // Simulación de datos mientras esperás el backend
    const datosEjemplo = [
      {
        id: 1,
        descripcion: "Dirección de Tecnología",
        estado: "Activo",
        usuarioInsercion: "Juan Pérez",
        fechaInsercion: "01/01/2024",
      },
      {
        id: 2,
        descripcion: "Dirección de Recursos Humanos",
        estado: "Inactivo",
        usuarioInsercion: "Ana López",
        fechaInsercion: "15/02/2024",
      },
      {
        id: 3,
        descripcion: "Dirección de Finanzas",
        estado: "Activo",
        usuarioInsercion: "Carlos Gómez",
        fechaInsercion: "10/03/2024",
      },
    ];

    setDirecciones(datosEjemplo);
  }, []);

  const irAAbm = (direccion = null) => {
    navigate("/abmDirecciones", { state: { direccion } });
  };

  const descripcionesUnicas = [
    "Todas",
    ...new Set(direcciones.map((d) => d.descripcion)),
  ];

  const direccionesFiltradas =
    filtroDescripcion === "Todas"
      ? direcciones
      : direcciones.filter((d) => d.descripcion === filtroDescripcion);

  return (
    <div className="direcciones-container">
      <h1>Direcciones</h1>
      <p className="acciones-title">Acciones</p>

      <div className="barra-acciones">
        <button className="btn" onClick={() => irAAbm()}>
          AGREGAR
        </button>

        <div className="filtro-container">
          <button
            className="btn"
            onClick={() => setMostrarFiltro(!mostrarFiltro)}
          >
            DEPARTAMENTOS
          </button>

          {mostrarFiltro && (
            <select
              className="select-filtro"
              value={filtroDescripcion}
              onChange={(e) => setFiltroDescripcion(e.target.value)}
            >
              {descripcionesUnicas.map((desc, i) => (
                <option key={i} value={desc}>
                  {desc}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <table className="tabla-direcciones">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Usuario Insercion</th>
            <th>Fecha Insercion</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {direccionesFiltradas.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.descripcion}</td>
              <td>{d.estado}</td>
              <td>{d.usuarioInsercion}</td>
              <td>{d.fechaInsercion}</td>
              <td>
                <FaPen className="icono-editar" onClick={() => irAAbm(d)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Direcciones;
