import React from "react";
import "./Login.css"; // Importamos los estilos

const Login = () => {
    return (
        <div className="login-container">
            <h2 className="title">Bienvenido a</h2>
            <h2 className="title2">GestionaTalento</h2>
            <div className="login-box">
                <p className="subtitle">Ingrese sus datos</p>

                <form>
                    <div className="input-group">
                        <label>USUARIO</label>
                        <input type="text" placeholder=""/>
                    </div>

                    <div className="input-group">
                        <label>CONTRASEÑA</label>
                        <input type="password" placeholder=""/>
                    </div>

                    <button type="submit" className="login-button">
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
