import { useEffect, useState } from "react";
import usuarioApi from "../api/usuarioApi";
import ticketApi from "../api/ticketApi";
import "../styles/DashboardPage.css";

import { 
  PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";

const DashboardPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resUsuarios = await usuarioApi.getAll();
      setUsuarios(resUsuarios.data);

      const resTickets = await ticketApi.getAll();
      setTickets(resTickets.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert("❌ Error al cargar datos del dashboard");
    }
  };

  // Tickets por estado
  const estadosTickets = tickets.reduce((acc, t) => {
    acc[t.estado] = (acc[t.estado] || 0) + 1;
    return acc;
  }, {});

  const dataTicketsEstado = Object.keys(estadosTickets).map((key) => ({
    name: key,
    value: estadosTickets[key],
  }));

  // Tickets por área
  const areasTickets = tickets.reduce((acc, t) => {
    const nombreArea = t.categoriaNombre?.trim() || "Sin categoría";
    acc[nombreArea] = (acc[nombreArea] || 0) + 1;
    return acc;
  }, {});

  const dataTicketsArea = Object.keys(areasTickets).map((key) => ({
    name: key,
    value: areasTickets[key],
  }));

  const COLORS = ["#0088FE", "#00c452ff", "#f70303ff", "#FF8042", "#A569BD", "#FF6F61"];

  return (
    <div className="dashboard-container">
      <h1>Dashboard Gráfico</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Usuarios</h3>
          <p>{usuarios.length}</p>
        </div>

        <div className="card">
          <h3>Total Tickets</h3>
          <p>{tickets.length}</p>
        </div>
      </div>

      <div className="dashboard-charts">

        {/* Tickets por Estado */}
        <div className="chart">
          <h3>Tickets por Estado</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={dataTicketsEstado}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {dataTicketsEstado.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend formatter={(value) => <span style={{ color: "black" }}>{value}</span>} />
          </PieChart>
        </div>

        {/* Tickets por Área (BarChart normal, sin cambios) */}
        <div className="chart">
          <h3>Tickets por Área</h3>
          <BarChart
            width={500}
            height={300}
            data={dataTicketsArea}
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
                {/* <Legend /> eliminar la leyenda para que no aparezca el "value: 1" */}
                <Bar dataKey="value" fill="#0cc5ddff" />
              </BarChart>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
