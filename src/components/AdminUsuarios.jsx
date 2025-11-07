import { useState, useEffect } from "react";
import usuarioApi from "../api/usuarioApi";
import "../styles/UsuariosAdmin.css";

function AdminUsuarios() {
  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Password: "",
    Rol: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [editarId, setEditarId] = useState(null);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const rolesDisponibles = [
    { id: 1, value: "admin", label: "Administrador" },
    { id: 2, value: "soporte", label: "Soporte Técnico" },
    { id: 3, value: "usuario", label: "Usuario General" },
  ];

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await usuarioApi.getAll();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("❌ Error al cargar usuarios");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.Rol) {
        alert("Debe seleccionar un rol");
        return;
      }

      const payload = {
        Id: editarId || 0,
        Nombre: formData.Nombre,
        Email: formData.Email,
        Password: formData.Password || "Casa1234",
        IdRol: Number(formData.Rol),
        RolNombre: "",
      };

      if (editarId) {
        await usuarioApi.update(editarId, payload);
        alert("✅ Usuario actualizado correctamente");
      } else {
        await usuarioApi.create(payload);
        alert("✅ Usuario creado correctamente");
      }

      setFormData({ Nombre: "", Email: "", Password: "", Rol: "" });
      setEditarId(null);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("❌ Error al guardar el usuario");
    }
  };

  const handleEditar = (usuario) => {
    setFormData({
      Nombre: usuario.nombre,
      Email: usuario.email,
      Password: "",
      Rol: usuario.idRol.toString(),
    });

    setEditarId(usuario.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await usuarioApi.remove(id);
        alert("✅ Usuario eliminado correctamente");
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("❌ Error al eliminar el usuario");
      }
    }
  };

  // LÓGICA DE PAGINACIÓN
  const indexUltimo = paginaActual * registrosPorPagina;
  const indexPrimero = indexUltimo - registrosPorPagina;
  const usuariosPaginados = usuarios.slice(indexPrimero, indexUltimo);

  const totalPaginas = Math.ceil(usuarios.length / registrosPorPagina);

  return (
    <div className="usuarios-container">
      <h2>{editarId ? "Editar usuario" : "Registrar nuevo usuario"}</h2>

      <form className="usuarios-form" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          required
        />

        <label>Correo electrónico:</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required={!editarId}
        />

        <label>Rol:</label>
        <select name="Rol" value={formData.Rol} onChange={handleChange} required>
          <option value="">Seleccione un Rol</option>
          {rolesDisponibles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-guardar">
          {editarId ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>
      </form>

      <h3>Usuarios existentes</h3>

      <div className="usuarios-table-wrapper">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol_nombre}</td>
                <td>{usuario.password}</td>
                <td>
                  <button onClick={() => handleEditar(usuario)}>Editar</button>
                  <button onClick={() => handleEliminar(usuario.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BOTONES DE PAGINACIÓN */}
      <div className="paginacion">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          ◀ Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
}

export default AdminUsuarios;
