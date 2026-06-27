import { useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceService from "../../services/invoiceService";
import { Upload, ArrowLeft } from "lucide-react";
import "./UploadInvoice.css";

export default function UploadInvoice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "INGRESO",
    monto: "",
    descripcion: "",
    emisor: "",
  });
  const [archivo, setArchivo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.monto || !formData.tipo) {
      alert("Completa los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append(
        "factura",
        new Blob([JSON.stringify(formData)], { type: "application/json" }),
      );
      if (archivo) {
        data.append("archivo", archivo);
      }

      await invoiceService.uploadInvoice(data);
      alert("Factura cargada exitosamente");
      navigate("/invoices");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Error al cargar factura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button onClick={() => navigate("/invoices")} className="back-btn">
          <ArrowLeft size={20} /> Volver
        </button>
        <h1>Cargar Factura</h1>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo *</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
        </div>

        <div className="form-group">
          <label>Monto *</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            placeholder="1000.00"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción de la factura"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Emisor</label>
          <input
            type="text"
            name="emisor"
            value={formData.emisor}
            onChange={handleChange}
            placeholder="Nombre del emisor"
          />
        </div>

        <div className="form-group">
          <label>Archivo (PDF/Imagen)</label>
          <div className="file-input">
            <Upload size={30} />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p>{archivo ? archivo.name : "Selecciona un archivo"}</p>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Cargando..." : "Cargar Factura"}
        </button>
      </form>
    </div>
  );
}
