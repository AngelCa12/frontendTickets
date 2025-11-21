import { useEffect, useState } from "react";
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../api/categoriasApi";
import "../styles/AdminCategorias.css";

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // PAGINACIÓN
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 5;

  const cargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
      alert("❌ Error al cargar categorías.");
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nombre };

    try {
      if (editingId) {
        await updateCategoria(editingId, payload);
        alert("✅ Categoría actualizada correctamente.");
      } else {
        await createCategoria(payload);
        alert("✅ Categoría creada correctamente.");
      }

      setNombre("");
      setEditingId(null);
      cargarCategorias();
    } catch (error) {
      console.error("Error al guardar", error);
      alert("❌ Ocurrió un error al guardar la categoría.");
    }
  };

  const handleEditar = (categoria) => {
    setNombre(categoria.nombre);
    setEditingId(categoria.id);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro de eliminar esta categoría?")) return;

    try {
      await deleteCategoria(id);
      alert("✅ Categoría eliminada correctamente.");
      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("❌ Error al eliminar la categoría.");
    }
  };

  // FILTRAR CATEGORÍAS POR NOMBRE
  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // PAGINACIÓN SOBRE RESULTADOS FILTRADOS
  const indexInicio = (pagina - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const categoriasPaginadas = categoriasFiltradas.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(categoriasFiltradas.length / registrosPorPagina);

  return (
    <div className="categorias-container">
      <h2>Administración de Categorías</h2>

      <form className="categorias-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Agregar Categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
      </form>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar Categoría..."
        className="cat-buscador"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1); 
        }}
      />

      <table className="categorias-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoriasPaginadas.length > 0 ? (
            categoriasPaginadas.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditar(c)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleEliminar(c.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data">
                No hay categorías registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINACIÓN estilo Tickets */}
      <div className="paginacion">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
        >
          « Anterior
        </button>

        <span>Página {pagina} de {totalPaginas}</span>

        <button
          disabled={pagina === totalPaginas || totalPaginas === 0}
          onClick={() => setPagina(pagina + 1)}
        >
          Siguiente »
        </button>
      </div>
    </div>
  );
};

export default AdminCategorias;
