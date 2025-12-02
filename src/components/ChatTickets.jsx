import { useEffect, useState, useRef } from "react";
import comentarioApi from "../api/comentarioApi";
import "../styles/ChatTickets.css";

const ChatTicket = ({ idTicket, usuario }) => {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const chatRef = useRef(null);

  // Cargar comentarios
  const cargarMensajes = async () => {
    try {
      const res = await comentarioApi.obtenerPorTicket(idTicket);
      setMensajes(res.data);
    } catch (e) {
      console.error("Error al cargar mensajes:", e);
    }
  };

/*
const cargarMensajes = async () => {
  try {
    const res = await comentarioApi.obtenerPorTicket(idTicket);

    const mensajesFormateados = res.Adata.map(m => ({
      id: m.id,
      idUsuario: m.id_usuario,
      nombreUsuario: m.nombre_usuario ?? "Usuario",
      comentarioTexto: m.comentario,
      fecha: m.fecha
    }));

    setMensajes(mensajesFormateados);
  } catch (e) {
    console.error("Error al cargar mensajes:", e);
  }
};
*/
  useEffect(() => {
    cargarMensajes();

    // Auto-refresh cada 3 segundos
    const intervalo = setInterval(() => cargarMensajes(), 3000);

    return () => clearInterval(intervalo);
  }, [idTicket]);

  // Auto scroll al final
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (!texto.trim()) return;

    const nuevo = {
      idTicket,
      idUsuario: usuario.id,
      comentarioTexto: texto
    };

    try {
      await comentarioApi.crear(nuevo);
      setTexto("");
      cargarMensajes();
    } catch (e) {
      console.error("Error al enviar mensaje:", e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-mensajes" ref={chatRef}>
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={
              m.idUsuario === usuario.id
                ? "mensaje mensaje-propio"
                : "mensaje mensaje-otro"
            }
          >
            <div className="mensaje-autor">
              {m.idUsuario === usuario.id
                ? "Tú"
                : m.nombreUsuario}
            </div>
            <div className="mensaje-texto">{m.comentarioTexto}</div>
            <div className="mensaje-fecha">
              {new Date(m.fecha).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatTicket;


