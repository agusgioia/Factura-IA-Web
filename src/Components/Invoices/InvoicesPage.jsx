import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceService from "../../services/invoiceService";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import "./InvoicesPage.css";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta factura?")) {
      try {
        await invoiceService.deleteInvoice(id);
        setInvoices(invoices.filter((inv) => inv.id !== id));
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  return (
    <div className="invoices-container">
      <div className="invoices-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft size={20} /> Dashboard
        </button>
        <h1>Mis Facturas</h1>
        <button
          onClick={() => navigate("/invoices/upload")}
          className="btn-add"
        >
          <Plus size={20} /> Agregar Factura
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : invoices.length === 0 ? (
        <div className="empty-state">
          <p>No tienes facturas aún</p>
          <button
            onClick={() => navigate("/invoices/upload")}
            className="btn-primary"
          >
            Cargar tu primera factura
          </button>
        </div>
      ) : (
        <div className="invoices-table">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Emisor</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.tipo}</td>
                  <td>${invoice.monto.toFixed(2)}</td>
                  <td>{invoice.descripcion}</td>
                  <td>{invoice.emisor}</td>
                  <td>{new Date(invoice.fecha).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
