import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AbmDescuentoSalarial.css";

const AbmDescuentoSalarial = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(state?.datos || {});

  useEffect(() => {
    if (state?.id) {
      axios
        .get(`http://localhost:8080/empleados/descuentos/${state.id}`)
        .then((res) => {
          setDatos(res.data);
        })
        .catch((err) => console.error("Error al obtener datos:", err));
    }
  }, [state?.id]);

  return (
    <div className="abm-container">
      <h1>Agregar/Modificar Descuentos Salariales</h1>
      <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="formulario">
        <div className="col columna-descuentos">
          <label>Desc. Anteriores</label>
          <div className="desc-anteriores">
            <div>2024/09 - Monto: 0 - Obs:</div>
            <div>2024/08 - Monto: 0 - Obs:</div>
            <div>2024/07 - Monto: 0 - Obs:</div>
          </div>
        </div>

        <div className="col columna-imagen">
          <div className="foto-placeholder"></div>
          <p>Nro. {datos?.ci || "123.456"}</p>
        </div>

        <div className="col">
          <label>Nombre Completo</label>
          <input defaultValue={datos?.nombre || ""} />
          <label>Asignación</label>
          <input defaultValue={datos?.asignacion || ""} />
        </div>

        <div className="col">
          <label>Entradas Tardías Sis.</label>
          <input defaultValue={datos?.entradaSis || ""} />
          <label>Entradas Tardías</label>
          <input defaultValue={datos?.tardias || ""} />
          <label>Monto E.T.</label>
          <input defaultValue={datos?.montoET || ""} />
          <label>Sede</label>
          <input defaultValue={datos?.sede || ""} />
        </div>

        <div className="col">
          <label>Salidas Anticipadas Sis.</label>
          <input defaultValue={datos?.salidaSis || ""} />
          <label>Salidas Anticipadas</label>
          <input defaultValue={datos?.anticipos || ""} />
          <label>Monto S.A.</label>
          <input defaultValue={datos?.montoSA || ""} />
          <label>Horario de Entrada</label>
          <input defaultValue={datos?.horaEntrada || ""} />
        </div>

        <div className="col">
          <label>Ausencias Sis.</label>
          <input defaultValue={datos?.ausenciaSis || ""} />
          <label>Ausencias</label>
          <input defaultValue={datos?.ausencias || ""} />
          <label>Monto Ausencias</label>
          <input defaultValue={datos?.montoAusencias || ""} />
          <label>Horario de Salida</label>
          <input defaultValue={datos?.horaSalida || ""} />
        </div>

        <div className="col">
          <label>Dependencia</label>
          <input defaultValue={datos?.dependencia || ""} />
          <label>Observación</label>
          <input defaultValue={datos?.observacion || ""} />
          <label>Monto Total</label>
          <input defaultValue={datos?.montoTotal || ""} />
        </div>
      </div>

      <div className="acciones-formulario">
        <button className="btn izquierda">CALCULAR</button>
        <button className="btn derecha">GUARDAR</button>
      </div>
    </div>
  );
};

export default AbmDescuentoSalarial;
