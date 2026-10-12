import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const shop = useRef(null);
  const pointerWithinShop = useRef(false);

  useEffect(() => {
    function closeOnOutsidePointer(event) {
      pointerWithinShop.current = !!shop.current?.contains(event.target);
      if (shop.current && !pointerWithinShop.current) shop.current.open = false;
    }
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  function closeShop() {
    shop.current.open = false;
  }

  function handleBlur(event) {
    // Un toque en Safari puede quitar el foco sin enfocar el enlace. No cerrarlo antes del clic.
    if (!event.relatedTarget && pointerWithinShop.current) return;
    if (!event.currentTarget.contains(event.relatedTarget)) closeShop();
  }

  function handleKeyDown(event) {
    pointerWithinShop.current = false;
    if (event.key === "Escape") {
      closeShop();
      shop.current.querySelector("summary").focus();
    }
  }

  return <header className="navbar" id="site-header">
    <a className="navbar__skip" href="#contenido">Saltar al contenido</a>
    <div className="navbar__container">
      <Link to="/" className="navbar__brand">JUAN ACOSTA<span>PHOTOGRAPHY</span></Link>
      <nav className="navbar__links" aria-label="Navegación principal">
        <Link to="/#portfolio">Portfolio</Link><Link to="/#sobre-mi">Sobre mí</Link><Link to="/#contacto">Contacto</Link>
        <details className="navbar__shop" ref={shop} key={pathname + hash} onKeyDown={handleKeyDown} onBlur={handleBlur}>
          <summary>Tienda</summary><div><Link to="/tienda/deportes" onClick={closeShop} tabIndex={0}>Fotos de carreras ↗</Link><Link to="/como-comprar" onClick={closeShop} tabIndex={0}>Cómo comprar</Link><span className="navbar__shop-pending" aria-disabled="true">Fotografías para encargar<small>En preparación · paisajes y viajes</small></span></div>
        </details>
      </nav>
    </div>
  </header>;
}
