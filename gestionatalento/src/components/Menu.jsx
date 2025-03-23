import React from "react";
import "./Menu.css";

const Menu = () => {
    return (
        <div className="main-grid">
            {/* Parte superior */}
            <div className="top-left">
                <h1>Inicio</h1>
                <p className="section-title">Búsqueda de Funcionarios</p>
                <label
                    style={{ fontSize: "22px", marginTop: "20px" }}
                ><input type="radio" name="search" defaultChecked/> Nro. de Documento</label>
                <label
                    style={{
                        fontSize: "22px",
                        marginTop: "20px",
                        margin : "35px",
                    }}
                ><input type="radio" name="search"/> Nombre</label>
                <div>
                    <input
                        type="text"
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: "10px",
                            borderRadius: "20px",
                            backgroundColor: "#3b3b4f",
                            color: "white",
                            border: "none",
                            marginTop: "20px",
                            fontSize: "23px",
                        }}
                        placeholder="Ingrese búsqueda"
                        className="input"/>
                </div>
            </div>
                <div className="top-right">
                    <label
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            marginBottom: "50px",
                        }}>Información Adicional</label>
                    <div className="button-row">
                        <button style={{fontSize: "20px"}}>Datos Personales</button>
                        <button style={{fontSize: "20px"}}>Datos Laborales</button>
                    </div>
                    <label style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        marginBottom: "50px",
                    }}>Accesos Rápidos</label>
                    <div className="button-row">
                        <button style={{fontSize: "20px"}}>Justificativos</button>
                        <button style={{fontSize: "20px"}}>Vacaciones</button>
                    </div>
                </div>

                {/* Parte inferior */}
                <div className="bottom-left">
                    <div className="data-row">
                        <div className="data-group">
                            <label style={{ fontSize: "23px" }}>Nombre Completo</label>
                            <input
                                style={{ borderRadius : "20px" }}
                                type="text" disabled/>
                        </div>
                        <div className="data-group">
                            <label style={{ fontSize: "23px" }}>Fecha de Ingreso</label>
                            <input style={{ borderRadius : "20px" }} type="text" disabled/>
                        </div>
                    </div>
                    <div className="data-row">
                        <div className="data-group">
                            <label style={{ fontSize: "23px", marginTop: "20px" }}>Área de Desempeño</label>
                            <input style={{ borderRadius : "20px" }} type="text" disabled/>
                        </div>
                        <div className="data-group">
                            <label style={{ fontSize: "23px", marginTop: "20px"  }}>Fecha de Egreso</label>
                            <input style={{ borderRadius : "20px" }} type="text" disabled/>
                        </div>
                    </div>
                    <div className="data-row">
                        <div className="data-group">
                            <label style={{ fontSize: "23px", marginTop: "20px"  }}>Cargo</label>
                            <input style={{ borderRadius : "20px" }} type="text" disabled/>
                        </div>
                        <div className="data-group">
                            <label style={{ fontSize: "23px", marginTop: "20px"  }}>Antigüedad</label>
                            <input style={{ borderRadius : "20px" }} type="text" disabled/>
                        </div>
                    </div>
                </div>

                <div className="bottom-right">
                    <label style={{ fontSize: "23px", fontWeight: "bold" }}>Comentarios</label>
                    <div>
                        <textarea style={{ width: "96%", height: "200px", resize: "none" }} disabled/>
                    </div>
                </div>
            </div>
            );
            };

            export default Menu;
