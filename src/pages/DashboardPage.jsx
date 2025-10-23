import { useState } from "react";
import "../styles/Dashboard.css";
import { Home, Users, Ticket, LogOut } from "lucide-react"; 
import logo from "../assets/logo.png";

function Dashboard() {
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
          <a href="/admin/dashboard" className="sidebar-item">
            <Home size={20} />
            {!collapsed && <span>Inicio</span>}
          </a>
          <a href="/admin/usuarios" className="sidebar-item">
            <Users size={20} />
            {!collapsed && <span>Usuarios</span>}
          </a>
          <a href="/admin/tickets" className="sidebar-item">
            <Ticket size={20} />
            {!collapsed && <span>Tickets</span>}
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="/logout" className="sidebar-item">
            <LogOut size={20} />
            {!collapsed && <span>Salir</span>}                                                                                                                                                                                    
          </a>
        </div>
      </aside>

      <main className="content">
        <h1>Bienvenido</h1>
        <p>Prueba de linea reflejada en texto ✨</p>
      </main>
    </div>
  );
}

export default Dashboard;

