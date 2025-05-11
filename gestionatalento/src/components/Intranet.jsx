// src/components/Intranet.jsx
import React, { useState }  from 'react';
import { useRef } from 'react';
import './Intranet.css';
import { useNavigate } from "react-router-dom";
import { FaDownload, FaSearch, FaPlus, FaFolder } from 'react-icons/fa';

const Intranet = () => {
    const navigate = useNavigate();

    const [documento, setDocumento] = useState("");
    const [hasDocuments, setHasDocuments] = useState(false); // 👈 clave
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    // Datos mock para ejemplo
    const documentos = [
        { id: 1, nombre: 'Docum.pdf' },
        { id: 2, nombre: 'Docum.pdf' },
        { id: 3, nombre: 'Docum.pdf' },
    ];

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();  // 👉 abre el file picker
    };

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        console.log("Archivos seleccionados:", selectedFiles);
        // acá podés enviar al backend o guardar en estado
    };

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            // 👉 Simulación de llamada a backend
            const response = await fakeBackendCheck(documento);
            setHasDocuments(response);
            setSelectedFolder(false);
        } catch (error) {
            console.error("Error buscando funcionario", error);
        } finally {
            setIsLoading(false);
        }
    };

    // solo para simular
    const fakeBackendCheck = (doc) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(doc === "123456"); // 👉 si se escribe 123456, muestra carpetas
            }, 1000);
        });
    };

    return (
        <div className="intranet-container">
            {/* Sidebar */}
            <div className="sidebar-intra">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="logo"
                    onClick={() => navigate("/menu")}
                    style={{cursor: "pointer"}}
                />
                <h1>Intranet</h1>
                    <nav>
                        <a onClick={() => navigate("/intranet")} href="#">Home</a>
                        <a href="#">Mis Documentos</a>
                        <a onClick={handleUploadClick} href="#">Subir</a>
                    </nav>
            </div>

            {/* Main */}
            <div className="main-content">
                {/* Barra de búsqueda */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Ingrese Nro de Documento"
                        value={documento}
                        onChange={e => setDocumento(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                    />
                </div>
                {isLoading && <p>Buscando documentos...</p>}

                {!isLoading && hasDocuments && !selectedFolder && (
                    <>
                        <h3>Nombre del Funcionario</h3>
                        <h3>Carpetas del Funcionario</h3>
                        <div className="folders-grid">
                            <div className="folder-card" onClick={() => setSelectedFolder('personales')}>
                                <FaFolder size={40}/>
                                <span>Personales</span>
                            </div>
                            <div className="folder-card" onClick={() => setSelectedFolder('laborales')}>
                                <FaFolder size={40}/>
                                <span>Laborales</span>
                            </div>
                        </div>
                    </>
                )}

                {selectedFolder && (
                    <>
                        <h3>Documentos {selectedFolder === 'personales' ? 'Personales' : 'Laborales'}</h3>
                        <div className="documentos-grid">
                            {documentos.map((doc) => (
                                <div key={doc.id} className="document-card">
                                    <div className="icono-doc">
                                        <FaDownload size={40}/>
                                        <p>{doc.nombre}</p>
                                    </div>
                                    <div className="botones-doc">
                                        <button>Ver</button>
                                        <button>Descargar</button>
                                        <button>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="botones-acciones-intra">
                            <button className="volver-btn" onClick={() => setSelectedFolder(null)}>← Volver a Carpetas</button>
                            <button className="subir-btn" onClick={handleUploadClick}>Subir</button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: "none"}}
                            multiple
                            onChange={handleFileChange}
                        />
                    </>
                )}

                {!isLoading && !hasDocuments && documento !== "" && (
                    <p>No se encontraron documentos vinculados a este funcionario.</p>
                )}

                {/* Documentos */}
                {!hasDocuments && (
                    <>
                        <h3>Recientes</h3>
                        <div className="documentos-grid">
                            {documentos.map((doc) => (
                                <div key={doc.id} className="document-card">
                                    <div className="icono-doc">
                                        <FaDownload size={40} />
                                        <p>{doc.nombre}</p>
                                    </div>
                                    <div className="botones-doc">
                                        <button>Ver</button>
                                        <button>Descargar</button>
                                        <button>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Intranet;
