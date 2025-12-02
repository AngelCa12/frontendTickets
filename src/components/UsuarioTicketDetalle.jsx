import { useParams } from "react-router-dom";
import ChatTicket from "../components/ChatTickets";

const UsuarioTicketDetalle = () => {
  const { id } = useParams(); 
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Conversación del Ticket #{id}</h2>

      <ChatTicket idTicket={Number(id)} usuario={usuario} />

    </div>
  );
};

export default UsuarioTicketDetalle;
