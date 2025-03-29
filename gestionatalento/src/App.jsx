import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Sidebar from "./components/Sidebar";
import Empleados from "./components/Empleados"; // la nueva pantalla

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
            </Routes>
        </Router>
    );
}

export default App;
