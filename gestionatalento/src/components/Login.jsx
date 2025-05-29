import React, { useState } from "react";
import "./Login.css"; // Importamos los estilos
import { useNavigate } from "react-router-dom"; // Importar para redirigir
import axios from "axios";
import { API_BASE_URL } from '../config/constantes.js';

const Login = () => {

    const navigate = useNavigate(); // Hook para navegación

    // Estados para usuario, contraseña y mensaje de error
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [credencial, setCredencial] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            console.log("usuario:", nombreUsuario, "contraseña", credencial);
            const response = await axios.post(`${API_BASE_URL}auth/login`, {
                nombreUsuario,
                credencial
            });

            // Guardar el token en localStorage
            localStorage.setItem("token", response.data.token);

            // Redirigir si fue exitoso
            navigate("/menu");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Error de conexión con el servidor.");
            }
        }
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
                        <input
                            type="text"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            placeholder=""
                        />
                    </div>

                    <div className="input-group">
                        <label>CONTRASEÑA</label>
                        <input
                            type="password"
                            value={credencial}
                            onChange={(e) => setCredencial(e.target.value)}
                            placeholder=""
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
