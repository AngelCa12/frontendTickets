import { useEffect, useState } from "react";
import usuarioApi from "../api/usuarioApi";
import ticketApi from "../api/ticketApi";
import "../styles/SoporteDashboard.css";
import { 
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const DashboardSoporte = () => {
  const [usuario, setUsuario] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [estadoActivo, setEstadoActivo] = useState(false);

   const COLORS = ["#0088FE", "#00c452ff", "#f70303ff", "#FF8042", "#A569BD", "#FF6F61"];
/*
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser) {
      setUsuario(storedUser);
      //setEstadoActivo(storedUser.activo || false);
      setEstadoActivo(Boolean(storedUser.activo));
      cargarTickets(storedUser.id);
    }
  }, []);
*/
const cargarUsuarioActualizado = async (idUsuario) => {
  try {
    const res = await usuarioApi.getById(idUsuario);

    setUsuario(res.data);
    setEstadoActivo(Boolean(res.data.activo));

    // actualiza LocalStorage
    localStorage.setItem("usuario", JSON.stringify(res.data));
  } catch (err) {
    console.error("Error al cargar usuario:", err);
  }
};


useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("usuario"));
  if (storedUser) {
    cargarUsuarioActualizado(storedUser.id);
    cargarTickets(storedUser.id);
  }
}, []);

const cargarTickets = async (idUsuario) => {
  try {
    const res = await ticketApi.getBySoporte(idUsuario);
    setTickets(res.data);
  } catch (err) {
    console.error("Error al cargar tickets:", err);
    alert("❌ Error al cargar los tickets asignados");
  }
};




const cambiarEstado = async () => {
  try {
    const nuevoEstado = !estadoActivo;

    console.log("Llamando a cambiarEstado con:", usuario.id, nuevoEstado);

    await usuarioApi.cambiarEstado(usuario.id, { activo: nuevoEstado });

    setEstadoActivo(nuevoEstado);

    localStorage.setItem(
      "usuario",
      JSON.stringify({ ...usuario, activo: nuevoEstado })
    );

    alert(`✅ Tu estado ha cambiado a: ${nuevoEstado ? "Activo" : "Inactivo"}`);
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    alert("❌ No se pudo actualizar el estado del usuario");
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

  // Tickets por categoría o área
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
      <h1>Dashboard de Soporte</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Tickets Asignados</h3>
          <p>{tickets.length}</p>
        </div>

        <div className="card">
          <h3>Estado del Usuario</h3>
          <p className={estadoActivo ? "activo" : "inactivo"}>
            {estadoActivo ? "Activo" : "Inactivo"}
          </p>
          <button onClick={cambiarEstado} className="btn-estado">
            Cambiar a {estadoActivo ? "Inactivo" : "Activo"}
          </button>
        </div>
      </div>

      <div className="dashboard-charts">
        {/* Tickets por Estado */}
        <div className="chart">
          <h3>Mis Tickets por Estado</h3>
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

        {/* Tickets por Categoría */}
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
            <Bar dataKey="value" fill="#0cc5ddff" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardSoporte;
