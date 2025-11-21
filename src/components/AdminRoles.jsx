import { useEffect, useState } from "react";
import "../styles/RolesAdmin.css";
import { getRoles, createRol, updateRol, deleteRol } from "../api/rolesApi";

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ nombre: "" });
  const [editarId, setEditarId] = useState(null);
  const [busqueda, setBusqueda] = useState(""); 

  // PAGINACIÓN
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 5;

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error al cargar roles");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editarId) {
        await updateRol(editarId, formData);
        alert("✅ Rol actualizado correctamente");
      } else {
        await createRol(formData);
        alert("✅ Rol creado correctamente");
      }
      setFormData({ nombre: "" });
      setEditarId(null);
      cargarRoles();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar el rol");
    }
  };

  const handleEditar = (rol) => {
    setFormData({ nombre: rol.nombre });
    setEditarId(rol.id);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Seguro que quieres eliminar este rol?")) {
      try {
        await deleteRol(id);
        alert("✅ Rol eliminado correctamente");
        cargarRoles();
      } catch (err) {
        console.error(err);
        alert("❌ Error al eliminar rol");
      }
    }
  };

  // FILTRAR ROLES POR NOMBRE
  const rolesFiltrados = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // PAGINACIÓN SOBRE RESULTADOS FILTRADOS
  const indexInicio = (pagina - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const rolesPaginados = rolesFiltrados.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(rolesFiltrados.length / registrosPorPagina);

  return (
    <div className="table-rol">
      <h2>Administrar Roles</h2>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar rol..."
        className="rol-buscador"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1); 
        }}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Agregar Rol"
          value={formData.nombre}
          onChange={(e) => setFormData({ nombre: e.target.value })}
          required
        />
        <button type="submit" className="btn-Crear">
          {editarId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <div className="table-roles">
        <table className="roles-table">
          <thead>
            <tr>
             {/*} <th>ID</th>*/}
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rolesPaginados.length > 0 ? (
              rolesPaginados.map((rol) => (
                <tr key={rol.id}>
                  {/*<td>{rol.id}</td>*/}
                  <td>{rol.nombre}</td>
                  <td>
                    <button onClick={() => handleEditar(rol)}>Editar</button>
                    <button onClick={() => handleEliminar(rol.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No hay roles registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
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

export default AdminRoles;
