import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Sidebar from "./components/Sidebar";
import Empleados from "./components/Empleados"; // la nueva pantalla
import AbmEmpleados from "./components/AbmEmpleados";
import Dashboard from "./components/DashboardEmp"; // Asegúrate de que la ruta sea correcta
import BajaEmpleados from "./components/BajaEmpleados";
import Marcaciones from "./components/Marcaciones";
import MarcacionesImportadas from "./components/MarcacionesImportadas";
import AbmMarcacionesImportadas from "./components/AbmMarcacionesImportadas";
import AbmMarcacionesPen from "./components/AbmMarcacionesPen";
import HorasExtras from "./components/HorasExtras";
import Contratos from "./components/Contratos";
import MenuPrincipal from "./components/Panel";
import AbmContratos from "./components/AbmContratos";
import Justificativos from "./components/Justificativos";
import AbmJustificativos from "./components/AbmJustificativos"; // ajustá el path si está en otra carpeta
import Vacaciones from "./components/Vacaciones";
import AbmVacaciones from "./components/AbmVacaciones";
import DescuentosSalariales from "./components/DescuentosSalariales";
import AbmDescuentoSalarial from "./components/AbmDescuentoSalarial";
import Direcciones from "./components/Direcciones";
import AbmDirecciones from "./components/AbmDirecciones";
import DetalleLogins from "./components/DetalleLogins";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/MenuPrincipal"
          element={
            <div className="app-container">
              <Sidebar />
              <MenuPrincipal />
            </div>
          }
        />

        <Route
          path="/menu"
          element={
            <div className="app-container">
              <Sidebar />
              <Menu />
            </div>
          }
        />

        <Route
          path="/empleados"
          element={
            <div className="app-container">
              <Sidebar />
              <Empleados />
            </div>
          }
        />

        <Route
          path="/bajaEmpleados"
          element={
            <div className="app-container">
              <Sidebar />
              <BajaEmpleados />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            <div className="app-container">
              <Sidebar />
              <Dashboard /> {/* Aquí añades tu componente Dashboard */}
            </div>
          }
        />

        <Route
          path="/abmEmpleados"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmEmpleados />
            </div>
          }
        />

        <Route
          path="/marcaciones"
          element={
            <div className="app-container">
              <Sidebar />
              <Marcaciones />
            </div>
          }
        />

        <Route
          path="/marcacionesImportadas"
          element={
            <div className="app-container">
              <Sidebar />
              <MarcacionesImportadas />
            </div>
          }
        />

        <Route
          path="/abmImport"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmMarcacionesImportadas />
            </div>
          }
        />

        <Route
          path="/abmImportPen"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmMarcacionesPen />
            </div>
          }
        />

        <Route
          path="/horasExtras"
          element={
            <div className="app-container">
              <Sidebar />
              <HorasExtras />
            </div>
          }
        />
        <Route
          path="/contratos"
          element={
            <div className="app-container">
              <Sidebar />
              <Contratos />
            </div>
          }
        />

        <Route
          path="/Dashboard"
          element={
            <div className="app-container">
              <Sidebar />
              <Dashboard />
            </div>
          }
        />

        <Route
          path="/abmContratos"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmContratos />
            </div>
          }
        />

        <Route
          path="/justificativos"
          element={
            <div className="app-container">
              <Sidebar />
              <Justificativos />
            </div>
          }
        />
        <Route
          path="/abmJustificativos"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmJustificativos />
            </div>
          }
        />
        <Route
          path="/vacaciones"
          element={
            <div className="app-container">
              <Sidebar />
              <Vacaciones />
            </div>
          }
        />

        <Route
          path="/abmVacaciones"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmVacaciones />
            </div>
          }
        />
        <Route
          path="/descuentoSalariales"
          element={
            <div className="app-container">
              <Sidebar />
              <DescuentosSalariales />
            </div>
          }
        />
        <Route
          path="/abmDescuentoSalarial"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmDescuentoSalarial />
            </div>
          }
        />
        <Route
          path="/Direcciones"
          element={
            <div className="app-container">
              <Sidebar />
              <Direcciones />
            </div>
          }
        />
        <Route
          path="/abmDirecciones"
          element={
            <div className="app-container">
              <Sidebar />
              <AbmDirecciones />
            </div>
          }
        />
        <Route
          path="/detalleLogins"
          element={
            <div className="app-container">
              <Sidebar />
              <DetalleLogins />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
