import { useEffect, useState } from "react";
import ticketApi from "../api/ticketapi";
import "../styles/TicketsAdmin.css";


function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 10;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await ticketApi.getAll();
        setTickets(res.data);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  // ✅ Calcular los registros de la página actual
  const indexInicio = (pagina - 1) * registrosPorPagina;
  const indexFin = indexInicio + registrosPorPagina;
  const ticketsPagina = tickets.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(tickets.length / registrosPorPagina);

  return (
  <div className="tickets-container">
    <h1>Tickets registrados</h1>
    <p>Listado general de todos los tickets del sistema.</p>

    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Área Clínica</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {ticketsPagina.length > 0 ? (
            ticketsPagina.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.titulo}</td>
                <td>{t.descripcion}</td>
                <td>{t.categoriaNombre}</td>
                <td>{t.usuarioNombre}</td>
                <td>{t.estado}</td>
                <td>{new Date(t.fechaCreacion).toLocaleString("es-ES")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay tickets registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* PAGINACIÓN */}
    <div className="tickets-pagination">
      <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
        ⬅ Anterior
      </button>

      <span>Página {pagina} de {totalPaginas}</span>

      <button
        disabled={pagina === totalPaginas}
        onClick={() => setPagina(pagina + 1)}
      >
        Siguiente ➡
      </button>
    </div>
  </div>
);
}

export default AdminTickets;
