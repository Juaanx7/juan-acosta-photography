import { Navigate, useLocation } from "react-router-dom";
import ImmersiveCover from "../components/portfolio/ImmersiveCover";
import PortfolioCollections from "../components/portfolio/PortfolioCollections";
import ContactForm from "../components/portfolio/ContactForm";
import "./Portfolio.scss";

export default function Portfolio() {
  const { hash } = useLocation();
  // Compatibilidad con el enlace a eventos compartido antes del rediseño.
  if (hash === "#eventos") return <Navigate to="/tienda/deportes#eventos" replace />;
  return <div className="portfolio-page">
    <ImmersiveCover />
    <section className="portfolio-intro" id="sobre-mi">
      <p className="portfolio-eyebrow">PAISAJES · VIAJES · MONTAÑA</p>
      <h1>Una mirada en el camino.</h1>
      <p>Fotografío los lugares que recorro, los detalles que me detienen y las experiencias que encuentro en la montaña.</p>
    </section>
    <PortfolioCollections /><ContactForm />
  </div>;
}
