import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Sidebar from "./components/Sidebar";
import Empleados from "./components/Empleados"; // la nueva pantalla
import AbmEmpleados from "./components/AbmEmpleados";
import Dashboard from "./components/DashboardEmp";  // Asegúrate de que la ruta sea correcta
import BajaEmpleados from "./components/BajaEmpleados";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/menu"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <Menu />
                        </div>
                    }
                />

                <Route path="/empleados" element={<div className="app-container">
                    <Sidebar/>
                    <Empleados/>
                </div>}/>

                <Route
                    path="/bajaEmpleados"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <BajaEmpleados />
                        </div>
                    }
                />

                <Route path="/dashboard" element={<div className="app-container">
                    <Sidebar/>
                    <Dashboard /> {/* Aquí añades tu componente Dashboard */}
                </div>}/>

                <Route path="/abmEmpleados" element={<div className="app-container">
                    <Sidebar/>
                    <AbmEmpleados/>
                </div>}/>

            </Routes>
        </Router>
    );
}

export default App;
