import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { Home, Ticket, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import UsuarioTickets from "../components/UsuarioTickets";
import DashboardUsuario from "../pages/DashboardUsuario";
import NuevoTicket from "../components/NuevoTicket";
import UsuarioTicketDetalle from "../components/UsuarioTicketDetalle";

function UsuarioDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard">
      
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          {!collapsed && <h3>CFLAG</h3>}
        </div>

        <div className="collapse-bar" onClick={() => setCollapsed(!collapsed)} />

        <nav className="sidebar-menu">
          <Link to="/usuario/dashboard" className="sidebar-item">
            <Home size={20} />
            {!collapsed && <span>Inicio</span>}
          </Link>

          <Link to="/usuario/ticketsUsu" className="sidebar-item">
            <Ticket size={20} />
            {!collapsed && <span>Mis Tickets</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/login"
            className="sidebar-item"
            onClick={() => localStorage.clear()}
          >
            <LogOut size={20} />
            {!collapsed && <span>Cerrar Sesión</span>}
          </Link>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="content">
        <Routes>

          {/* Pantalla inicial del usuario */}
          <Route index element={<DashboardUsuario/>} />

          {/* Rutas internas */}
          <Route path="ticketsUsu" element={<UsuarioTickets />} />
          <Route path="nuevo-ticket" element={<NuevoTicket />} />
          <Route path="ticket/:id" element={<UsuarioTicketDetalle />} />

          {/* Ruta desconocida → dashboard */}
          <Route path="*" element={<DashboardUsuario/>} />
                
        </Routes>
      </main>
    </div>
  );
}

export default UsuarioDashboard;








