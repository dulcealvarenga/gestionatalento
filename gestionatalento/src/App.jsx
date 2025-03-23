import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Menu from "./components/Menu";
import Sidebar from "./components/Sidebar";

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
            </Routes>
        </Router>
    );
}

export default App;
