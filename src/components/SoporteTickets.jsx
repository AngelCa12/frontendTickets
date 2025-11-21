import { useEffect, useState } from "react";
import ticketService from "../api/ticketApi";
import { useNavigate } from "react-router-dom";
import "../styles/SoporteTickets.css";

function SoporteTickets() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || null;
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const [estadoEdit, setEstadoEdit] = useState({});

  const registrosPorPagina = 5;

  const cargarTickets = async () => {
    try {
      const res = await ticketService.getByUser(usuario.id);
      setTickets(res.data);
    } catch (error) {
      console.error("Error al cargar tickets asignados:", error);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, []);


  // ----------------------------
  // GUARDAR ESTADO EN LA DB
  // ----------------------------
const guardarEstado = async (idTicket) => {
    const nuevoEstado = estadoEdit[idTicket];

    try {
        await ticketService.cambiarEstado(idTicket, nuevoEstado);
        await cargarTickets();

        setEstadoEdit((prev) => {
            const copia = { ...prev };
            delete copia[idTicket];
            return copia;
        });

        alert("✔ Estado actualizado correctamente");

    } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("❌ Error al actualizar estado");
    }
};


  // ----------------------------
  // FILTRO
  // ----------------------------
  const ticketsFiltrados = tickets.filter((t) => {
    const titulo = t.titulo?.toLowerCase() ?? "";
    const descripcion = t.descripcion?.toLowerCase() ?? "";
    const categoria = t.categoriaNombre?.toLowerCase() ?? "";

    const busq = busqueda.toLowerCase();

    return (
      titulo.includes(busq) ||
      descripcion.includes(busq) ||
      categoria.includes(busq)
    );
  });

  // ----------------------------
  // PAGINACIÓN
  // ----------------------------
  const indexInicio = (pagina - 1) * registrosPorPagina;
  const ticketsPagina = ticketsFiltrados.slice(indexInicio, indexInicio + registrosPorPagina);
  const totalPaginas = Math.ceil(ticketsFiltrados.length / registrosPorPagina);

  const verDetalles = (idTicket) => {
    navigate(`/soporte/ticket/${idTicket}`);
  };

  return (
    <div className="tickets-container">
      <h1>Tickets Asignados</h1>

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

      <div className="table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ticketsPagina.length > 0 ? (
              ticketsPagina.map((t) => (
                <tr key={t.id}>
                  <td>{t.titulo}</td>
                  <td>{t.descripcion}</td>
                  <td>{t.categoriaNombre}</td>

                  <td>
                    {/* SELECT para editar estado */}
                    <select
                      value={estadoEdit[t.id] ?? t.estado}
                      onChange={(e) =>
                        setEstadoEdit({
                          ...estadoEdit,
                          [t.id]: e.target.value,
                        })
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>

                    {/* Mostrar botón GUARDAR si hubo cambios */}
                    {estadoEdit[t.id] && estadoEdit[t.id] !== t.estado && (
                      <button
                        className="btn-guardar-estado"
                        onClick={() => guardarEstado(t.id)}
                      >
                        Guardar
                      </button>
                    )}
                  </td>

                  <td>{new Date(t.fechaCreacion).toLocaleString("es-ES")}</td>

                  <td>
                    <button className="btn-detalles" onClick={() => verDetalles(t.id)}>
                      Ver Detalles 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay tickets asignados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="tickets-pagination">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          ⬅
        </button>

        <span>Página {pagina} de {totalPaginas}</span>

        <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>
          ➡
        </button>
      </div>
    </div>
  );
}

export default SoporteTickets;
