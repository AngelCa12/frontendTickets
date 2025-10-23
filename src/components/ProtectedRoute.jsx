import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, rol }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== rol) {
    switch (usuario.rol) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "soporte":
        return <Navigate to="/soporte/dashboard" replace />;
      case "usuario":
        return <Navigate to="/usuario/nuevo-ticket" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
