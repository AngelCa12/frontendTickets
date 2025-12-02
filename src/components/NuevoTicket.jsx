import { useState, useEffect } from "react";
import ticketService from "../api/ticketApi";
import { getCategorias } from "../api/categoriasApi";
import { useNavigate } from "react-router-dom";
import "../styles/UsuarioTickets.css";

const NuevoTicket = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    idCategoria: "",
    estado: "Pendiente",
    idUsuario: usuario?.id || null,
  });

  // Cargar categorías desde API
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await getCategorias();
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Crear ticket
  const crearTicket = async (e) => {
    e.preventDefault();

    try {
      await ticketService.create(form);
      alert("Ticket creado correctamente");
      navigate("/usuario/ticketsUsu");
    } catch (error) {
      console.error("Error al crear ticket:", error);
      alert("Hubo un error, revisa la consola");
    }
  };

  return (
    <div className="ticket-form">
      <h2>Crear Nuevo Ticket</h2>

      <form onSubmit={crearTicket}>
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

        <button className="btn-guardar" type="submit">
          Guardar Ticket
        </button>

        <button className="btn-cerrar" type="button" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default NuevoTicket;
