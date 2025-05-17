import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DescSalariales.css";
import axios from "axios";
import { toast } from "react-toastify";

const DescuentosSalariales = () => {
  const [descuentos, setDescuentos] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedDescuento, setSelectedDescuento] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [descuentoToDelete, setDescuentoToDelete] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(1);

  const fetchDescuentos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/descuentos-salariales/obtenerLista"
      );
      setDescuentos(response.data.objeto || []);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener descuentos:", error);
      setDescuentos([]);
    }
  };

  useEffect(() => {
    fetchDescuentos();
  }, []);

  const handleEliminar = async () => {
    try {
      await axios.delete(
        "http://localhost:8080/descuentos-salariales/eliminar",
        {
          data: {
            empleado: { codEmpleado: descuentoToDelete.empleado.codEmpleado },
            codPeriodo: descuentoToDelete.id.codPeriodo,
          },
        }
      );
      toast.success("Registro eliminado correctamente", { autoClose: 2000 });
      setShowConfirmModal(false);
      fetchDescuentos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("No se pudo eliminar el registro", { autoClose: 2000 });
    }
  };

  const openModal = (descuento) => {
    setSelectedDescuento({ ...descuento }); // Clon para edición
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDescuento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/descuentos-salariales/actualizar`,
        {
          empleado: {
            codEmpleado: selectedDescuento.empleado.codEmpleado,
          },
          codPeriodo: selectedDescuento.id.codPeriodo,
          entradaTardia: parseInt(selectedDescuento.entradaTardia),
          salidaAnticipada: parseInt(selectedDescuento.salidaAnticipada),
          ausencia: parseInt(selectedDescuento.ausencia),
          monto: parseFloat(selectedDescuento.monto),
          observacion: "Modificado desde sistema web",
        }
      );

      setShowModal(false);
      fetchDescuentos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo actualizar el registro.");
    }
  };

  const exportarMarcaciones = () => {
    const nuevaVentana = window.open(
      `/informe-recibos?mes=${mesSeleccionado}`,
      "_blank"
    );
    if (!nuevaVentana)
      alert(
        "Por favor, permití las ventanas emergentes para poder generar el PDF."
      );
  };

  const exportarRecibidos = () => {
    const anio = new Date().getFullYear();
    const periodo = `${anio}/${String(mesSeleccionado).padStart(2, "0")}`;
    const nuevaVentana = window.open(
      `/informe-recibidos?periodo=${periodo}`,
      "_blank"
    );
    if (!nuevaVentana) {
      alert(
        "Por favor, permití las ventanas emergentes para poder generar el PDF."
      );
    }
  };

  return (
    <div className="descuentos-container">
      <h1>Descuentos Salariales</h1>
      <p className="acciones-title">Acciones</p>

      <div className="acciones-top-row">
        <button
          className="btn-agregar"
          onClick={() => navigate("/descuentos/abm")}
        >
          AGREGAR
        </button>
        <select
          className="select-mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
        >
          <option value={1}>Enero</option>
          <option value={2}>Febrero</option>
          <option value={3}>Marzo</option>
          <option value={4}>Abril</option>
          <option value={5}>Mayo</option>
          <option value={6}>Junio</option>
          <option value={7}>Julio</option>
          <option value={8}>Agosto</option>
          <option value={9}>Septiembre</option>
          <option value={10}>Octubre</option>
          <option value={11}>Noviembre</option>
          <option value={12}>Diciembre</option>
        </select>
        <button className="btn-buscar">BUSCAR</button>
      </div>

      <div className="acciones-buttons">
        <button onClick={exportarMarcaciones}>EXPORTAR MARCACIONES</button>
        <button>EXONERADOS</button>
        <button>EXPORTAR BORRADOR</button>
        <button onClick={exportarRecibidos}>EXPORTAR RECIBIDOS</button>{" "}
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {descuentos.map((d, index) => (
            <tr key={index}>
              <td>{d.id.codPeriodo}</td>
              <td>{d.empleado.persona.nroDocumento}</td>
              <td>
                {(d.empleado.persona.nombres || "") +
                  " " +
                  (d.empleado.persona.apellidos || "")}
              </td>
              <td>{d.empleado.asignacion}</td>
              <td>{d.entradaTardia}</td>
              <td>{d.salidaAnticipada}</td>
              <td>{d.ausencia}</td>
              <td>{d.monto}</td>
              <td>{d.empleado.cargo.departamento.direccion.descripcion}</td>
              <td>
                <button className="btn-accion" onClick={() => openModal(d)}>
                  <img
                    src="/public/editar.png"
                    alt="Editar"
                    className="icono-accion"
                  />
                </button>
                <button
                  className="btn-accion"
                  onClick={() => {
                    setDescuentoToDelete(d);
                    setShowConfirmModal(true);
                  }}
                >
                  <img
                    src="/public/borrar.png"
                    alt="Eliminar"
                    className="icono-accion"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirmar eliminación</h2>
            <p>¿Estás seguro que querés eliminar este registro?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button onClick={handleEliminar}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Descuento</h2>

            <div className="modal-info">
              <div>
                <label>Documento:</label>
                <span>
                  {selectedDescuento?.empleado?.persona?.nroDocumento}
                </span>
              </div>
              <div>
                <label>Nombre:</label>
                <span>{`${
                  selectedDescuento?.empleado?.persona?.nombres || ""
                } ${
                  selectedDescuento?.empleado?.persona?.apellidos || ""
                }`}</span>
              </div>
            </div>

            <div className="modal-grid">
              <label>
                Entradas Tardías
                <input
                  type="number"
                  name="entradaTardia"
                  value={selectedDescuento.entradaTardia}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Salidas Anticipadas
                <input
                  type="number"
                  name="salidaAnticipada"
                  value={selectedDescuento.salidaAnticipada}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Ausencias
                <input
                  type="number"
                  name="ausencia"
                  value={selectedDescuento.ausencia}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Monto Descuento
                <input
                  type="number"
                  name="monto"
                  value={selectedDescuento.monto}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)}>Cancelar</button>
              <button onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescuentosSalariales;
