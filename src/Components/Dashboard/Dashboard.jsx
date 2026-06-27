import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/Api";
import authService from "../../Services/AuthService";
import { LogOut, Plus, MessageSquare } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const user = authService.getUser();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/facturas/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>📊 Factura IA</h1>
        <div className="nav-right">
          <span>{user?.nombre}</span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Dashboard</h2>

        {dashboard && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Ingresos</h3>
              <p className="stat-value">
                ${dashboard.totalIngresos.toFixed(2)}
              </p>
            </div>
            <div className="stat-card">
              <h3>Egresos</h3>
              <p className="stat-value">${dashboard.totalEgresos.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Saldo</h3>
              <p className="stat-value">${dashboard.saldo.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>IVA a Pagar</h3>
              <p className="stat-value">${dashboard.ivaAPagar.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/invoices")}
          >
            <Plus size={20} /> Agregar Factura
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare size={20} /> Chat IA
          </button>
        </div>
      </div>
    </div>
  );
}
