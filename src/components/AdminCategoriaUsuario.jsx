import { useEffect, useState } from "react";
import categoriaUsuarioApi from "../api/categoriaUsuarioApi.js";
import usuarioApi from "../api/usuarioApi.js";
import { getCategorias } from "../api/categoriasApi.js";
import "../styles/categoriaUsuario.css";

function AdminCategoriaUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [cambios, setCambios] = useState({}); 
    const [busqueda, setBusqueda] = useState(""); 

    // PAGINACIÓN
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const users = await usuarioApi.getAll();
            const cats = await getCategorias();
            const asign = await categoriaUsuarioApi.getAll();

            setUsuarios(users.data);
            setCategorias(cats.data);
            setAsignaciones(asign.data);
            setCambios({});
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("❌ Error al cargar datos");
        }
    };

    const obtenerCategoriaAsignada = (idUsuario) => {
        return asignaciones.find(a => a.idUsuario === idUsuario);
    };

    const guardar = async (idUsuario, idCategoria, idAsignacion) => {
        try {
            if (!idAsignacion) {
                await categoriaUsuarioApi.create({ idUsuario, idCategoria });
                alert("Asignado correctamente");
            } else {
                await categoriaUsuarioApi.update(idAsignacion, { idUsuario, idCategoria });
                alert("Actualizado correctamente");
            }
            cargarDatos();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("❌ Error al guardar");
        }
    };

    // FILTRAR USUARIOS POR NOMBRE
    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // PAGINACIÓN SOBRE RESULTADOS FILTRADOS
    const indiceInicial = (paginaActual - 1) * registrosPorPagina;
    const indiceFinal = indiceInicial + registrosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indiceInicial, indiceFinal);

    const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);

    return (
        <div className="cu-container">
            <h2>Asignación de Categorías por Usuario</h2>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar usuario..."
                className="cu-buscador"
                value={busqueda}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1); // reinicia la página al buscar
                }}
            />

            <table className="cu-tabla">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Categoría</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>
                    {usuariosPaginados.length > 0 ? (
                        usuariosPaginados.map((u) => {
                            const asign = obtenerCategoriaAsignada(u.id);
                            const categoriaSeleccionada = asign?.idCategoria || "";

                            return (
                                <tr key={u.id}>
                                    <td>{u.nombre}</td>

                                    <td>
                                        <select
                                            value={categoriaSeleccionada}
                                            onChange={(e) => {
                                                const nuevaCat = parseInt(e.target.value);

                                                if (asign) {
                                                    asign.idCategoria = nuevaCat;
                                                } else {
                                                    asignaciones.push({
                                                        idUsuario: u.id,
                                                        idCategoria: nuevaCat
                                                    });
                                                }
                                                setAsignaciones([...asignaciones]);

                                            
                                                setCambios(prev => ({
                                                    ...prev,
                                                    [u.id]: true
                                                }));
                                            }}
                                        >
                                            <option value="">Seleccione una categoría</option>
                                            {categorias.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        {cambios[u.id] && (
                                            <button
                                                className="btn-save"
                                                onClick={() => {
                                                    guardar(
                                                        u.id,
                                                        categoriaSeleccionada,
                                                        asign?.id
                                                    );
                                                    // quitar el cambio
                                                    setCambios(prev => {
                                                        const copia = { ...prev };
                                                        delete copia[u.id];
                                                        return copia;
                                                    });
                                                }}
                                            >
                                                Guardar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-data">
                                No hay usuarios registrados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PAGINACIÓN */}
            <div className="paginacion">
                <button
                    onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                    disabled={paginaActual === 1}
                >
                    « Anterior
                </button>

                <span>
                    Página {paginaActual} de {totalPaginas}
                </span>

                <button
                    onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas || totalPaginas === 0}
                >
                    Siguiente »
                </button>
            </div>
        </div>
    );
}

export default AdminCategoriaUsuario;
