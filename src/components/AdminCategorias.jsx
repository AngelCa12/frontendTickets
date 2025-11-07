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

  return (
    <div className="categorias-container">
      <h2>Administración de Categorías</h2>

      <form className="categorias-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre Categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <table className="categorias-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
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
          ))}

          {categorias.length === 0 && (
            <tr>
              <td colSpan="3" className="no-data">
                No hay categorías registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategorias;
