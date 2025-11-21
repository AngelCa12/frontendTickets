import { useParams } from "react-router-dom";
import ChatTicket from "../components/ChatTickets";

function SoporteTicketDetalle() {
  const { id } = useParams(); 
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Detalles del Ticket #{id}</h2>

      {/* chat */}
      <ChatTicket idTicket={Number(id)} usuario={usuario} />
    </div>
  );
}

export default SoporteTicketDetalle;
