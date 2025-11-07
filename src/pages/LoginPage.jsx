import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usuarioApi from "../api/usuarioApi";
import "../styles/LoginPage.css";
import logo from "../assets/icon.png"; 



function LoginPage() {
  const [loading, setLoading] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // Splash image
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
     const res = await usuarioApi.login({ email, password });
    const user = res.data;                  
    console.log("Usuario recibido:", user);   
    console.log("Redirigiendo a:", user.rol_nombre);

      localStorage.setItem("usuario", JSON.stringify(user));

      if (user.rol_nombre === "Admin") {
        navigate("/admin/dashboard");
      } else if (user.rol_nombre === "Soporte") {
        navigate("/soporte/dashboard");
      } else {
        navigate("/usuario/nuevo-ticket");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales incorrectas o error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="splash-container">
        <img src={logo} alt="Logo" className="splash-logo" />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Sistema de Tickets</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
