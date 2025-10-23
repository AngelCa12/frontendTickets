import axiosClient from "./axiosClient";

const usuarioApi = {
  getAll: () => axiosClient.get("/Usuario"),
  getById: (id) => axiosClient.get(`/Usuario/${id}`),
  create: (data) => axiosClient.post("/Usuario", data),
  update: (id, data) => axiosClient.put(`/Usuario/${id}`, data),
  remove: (id) => axiosClient.delete(`/Usuario/${id}`),
  login: (data) => axiosClient.post("Usuario/login", { 
    Email: data.email,      
    Password: data.password 
  }),
};


export default usuarioApi;
