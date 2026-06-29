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

        // Aplanamos el historial para que cada pregunta y respuesta sea un mensaje individual
        const flattenedHistory = [];
        history.forEach((item) => {
          if (item.mensaje)
            flattenedHistory.push({ texto: item.mensaje, esUsuario: true });
          if (item.respuesta)
            flattenedHistory.push({ texto: item.respuesta, esUsuario: false });
        });

        setMessages(flattenedHistory);
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

    // 1. Agregamos el mensaje del usuario al chat
    const userMessage = { texto: input, esUsuario: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await invoiceService.sendMessage(input);

      // 2. Agregamos la respuesta de la IA como un nuevo mensaje independiente
      const botMessage = { texto: response.respuesta, esUsuario: false };
      setMessages((prev) => [...prev, botMessage]);
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
            <p>¡Hola! Soy tu asistente fiscal...</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.esUsuario ? "user" : "assistant"}`}
            >
              <div className="message-content">{msg.texto}</div>
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
