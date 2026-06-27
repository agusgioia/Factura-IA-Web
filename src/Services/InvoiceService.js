import api from "./api";

const invoiceService = {
  uploadInvoice: async (formData) => {
    const response = await api.post("/facturas", formData);
    return response.data;
  },

  getInvoices: async () => {
    const response = await api.get("/facturas");
    return response.data;
  },

  deleteInvoice: async (id) => {
    await api.delete(`/facturas/${id}`);
  },

  sendMessage: async (mensaje) => {
    const response = await api.post("/chat/message", { mensaje });
    return response.data;
  },

  getChatHistory: async () => {
    const response = await api.get("/chat/historial");
    return response.data;
  },
};

export default invoiceService;
