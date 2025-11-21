import axios from "axios";

const comentarioApi = axios.create({
  baseURL: "https://localhost:7001/api/Comentario",
  headers: {
    "Content-Type": "application/json",
  },
});

const comentarioService = {
  obtenerPorTicket: (idTicket) =>
    comentarioApi.get(`/${idTicket}`),

  crear: (data) =>
    comentarioApi.post("/", data),

  actualizar: (id, data) =>
    comentarioApi.put(`/${id}`, data),

  eliminar: (id) =>
    comentarioApi.delete(`/${id}`)
};

export default comentarioService;
