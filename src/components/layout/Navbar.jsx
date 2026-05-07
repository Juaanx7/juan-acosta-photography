import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          Juan Acosta Photography
        </Link>

        <nav className="navbar__links">
          <Link to="/">Eventos</Link>
          <Link to="/como-comprar">Cómo comprar</Link>
          <a href="#contacto">Contacto</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;