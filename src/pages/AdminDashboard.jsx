import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { Home, Users, Ticket, Layers, LogOut } from "lucide-react";
import logo from "../assets/logo.png";

//import DashboardHome from "../components/DashboardHome";
import AdminUsuarios from "../components/AdminUsuarios";
//import AdminCategorias from "../components/AdminCategorias";
import AdminTickets from "../components/AdminTickets";

function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="logo" />
          {!collapsed && <h3>CFLAG</h3>}
        </div>

        <div className="collapse-bar" onClick={() => setCollapsed(!collapsed)} />

        <nav className="sidebar-menu">
          <Link to="/admin/dashboard" className="sidebar-item">
            <Home size={20} />
            {!collapsed && <span>Inicio</span>}
          </Link>
          <Link to="/admin/usuarios" className="sidebar-item">
            <Users size={20} />
            {!collapsed && <span>Usuarios</span>}
          </Link>
          <Link to="/admin/categorias" className="sidebar-item">
            <Layers size={20} />
            {!collapsed && <span>Categorías</span>}
          </Link>
          <Link to="/admin/tickets" className="sidebar-item">
            <Ticket size={20} />
            {!collapsed && <span>Tickets</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="sidebar-item" onClick={() => localStorage.clear()}>
            <LogOut size={20} />
            {!collapsed && <span>Salir</span>}
          </Link>
        </div>
      </aside>

      {/* Contenido dinámico */}
      <main className="content">
        <Routes>
          {/*<Route path="dashboard" element={<DashboardHome />} />*/}
          <Route path="usuarios" element={<AdminUsuarios />} />
         {/*} <Route path="categorias" element={<AdminCategorias />} />*/}
          <Route path="tickets" element={<AdminTickets />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
