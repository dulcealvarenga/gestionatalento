import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Sidebar from "./components/Sidebar";
import Empleados from "./components/Empleados"; // la nueva pantalla
import AbmEmpleados from "./components/AbmEmpleados";
import Dashboard from "./components/DashboardEmp";  // Asegúrate de que la ruta sea correcta
import BajaEmpleados from "./components/BajaEmpleados";
import Marcaciones from "./components/Marcaciones";
import MarcacionesImportadas from "./components/MarcacionesImportadas";
import AbmMarcacionesImportadas from "./components/AbmMarcacionesImportadas";
import AbmMarcacionesPen from "./components/AbmMarcacionesPen";
import HorasExtras from "./components/HorasExtras";
import DescSalariales from "./components/DescSalariales";
import Vacaciones from "./components/Vacaciones";
import Justifivativos from "./components/Justifivativos";

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

                <Route path="/marcaciones" element={<div className="app-container">
                    <Sidebar/>
                    <Marcaciones/>
                </div>}/>

                <Route path="/marcacionesImportadas" element={<div className="app-container">
                    <Sidebar/>
                    <MarcacionesImportadas/>
                </div>}/>

                <Route path="/abmImport" element={<div className="app-container">
                    <Sidebar/>
                    <AbmMarcacionesImportadas/>
                </div>}/>

                <Route path="/abmImportPen" element={<div className="app-container">
                    <Sidebar/>
                    <AbmMarcacionesPen/>
                </div>}/>

                <Route path="/horasExtras" element={<div className="app-container">
                    <Sidebar/>
                    <HorasExtras/>
                </div>}/>

                <Route path="/descSalariales" element={<div className="app-container">
                    <Sidebar/>
                    <DescSalariales/>
                </div>}/>

                <Route path="/vacaciones" element={<div className="app-container">
                    <Sidebar/>
                    <Vacaciones/>
                </div>}/>

                <Route path="/justificativos" element={<div className="app-container">
                    <Sidebar/>
                    <Justifivativos/>
                </div>}/>

            </Routes>
        </Router>
    );
}

export default App;
