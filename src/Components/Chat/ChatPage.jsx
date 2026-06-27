import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import invoiceService from "../../services/invoiceService";
import { Send, ArrowLeft } from "lucide-react";
import "./ChatPage.css";

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await invoiceService.getChatHistory();
        setMessages(history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { mensaje: input, rol: "USER", respuesta: null };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await invoiceService.sendMessage(input);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error al enviar mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <ArrowLeft size={20} /> Dashboard
        </button>
        <h1>💬 Asistente IA</h1>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>Hola! Soy tu asistente fiscal. Puedo ayudarte con:</p>
            <ul>
              <li>Cálculo de IVA y retenciones</li>
              <li>Categorías monotributistas</li>
              <li>Preguntas sobre impuestos</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.rol.toLowerCase()}`}>
              <div className="message-content">
                {msg.rol === "USER" ? msg.mensaje : msg.respuesta}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu pregunta..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
