import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../../utils/whatsapp";
import "./Footer.scss";

export default function Footer() {
  return <footer className="footer"><p>© {new Date().getFullYear()} Juan Acosta Photography</p><nav aria-label="Enlaces del pie">
    <Link to="/tienda/deportes">Fotos de carreras ↗</Link><Link to="/#contacto">Contacto</Link>
    <a href={createWhatsAppLink()} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
    <span>Fotografías para encargar · en preparación</span>
  </nav></footer>;
}
