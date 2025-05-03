import React from "react";
import "./AbmDescuentos.css";
import {useNavigate} from "react-router-dom";

const DescuentoForm = () => {

    const navigate = useNavigate();

    return (
        <div className="descuento-form-container">
            <h1>Agregar/Modificar Descuentos Salariales</h1>
            <p className="volver" onClick={() => navigate(-1)}>← Volver</p>

            <div className="form-card">
                <div className="descuento-info">
                    <div className="descuentos-anteriores">
                        <label className="tit-desc-ant">Desc. Anteriores</label>
                        <ul>
                            <li>2024/09 - Monto: 0 - Obs:</li>
                            <li>2024/08 - Monto: 0 - Obs:</li>
                            <li>2024/07 - Monto: 0 - Obs:</li>
                        </ul>
                    </div>

                    <div className="foto-area">
                        <img src="/avatar.png" alt="Foto" className="foto-empleado"/>
                        <p>Nro. 123.456</p>
                    </div>

                    <div className="campo-triple">
                        <div>
                            <label style={{fontSize: '20px'}}>Nombre Completo</label>
                            <input type="text"/>
                        </div>
                        <div>
                            <label style={{fontSize: '20px'}}>Asignación</label>
                            <input type="text"/>
                        </div>
                    </div>
                </div>

                <div className="grid-form-columns">
                    <div className="col">
                        <div className="campo"><label>Entradas Tardías Sis.</label><input type="text"/></div>
                        <div className="campo"><label>Entradas Tardías</label><input type="text"/></div>
                        <div className="campo"><label>Monto E.T.</label><input type="text"/></div>
                        <div className="campo"><label>Sede</label><input type="text"/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Salidas Anticipadas Sis.</label><input type="text"/></div>
                        <div className="campo"><label>Salidas Anticipadas</label><input type="text"/></div>
                        <div className="campo"><label>Monto S.A.</label><input type="text"/></div>
                        <div className="campo"><label>Horario de Entrada</label><input type="time"/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Ausencias Sis.</label><input type="text"/></div>
                        <div className="campo"><label>Ausencias</label><input type="text"/></div>
                        <div className="campo"><label>Monto Ausencias</label><input type="text"/></div>
                        <div className="campo"><label>Horario de Salida</label><input type="time"/></div>
                    </div>

                    <div className="col">
                        <div className="campo"><label>Dependencia</label><input type="text"/></div>
                        <div className="campo"><label>Observación</label><input type="text"/></div>
                        <div className="campo"><label>Monto Total</label><input type="text"/></div>
                    </div>
                </div>

                <div className="acciones-form">
                    <button className="btn-calcular">CALCULAR</button>
                    <button className="btn-guardar">GUARDAR</button>
                </div>
            </div>
        </div>
    );
};

export default DescuentoForm;
