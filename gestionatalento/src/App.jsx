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
import AbmDescuentos from "./components/AbmDescuentos";
import AbmMarcacionesManuales from "./components/AbmMarcacionesManuales";
import AbmHorasExtras from "./components/AbmHorasExtras";
import AbmVacaciones from "./components/AbmVacaciones";
import AbmJustificativos from "./components/AbmJustificativos";
import Configuraciones from "./components/Configuraciones";
import Eventos from "./components/Eventos";
import AbmEventos from "./components/AbmEventos";
import Departamentos from "./components/Departamentos";
import AbmDepartamento from "./components/AbmDepartamento";
import Direcciones from "./components/Direcciones";
import AbmDirecciones from "./components/AbmDirecciones";
import Cargos from "./components/Cargos";
import AbmCargo from "./components/AbmCargo";
import DashKPI from "./components/DashKPI";
import Contratos from "./components/Contratos.jsx";
import AbmContratos from "./components/AbmContratos.jsx";
import Intranet from "./components/Intranet.jsx";
import Salarios from "./components/Salarios.jsx";

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

                <Route path="/marcaciones/importadas" element={<div className="app-container">
                    <Sidebar/>
                    <MarcacionesImportadas/>
                </div>}/>

                <Route path="/marcaciones/importadas/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmMarcacionesImportadas/>
                </div>}/>

                <Route path="/marcaciones/pendrive/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmMarcacionesPen/>
                </div>}/>

                <Route path="/marcaciones/horasExtras" element={<div className="app-container">
                    <Sidebar/>
                    <HorasExtras/>
                </div>}/>

                <Route path="/descuentos" element={<div className="app-container">
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

                <Route path="/descuentos/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmDescuentos/>
                </div>}/>

                <Route path="/marcaciones/manuales/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmMarcacionesManuales/>
                </div>}/>

                <Route path="/marcaciones/horasExtras/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmHorasExtras/>
                </div>}/>

                <Route path="/vacaciones/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmVacaciones/>
                </div>}/>

                <Route path="/justificativos/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmJustificativos/>
                </div>}/>
                <Route path="/justificativos/abm" element={<div className="app-container">
                    <Sidebar/>
                    <AbmJustificativos/>
                </div>}/>
                <Route
                    path="/configuraciones"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <Configuraciones />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/direcciones"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <Direcciones />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/direcciones/abm"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <AbmDirecciones />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/eventos"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <Eventos />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/eventos/abm"
                    element={
                        <div className="app-container">
                        <Sidebar />
                        <AbmEventos />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/eventos/abm/:id"
                    element={
                        <div className="app-container">
                        <Sidebar />
                        <AbmEventos />
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/departamentos"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <Departamentos/>
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/departamentos/abm"
                    element={
                        <div className="app-container">
                            <Sidebar />
                            <AbmDepartamento/>
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/cargos"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <Cargos/>
                        </div>
                    }
                />
                <Route
                    path="/configuraciones/cargos/abm"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <AbmCargo/>
                        </div>
                    }
                />

                <Route
                    path="/dashboard/kpi"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <DashKPI/>
                        </div>
                    }
                />

                <Route
                    path="/contratos"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <Contratos/>
                        </div>
                    }
                />
                <Route
                    path="/contratos/abm"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <AbmContratos/>
                        </div>
                    }
                />
                <Route
                    path="/intranet"
                    element={
                        <div className="app-container">
                            <Intranet/>
                        </div>
                    }
                />
                <Route
                    path="/salarios"
                    element={
                        <div className="app-container">
                            <Sidebar/>
                            <Salarios/>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
