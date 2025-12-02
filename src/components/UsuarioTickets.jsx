import { useEffect, useState } from "react";
import ticketService from "../api/ticketApi";
import { useNavigate } from "react-router-dom";
import "../styles/UsuarioTickets.css";

const UsuarioTickets = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  /*// PROTECCIÓN: Solo usuarios normales pueden entrar aquí
if (usuario?.rol_nombre !== "Usuario") {
  return <h2>No tienes permisos para ver esta página</h2>;
}*/   

  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const ticketsPorPagina = 5;

  useEffect(() => {
    if (!usuario) return;

    ticketService
      .getByUser(usuario.id)
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar tickets:", err);
      });
  }, []);

  // -----------------------------
  // FILTRO POR BUSQUEDA
  // -----------------------------
 const ticketsFiltrados = tickets.filter((t) => {
  return (
    (t.titulo || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.descripcion || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.categoriaNombre || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.usuarioNombre || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.estado || "").toLowerCase().includes(search.toLowerCase())
  );
});


  // -----------------------------
  // PAGINACION
  // -----------------------------
  const indexInicio = (paginaActual - 1) * ticketsPorPagina;
  const indexFinal = indexInicio + ticketsPorPagina;

  const ticketsPaginados = ticketsFiltrados.slice(indexInicio, indexFinal);

  const totalPaginas = Math.ceil(ticketsFiltrados.length / ticketsPorPagina);

  return (
    <div className="contenedor-tickets-user">
      <h2>Mis Tickets</h2>

      <button
        className="btn-crear"
        onClick={() => navigate("/usuario/nuevo-ticket")}
      >
        Nuevo Ticket
      </button>

      {/* BARRA DE BUSQUEDA */}
      <input
        type="text"
        placeholder="Buscar Ticket"
        className="input-buscar"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPaginaActual(1);
        }}
      />

      <table className="tabla-tickets">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Fecha Creacion</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {ticketsPaginados.map((t) => (
            <tr key={t.id}>
            <td>{t.titulo}</td>
            <td>{t.descripcion}</td>
            <td>{t.categoriaNombre}</td>
            <td>{t.usuarioNombre}</td>
            <td>{t.estado}</td>
            <td>{new Date(t.fechaCreacion).toLocaleString("es-ES")}</td>
              <td>
                <button
                  className="btn-detalle"
                  onClick={() => navigate(`/usuario/ticket/${t.id}`)}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}

          {ticketsFiltrados.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No se encontraron tickets.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINACION */}
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>

          <span>
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default UsuarioTickets;
