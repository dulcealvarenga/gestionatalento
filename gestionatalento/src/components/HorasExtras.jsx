import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./HorasExtras.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_BASE_URL } from '../config/constantes.js';

const HorasExtras = () => {
    const navigate = useNavigate();
    const [listaHorasExtras, setListaHorasExtras] = useState([]);
    const [showConfirmModalHE, setShowConfirmModalHE] = useState(false);
    const [comentario, setComentario] = useState("");

    useEffect(() => {
        const obtenerLista = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}horas-extras/obtenerLista`);
                if (response.data.codigoMensaje === "200") {
                    setListaHorasExtras(response.data.objeto);
                } /*else {
                    toast.error("Error al cargar lista");
                }*/
            } catch (error) {
                console.error("Error:", error);
                toast.error("Fallo en la carga de datos");
            }
        };

        obtenerLista();
    }, []);

    const handleExportarExcel = () => {
        const datosExportar = listaHorasExtras.map((item, index) => {
            const persona = item.horaExtra.empleado.persona;
            const empleado = item.horaExtra.empleado;
            const horaExtra = item.horaExtra;

            return {
                ID: index + 1,
                Documento: persona.nroDocumento,
                Nombres: persona.nombres,
                Apellidos: persona.apellidos,
                HoraSalida: empleado.horaSalida,
                Exonerado: horaExtra.exoneraEntrada,
                HorasExtra: horaExtra.horaExtra,
                Monto: horaExtra.monto
            };
        });

        const ws = XLSX.utils.json_to_sheet(datosExportar);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Horas Extras");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const archivo = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(archivo, "horas_extras.xlsx");
    };

    return (
        <div className="horas-extras-container">
            <h1>Horas Extras</h1>
            <p className="acciones-label">Acciones</p>

            <div className="filtros-horas-extras">
                <div className="acciones-filtros">
                    <select>
                        <option value="">Mostrar Sello</option>
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div className="botones-acciones">
                    <button className="btn-volver" onClick={() => navigate("/marcaciones")}>← Volver</button>
                    <button className="btn-agregar" onClick={() => navigate("/marcaciones/horasExtras/abm")}>AGREGAR
                    </button>
                    <button className="btn-exportar" onClick={handleExportarExcel}>EXPORTAR</button>
                    <button className="btn-exportar" onClick={() => setShowConfirmModalHE(true)}>CIERRE</button>
                </div>
            </div>

            {showConfirmModalHE && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmar Cierre de Periodo</h2>
                        <label>Periodo a Cerrar</label>
                        <input type="text" name="periodo" value='05/2025' readOnly={true}/>
                        <label>Comentario</label>
                        <input
                            type="text"
                            name="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={() => setShowConfirmModalHE(false)}>Confirmar</button>
                            <button onClick={() => setShowConfirmModalHE(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="tabla-horas-extras">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Foto</th>
                    <th>Nro. de Documento</th>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Hora de Salida</th>
                    <th>Exon.</th>
                    <th>Horas Extras Planilla</th>
                </tr>
                </thead>
                <tbody>
                {listaHorasExtras.map((item, index) => {
                    const persona = item.horaExtra.empleado.persona;
                    const empleado = item.horaExtra.empleado;
                    const horaExtra = item.horaExtra;

                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td><i className="icon-user-circle"/></td>
                            {/* o usa una imagen si la tenés: persona.rutaFoto */}
                            <td>{persona.nroDocumento}</td>
                            <td>{persona.nombres}</td>
                            <td>{persona.apellidos}</td>
                            <td>{empleado.horaSalida}</td>
                            <td>{horaExtra.exoneraEntrada}</td>
                            <td>{horaExtra.horaExtra}</td>
                        </tr>
                    );
                })}
                </tbody>

            </table>
            <ToastContainer/>
        </div>
    );
};

export default HorasExtras;
