import { useEffect, useState } from "react";
import ticketService from "../api/ticketApi";
import { getCategorias } from "../api/categoriasApi";
import "../styles/TicketsAdmin.css";

function AdminTickets() {
  // Obtener usuario logueado UNA SOLA VEZ
  const usuario = JSON.parse(localStorage.getItem("usuario")) || null;

  // Aviso si no hay usuario cargado
  if (!usuario) {
    console.error("⚠ No hay usuario logueado en localStorage");
  }

  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const registrosPorPagina = 5;

  // Formulario con idUsuario correcto
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    estado: "Pendiente",
    idUsuario: usuario?.id || null,
    idCategoria: "",

  });

  // Cargar tickets
  const cargarTickets = async () => {
    try {
      const res = await ticketService.getAll();
      setTickets(res.data);
    } catch (error) {
      console.error("Error al cargar tickets:", error);
    }
  };
  console.log("Tickets recibidos:", tickets);


  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarTickets();
    cargarCategorias();
  }, []);

  // Abrir formulario para nuevo ticket
  const nuevoTicket = () => {
    setEditando(null);

    setForm({
      titulo: "",
      descripcion: "",
      estado: "Pendiente",
      idUsuario: usuario?.id || null, 
      idCategoria: "",
    });

    setMostrarForm(true);
    window.scrollTo(0, 0);
  };

  // Editar ticket
  const editarTicket = (t) => {
    setEditando(t.id);
    setForm({
      titulo: t.titulo,
      descripcion: t.descripcion,
      estado: t.estado,
      idUsuario: t.idUsuario,
      idCategoria: t.idCategoria,
    });

    setMostrarForm(true);
    window.scrollTo(0, 0);
  };

  // Guardar ticket 
  const guardarTicket = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await ticketService.update(editando, form);
      } else {
        await ticketService.create(form);
      }

      setMostrarForm(false);
      cargarTickets();
    } catch (error) {
      console.error("Error al guardar ticket:", error);
    }
  };

  // Eliminar ticket
  const eliminarTicket = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este ticket?")) return;

    try {
      await ticketService.remove(id);
      cargarTickets();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Filtro
  const ticketsFiltrados = tickets.filter(
    (t) =>
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.usuarioNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Paginación
  const indexInicio = (pagina - 1) * registrosPorPagina;
  const ticketsPagina = ticketsFiltrados.slice(
    indexInicio,
    indexInicio + registrosPorPagina
  );
  const totalPaginas = Math.ceil(ticketsFiltrados.length / registrosPorPagina);

  return (
    <div className="tickets-container">
      <h1>Administración de Tickets</h1>

      {/* BOTÓN CREAR */}
      <button className="btn-crear" onClick={nuevoTicket}>
        ➕ Nuevo Ticket
      </button>

      {/* FORMULARIO */}
      {mostrarForm && (
        <div className="ticket-form">
          <h2>{editando ? "Editar Ticket" : "Crear Ticket"}</h2>

          <form onSubmit={guardarTicket}>
            <input
              type="text"
              placeholder="Título"
              required
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />

            <textarea
              placeholder="Descripción"
              required
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />

            <label>Categoría</label>
            <select
              required
              value={form.idCategoria}
              onChange={(e) =>
                setForm({ ...form, idCategoria: e.target.value })
              }
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <label>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
            </select>

            <button className="btn-guardar" type="submit">
              Guardar
            </button>

            <button
              className="btn-cerrar"
              type="button"
              onClick={() => setMostrarForm(false)}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* BUSCADOR */}
      <input
        type="text"
        className="ticket-buscador"
        placeholder="Buscar ticket..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1);
        }}
      />

      {/* TABLA */}
      <div className="table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
              <th>Soporte</th>
            </tr>
          </thead>

          <tbody>
            {ticketsPagina.length > 0 ? (
              ticketsPagina.map((t) => (
                <tr key={t.id}>
                  <td>{t.titulo}</td>
                  <td>{t.descripcion}</td>
                  <td>{t.categoriaNombre}</td>
                  <td>{t.usuarioNombre}</td>
                  <td>{t.estado}</td>
                  <td>{new Date(t.fechaCreacion).toLocaleString("es-ES")}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => editarTicket(t)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarTicket(t.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                  <td>{t.soporteNombre || 'No_Asignado'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay tickets disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="tickets-pagination">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          ⬅
        </button>

        <span>
          Página {pagina} de {totalPaginas}
        </span>

        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >
          ➡
        </button>
      </div>
    </div>
  );
}

export default AdminTickets;
