import axiosClient from "./axiosClient";

const categoriaUsuarioApi = {
  getAll: () => axiosClient.get("/CategoriaUsuario"),
  create: (data) => axiosClient.post("/CategoriaUsuario", data),
  update: (id, data) => axiosClient.put(`/CategoriaUsuario/${id}`, data),
};

export default categoriaUsuarioApi;
