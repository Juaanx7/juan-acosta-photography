import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const { pathname, hash } = useLocation();
  return <header className="navbar" id="site-header">
    <a className="navbar__skip" href="#contenido">Saltar al contenido</a>
    <div className="navbar__container">
      <Link to="/" className="navbar__brand">JUAN ACOSTA<span>PHOTOGRAPHY</span></Link>
      <nav className="navbar__links" aria-label="Navegación principal">
        <Link to="/#portfolio">Portfolio</Link><Link to="/#sobre-mi">Sobre mí</Link><Link to="/#contacto">Contacto</Link>
        <details className="navbar__shop" key={pathname + hash} onKeyDown={(event) => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
          <summary>Tienda</summary><div><Link to="/tienda/deportes">Fotos de carreras ↗</Link><Link to="/como-comprar">Cómo comprar</Link><span>Fotografías para encargar<small>En preparación · paisajes y viajes</small></span></div>
        </details>
      </nav>
    </div>
  </header>;
}
