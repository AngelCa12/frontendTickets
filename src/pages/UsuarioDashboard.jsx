import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { Home, Ticket, LogOut } from "lucide-react";
import logo from "../assets/logo.png";
import DashboardPage from "../pages/DashboardPage";
import DashboardSoporte from "../pages/DashboardSoporte";
import SoporteTickets from "../components/SoporteTickets";
import SoporteTicketDetalle from "../components/SoporteTicketDetalle";

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

          <Link to="/usuario/tickets" className="sidebar-item">
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

          {/* Pantalla inicial del soporte */}
          <Route index element={<DashboardSoporte />} />

          {/* Rutas internas 
          <Route path="dashboard" element={<DashboardSoporte />} />
          <Route path="DashboardPage" element={<DashboardPage />} />
          <Route path="tickets" element={<SoporteTickets />}/>
          <Route path="ticket/:id" element={<SoporteTicketDetalle />} />

          {/* Ruta desconocida → dashboard 
          <Route path="*" element={<DashboardSoporte />} />
                */}
        </Routes>
      </main>
    </div>
  );
}

export default UsuarioDashboard;
