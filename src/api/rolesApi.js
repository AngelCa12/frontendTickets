import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7001/api/Roles",
});

// Obtener todos los roles
export const getRoles = () => api.get("/");

// Obtener un rol por ID
export const getRolById = (id) => api.get(`/${id}`);

// Crear un nuevo rol
export const createRol = (rol) => api.post("/", rol);

// Actualizar un rol
export const updateRol = (id, rol) => api.put(`/${id}`, rol);

// Eliminar un rol
export const deleteRol = (id) => api.delete(`/${id}`);
