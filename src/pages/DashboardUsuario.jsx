import { useEffect, useState } from "react";
import usuarioApi from "../api/usuarioApi";
import ticketApi from "../api/ticketApi";
import "../styles/SoporteDashboard.css"; 
import { 
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const DashboardUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [tickets, setTickets] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FF0000", "#FF8042", "#A569BD", "#FF6F61"];

  // Carga usuario y tickets del usuario
  const cargarUsuarioActualizado = async (idUsuario) => {
    try {
      const res = await usuarioApi.getById(idUsuario);
      setUsuario(res.data);
      localStorage.setItem("usuario", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error al cargar usuario:", err);
    }
  };

  const cargarTickets = async (idUsuario) => {
    try {
      const res = await ticketApi.getByUser(idUsuario); 
      setTickets(res.data);
    } catch (err) {
      console.error("Error al cargar tickets:", err);
      alert("❌ Error al cargar tus tickets");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser) {
      cargarUsuarioActualizado(storedUser.id);
      cargarTickets(storedUser.id);
    }
  }, []);

  // Tickets por estado
  const estadosTickets = tickets.reduce((acc, t) => {
    acc[t.estado] = (acc[t.estado] || 0) + 1;
    return acc;
  }, {});

  const dataTicketsEstado = Object.keys(estadosTickets).map((key) => ({
    name: key,
    value: estadosTickets[key],
  }));

  // Tickets por categoría
  const categoriasTickets = tickets.reduce((acc, t) => {
    const nombreCategoria = t.categoriaNombre?.trim() || "Sin categoría";
    acc[nombreCategoria] = (acc[nombreCategoria] || 0) + 1;
    return acc;
  }, {});

  const dataTicketsCategoria = Object.keys(categoriasTickets).map((key) => ({
    name: key,
    value: categoriasTickets[key],
  }));

  return (
    <div className="dashboard-container">
      <h1>Dashboard del Usuario</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Mis Tickets Creados</h3>
          <p>{tickets.length}</p>
        </div>

        <div className="card">
          <h3>Bienvenido</h3>
          <p>{usuario?.nombre}</p>
        </div>
      </div>

      <div className="dashboard-charts">

        {/* Gráfico: Tickets por Estado */}
        <div className="chart">
          <h3>Mis Tickets por Estado</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={dataTicketsEstado}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {dataTicketsEstado.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Gráfico: Tickets por Categoría */}
        <div className="chart">
          <h3>Mis Tickets por Categoría</h3>
          <BarChart
            width={500}
            height={300}
            data={dataTicketsCategoria}
            margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-25} 
              textAnchor="end" 
              interval={0} 
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0cc5dd" />
          </BarChart>
        </div>

      </div>

    </div>
  );
};

export default DashboardUsuario;
