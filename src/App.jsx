import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UsuarioDashboard from "./pages/UsuarioDashboard";
import SoporteDashboard from "./pages/SoporteDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardSoporte from "./pages/DashboardSoporte";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboards protegidos */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute rol="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/soporte/*"
          element={
            <ProtectedRoute rol="Soporte">
              <SoporteDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuario/*"
          element={
            <ProtectedRoute rol="Usuario">
              <UsuarioDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
