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
  const [mensaje, setMensaje] = useState("");
  const [editarId, setEditarId] = useState(null);

  const rolesDisponibles = [
    { value: "admin", label: "Administrador" },
    { value: "soporte", label: "Soporte Técnico" },
    { value: "usuario", label: "Usuario General" },
  ];

  // Cargar usuarios al montar
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await usuarioApi.getAll();
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editarId) {
        // Editar usuario
        await usuarioApi.update(editarId, formData);
        setMensaje("Usuario actualizado correctamente");
      } else {
        // Crear usuario
        await usuarioApi.create(formData);
        setMensaje("Usuario creado correctamente");
      }
      setFormData({ Nombre: "", Email: "", Password: "", Rol: "" });
      setEditarId(null);

      // Recargar usuarios
      const res = await usuarioApi.getAll();
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setMensaje("Error al guardar el usuario");
    }
  };

  const handleEditar = (usuario) => {
    setFormData({
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      Password: "", 
      Rol: usuario.Rol,
    });
    setEditarId(usuario.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      try {
        await usuarioApi.remove(id);
        setMensaje("Usuario eliminado correctamente");
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setMensaje("Error al eliminar el usuario");
      }
    }
  };

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
        <select
          name="Rol"
          value={formData.Rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un rol</option>
          {rolesDisponibles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-guardar">
  {editarId ? "Actualizar Usuario" : "Guardar Usuario"}
</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <h3>Usuarios existentes</h3>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.Nombre}</td>
              <td>{usuario.Email}</td>
              <td>{usuario.Rol}</td>
              <td>
                <button onClick={() => handleEditar(usuario)}>Editar</button>
                <button onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;
