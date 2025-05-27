// src/components/Intranet.jsx
import React, { useState, useEffect }  from 'react';
import { useRef } from 'react';
import './Intranet.css';
import { useNavigate } from "react-router-dom";
import { FaDownload, FaFolder } from 'react-icons/fa';
import axios from "axios";
import {toast} from "react-toastify";

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

    const handleFileChange = async (event) => {
        const archivo = event.target.files[0];
        if (!archivo || !codPersona || !selectedFolder) {
            toast.warning("Seleccioná un archivo, un funcionario y una carpeta.");
            return;
        }

        // Acá podés tener un mapping más elaborado si tenés más tipos
        const codTipoDocumento = selectedFolder === "personales" ? 2 : 1;

        const formData = new FormData();
        formData.append("archivo", archivo);

        const metadata = {
            persona: { codPersona },
            tipoDocumento: { codTipoDocumento },
            estado: "C",
            fecDocumento: new Date().toISOString().split("T")[0],
            observacion: "Documento escaneado y cargado correctamente"
        };

        formData.append("data", JSON.stringify(metadata));

        try {
            const response = await axios.post("http://localhost:8080/personas/documentos/crear", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.codigoMensaje === "200") {
                toast.success("Documento subido correctamente", { autoClose: 2000 });
                await obtenerDocumentosFuncionario(codPersona);
            } else {
                toast.error("Error al subir el documento");
            }
        } catch (error) {
            console.error("Error al subir archivo:", error);
            toast.error("Error inesperado al subir archivo");
        }
    };

    const [codPersona, setCodPersona] = useState(null);
    const [documentosEmpleado, setDocumentosEmpleado] = useState([]);
    const [nombreCompleto, setNombreCompleto] = useState("");

    const obtenerDocumentosFuncionario = async (codPersona) => {
        try {
            const response = await axios.get("http://localhost:8080/personas/documentos/obtenerLista");
            const todos = response.data.objeto || [];
            const filtrados = todos.filter(item => item.documento.persona.codPersona === codPersona);
            setDocumentosEmpleado(filtrados);
        } catch (error) {
            console.error("Error al traer documentos", error);
        }
    };

    const handleBuscarPorDocumentoEmp = async () => {
        if (!documento) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/empleados/obtener/documento/${documento}`);
            if (response.data.codigoMensaje === "200") {
                const empleado = response.data.objeto[0];
                const persona = empleado.persona;
                setCodPersona(persona.codPersona);
                setNombreCompleto(`${persona.nombres} ${persona.apellidos}`);
                toast.success("Empleado encontrado", { autoClose: 2000 });
                await obtenerDocumentosFuncionario(persona.codPersona);
                setHasDocuments(true);
            } else {
                toast.info("No se encontró el empleado", { autoClose: 2000 });
                setHasDocuments(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error al buscar", { autoClose: 2000 });
        } finally {
            setIsLoading(false);
        }
    };

    const descargarArchivo = (item) => {
        const byteCharacters = atob(item.documento.archivo);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: item.documento.tipArchivo });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.documento.nomArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const [documentosRecientes, setDocumentosRecientes] = useState([]);

    useEffect(() => {
        const obtenerRecientes = async () => {
            try {
                const response = await axios.get("http://localhost:8080/personas/documentos/obtenerLista");
                const todos = response.data.objeto || [];

                const ordenados = todos
                    .filter(d => d.documento?.fecDocumento)
                    .sort((a, b) => new Date(b.documento.fecDocumento) - new Date(a.documento.fecDocumento));

                setDocumentosRecientes(ordenados.slice(0, 5));
            } catch (error) {
                console.error("Error al obtener documentos recientes", error);
            }
        };

        obtenerRecientes();
    }, []);

    const [documentosGlobales, setDocumentosGlobales] = useState([]);
    const [mostrarGlobales, setMostrarGlobales] = useState(false);

    const handleVerTodosLosDocumentos = async () => {
        try {
            const response = await axios.get("http://localhost:8080/personas/documentos/obtenerLista");
            setDocumentosGlobales(response.data.objeto || []);
            setMostrarGlobales(true);
            setSelectedFolder(null);
            setHasDocuments(false); // Oculta vistas anteriores
        } catch (error) {
            console.error("Error al obtener documentos globales", error);
            toast.error("No se pudieron cargar los documentos");
        }
    };

    const visualizarArchivo = (item) => {
        const byteCharacters = atob(item.documento.archivo);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: item.documento.tipArchivo });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
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
                        <a onClick={() => {
                               setMostrarGlobales(false);
                               navigate("/intranet");
                           }}>Home</a>
                        <a onClick={handleVerTodosLosDocumentos}>Mis Documentos</a>
                        {/* Sidebar
                        <a onClick={() => {
                            setMostrarGlobales(false);
                            handleUploadClick();
                        }}>Subir</a>*/}
                    </nav>
            </div>

            {/* Main */}
            <div className="main-content">
                {/* Barra de búsqueda */}
                <div className="search-bar">
                    <input
                        type="text"
                        name="nroDocumento"
                        placeholder="Ingrese Nro de Documento"
                        value={documento}
                        onChange={e => setDocumento(e.target.value)}
                        onBlur={handleBuscarPorDocumentoEmp}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleBuscarPorDocumentoEmp();
                            }
                        }}
                        required
                    />
                </div>
                {isLoading && <p>Buscando documentos...</p>}

                {!isLoading && hasDocuments && !selectedFolder && (
                    <>
                        <h3>Nombre del Funcionario</h3>
                        <h4>{nombreCompleto}</h4>
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
                        <h3>Documentos {selectedFolder === 'personales' ? 'Personales' : 'Laborales'} de {nombreCompleto}</h3>
                        <div className="documentos-grid">
                            {documentosEmpleado
                                .filter((item) => {
                                    const tipo = item.documento?.tipoDocumento?.tipCategoria;
                                    return selectedFolder === "personales"
                                        ? tipo === "P"
                                        : tipo === "E";
                                })
                                .map((item, i) => (
                                    <div key={i} className="document-card">
                                        <div className="icono-doc">
                                            <FaDownload size={40} />
                                            <p>{item.documento.nomArchivo}</p>
                                        </div>
                                        <div className="botones-doc">
                                            <button onClick={() => visualizarArchivo(item)}>Ver</button>
                                            <button onClick={() => descargarArchivo(item)}>Descargar</button>
                                            <button>Anular</button>
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
                            onChange={handleFileChange}
                        />
                    </>
                )}

                {!isLoading && !hasDocuments && documento !== "" && (
                    <p>No se encontraron documentos vinculados a este funcionario.</p>
                )}

                {mostrarGlobales && (
                    <>
                        <h3>Todos los Documentos</h3>
                        <div className="documentos-grid">
                            {documentosGlobales.map((item, i) => (
                                <div key={i} className="document-card">
                                    <div className="icono-doc">
                                        <FaDownload size={40} />
                                        <p>{item.documento.nomArchivo}</p>
                                    </div>
                                    <div className="botones-doc">
                                        <button onClick={() => descargarArchivo(item)}>Descargar</button>
                                        <button>Anular</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Documentos */}
                {!hasDocuments && !mostrarGlobales &&(
                    <>
                        <h3>Recientes</h3>
                        <div className="documentos-grid">
                            {documentosRecientes.map((item, i) => (
                                <div key={i} className="document-card">
                                    <div className="icono-doc">
                                        <FaDownload size={40}/>
                                        <p>{item.documento.nomArchivo}</p>
                                    </div>
                                    <div className="botones-doc">
                                        <button onClick={() => visualizarArchivo(item)}>Ver</button>
                                        <button onClick={() => descargarArchivo(item)}>Descargar</button>
                                        <button>Anular</button>
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
