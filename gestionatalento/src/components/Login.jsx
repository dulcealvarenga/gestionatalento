import React from "react";
import "./Login.css"; // Importamos los estilos
import { useNavigate } from "react-router-dom"; // Importar para redirigir

const Login = () => {

    const navigate = useNavigate(); // Hook para navegación

    const handleLogin = (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página
        navigate("/menu"); // Redirige a la página de Menu
    };

    return (
        <div className="login-container">
            <h2 className="title">Bienvenido a</h2>
            <h2 className="title2">GestionaTalento</h2>
            <div className="login-box">
                <p className="subtitle">Ingrese sus datos</p>

                <form onSubmit={handleLogin}>
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
