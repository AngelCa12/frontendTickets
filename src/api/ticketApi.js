import axios from "axios";

const ticketApi = axios.create({
  baseURL: "https://localhost:7001/api/Ticket", 
  headers: {
    "Content-Type": "application/json",
  },
});

const ticketService = {
  // 🔹 Obtener todos los tickets
  getAll: () => ticketApi.get("/"),

  // 🔹 Obtener ticket por ID
  getById: (id) => ticketApi.get(`/${id}`),

  // 🔹 Crear ticket nuevo
  create: (data) => ticketApi.post("/", data),

  // 🔹 Actualizar ticket
  update: (id, data) => ticketApi.put(`/${id}`, data),

  // 🔹 Cambiar estado de ticket
 // cambiarEstado: (id, nuevoEstado) =>
   // ticketApi.put(`/estado/${id}`, { estado: nuevoEstado }),
 cambiarEstado: (id, nuevoEstado) =>
  ticketApi.put(`/estado/${id}`, JSON.stringify(nuevoEstado), {
    headers: { "Content-Type": "application/json" }
  }),


  // 🔹 Eliminar ticket
  remove: (id) => ticketApi.delete(`/${id}`),

  getByUser: (idUsuario) => ticketApi.get(`/usuario/${idUsuario}`),

getBySoporte: (idSoporte) => ticketApi.get(`/soporte/${idSoporte}`),


};

export default ticketService;
