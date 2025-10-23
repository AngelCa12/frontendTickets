import { useEffect, useState } from "react";
import ticketApi from "../api/ticketApi";

function AdminTickets() {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div>
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
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.titulo}</td>
                  <td>{t.descripcion}</td>
                  <td>{t.categoriaNombre}</td>
                  <td>{t.usuarioNombre}</td>
                  <td>{t.estado}</td>
                  <td>{t.fecha_creacion}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay tickets registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTickets;
