// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario de localStorage al inicio
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser) setUsuario(storedUser);
  }, []);

  // Guardar cambios en localStorage cuando usuario cambie
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};
