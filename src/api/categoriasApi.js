import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7001/api/Categoria",
});

// Obtener todas las categorías
export const getCategorias = () => api.get("/");

// Obtener categoría por ID
export const getCategoriaById = (id) => api.get(`/${id}`);

// Crear categoría
export const createCategoria = (categoria) => api.post("/", categoria);

// Actualizar categoría
export const updateCategoria = (id, categoria) =>
  api.put(`/${id}`, categoria);

// Eliminar categoría
export const deleteCategoria = (id) => api.delete(`/${id}`);
