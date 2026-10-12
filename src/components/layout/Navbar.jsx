import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import "./Navbar.scss";

const MOBILE_QUERY = "(max-width: 650px)";

export default function Navbar() {
  const { pathname, hash, key } = useLocation();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [expandedAt, setExpandedAt] = useState(null);
  const menuOpen = isMobile && expandedAt === key;
  const container = useRef(null);
  const toggle = useRef(null);
  const navigation = useRef(null);
  const brand = useRef(null);
  const shop = useRef(null);
  const pointerWithinShop = useRef(false);

  useEffect(() => {
    function closeOnOutsidePointer(event) {
      pointerWithinShop.current = !!shop.current?.contains(event.target);
      if (shop.current && !pointerWithinShop.current) shop.current.open = false;
      if (!container.current?.contains(event.target)) setExpandedAt(null);
    }
    function resetOnResize(event) {
      setExpandedAt(null);
      if (shop.current) shop.current.open = false;
      // Evitar dejar el foco en un control que acaba de ocultarse.
      if (event.matches && navigation.current?.contains(document.activeElement)) toggle.current?.focus();
      if (!event.matches && document.activeElement === toggle.current) brand.current?.focus();
    }
    function resetAfterHistoryNavigation() {
      setExpandedAt(null);
      if (shop.current) shop.current.open = false;
    }
    const media = window.matchMedia(MOBILE_QUERY);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    media.addEventListener("change", resetOnResize);
    window.addEventListener("popstate", resetAfterHistoryNavigation);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      media.removeEventListener("change", resetOnResize);
      window.removeEventListener("popstate", resetAfterHistoryNavigation);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function dismissWithEscape(event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (shop.current) shop.current.open = false;
      setExpandedAt(null);
      toggle.current.focus();
    }
    document.addEventListener("keydown", dismissWithEscape);
    return () => document.removeEventListener("keydown", dismissWithEscape);
  }, [menuOpen]);

  function closeShop() {
    if (shop.current) shop.current.open = false;
  }

  function closeMenu() {
    closeShop();
    setExpandedAt(null);
  }

  function handleBlur(event) {
    // Safari táctil puede quitar el foco sin enfocar el enlace: esperar su clic.
    if (!event.relatedTarget && pointerWithinShop.current) return;
    if (!event.currentTarget.contains(event.relatedTarget)) closeShop();
  }

  function handleKeyDown(event) {
    pointerWithinShop.current = false;
    if (event.key !== "Escape") return;
    // En móvil Escape se atiende en document, incluso si Tab salió del encabezado.
    if (!menuOpen && shop.current?.open) {
      closeShop();
      shop.current.querySelector("summary").focus();
    }
  }

  return <header className="navbar" id="site-header" onKeyDown={handleKeyDown}>
    <a className="navbar__skip" href="#contenido">Saltar al contenido</a>
    <div className="navbar__container" ref={container}>
      <Link to="/" tabIndex={0} className="navbar__brand" ref={brand} onClick={closeMenu}>JUAN ACOSTA<span>PHOTOGRAPHY</span></Link>
      <button type="button" className="navbar__toggle" ref={toggle}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen} aria-controls="site-navigation"
        onClick={() => { closeShop(); setExpandedAt(menuOpen ? null : key); }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
          {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <nav id="site-navigation" className="navbar__links" ref={navigation}
        aria-label="Navegación principal" hidden={isMobile && !menuOpen}>
        <Link to="/#portfolio" onClick={closeMenu} tabIndex={0}>Portfolio</Link>
        <Link to="/#sobre-mi" onClick={closeMenu} tabIndex={0} aria-current={pathname === "/" && hash === "#sobre-mi" ? "location" : undefined}>Sobre mí</Link>
        <Link to="/#contacto" onClick={closeMenu} tabIndex={0}>Contacto</Link>
        <details className="navbar__shop" ref={shop} key={key} onBlur={handleBlur}>
          <summary>Tienda<span className="navbar__shop-caret" aria-hidden="true">⌄</span></summary>
          <div>
            <Link to="/tienda/deportes" onClick={closeMenu} tabIndex={0}>Fotos de carreras ↗</Link>
            <Link to="/como-comprar" onClick={closeMenu} tabIndex={0}>Cómo comprar</Link>
            <span className="navbar__shop-pending" aria-disabled="true">Fotografías para encargar<small>En preparación · paisajes y viajes</small></span>
          </div>
        </details>
      </nav>
    </div>
  </header>;
}
