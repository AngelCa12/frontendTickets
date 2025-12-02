import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { Home, Users, Ticket, Layers, LogOut, Shield, Hospital } from "lucide-react";
import logo from "../assets/logo.png";

import AdminCategorias from "../components/AdminCategorias";
import AdminUsuarios from "../components/AdminUsuarios";
import AdminRoles from "../components/AdminRoles";
import AdminTickets from "../components/AdminTickets";
import AdminCategoriaUsuario from "../components/AdminCategoriaUsuario";
import DashboardPage from "../pages/DashboardPage";

function AdminDashboard() {
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
          <Link to="/admin" className="sidebar-item">
            <Home size={20} />
            {!collapsed && <span>Inicio</span>}
          </Link>

          <Link to="/admin/usuarios" className="sidebar-item">
            <Users size={20} />
            {!collapsed && <span>Usuarios</span>}
          </Link>

          <Link to="/admin/categoriaUsuario" className="sidebar-item">
            <Layers size={20} />
            {!collapsed && <span>Categorías Usuarios</span>}
          </Link>

          <Link to="/admin/tickets" className="sidebar-item">
            <Ticket size={20} />
            {!collapsed && <span>Tickets</span>}
          </Link>

          <Link to="/admin/roles" className="sidebar-item">
            <Shield size={20} />
            {!collapsed && <span>Roles</span>}
          </Link>

          <Link to="/admin/categorias" className="sidebar-item">
            <Hospital size={20} />
            {!collapsed && <span>Areas Clínica</span>}
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-footer">
          {/*<Link to="/login" className="sidebar-item" onClick={() => localStorage.clear()}>*/}
          <Link to="/login" className="sidebar-item" onClick={() => localStorage.removeItem("usuario")}>
            <LogOut size={20} />
            {!collapsed && <span>Cerrar Sesión</span>}
          </Link>
        </div>
      </aside>

      
      <main className="content">
        <Routes>

          {/* Pantalla inicial del Admin */}
          <Route index element={<DashboardPage />} />

          {/* Rutas internas */}
          <Route path="DashboardPage" element={<DashboardPage />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="categoriaUsuario" element={<AdminCategoriaUsuario />} />

          
          <Route path="*" element={<DashboardPage />} />

        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
