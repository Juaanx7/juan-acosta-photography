import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__container">
        <p className="footer__brand">Juan Acosta Photography</p>

        <div className="footer__links">
          <a href="https://www.instagram.com/juanacostaph" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://wa.me/5493549461840" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>

        <p className="footer__copy">
          © 2026 Juan Acosta Photography. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;