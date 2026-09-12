import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__container">
        <section
          className="footer__contact"
          aria-labelledby="footer-contact-title"
        >
          <div className="footer__intro">
            <h2 id="footer-contact-title">¿Hablamos?</h2>
            <p>
              Escribime para consultar por tus fotos o la cobertura de un evento.
            </p>
          </div>

          <div className="footer__links">
            <a
              className="footer__button footer__button--primary"
              href="https://wa.me/5493549461840"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contactar por WhatsApp
            </a>

            <a
              className="footer__button footer__button--secondary"
              href="https://www.instagram.com/juanacostaph"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Instagram
            </a>
          </div>
        </section>

        <div className="footer__bottom">
          <p className="footer__brand">Juan Acosta Photography</p>

          <p className="footer__copy">
            © 2026 Juan Acosta Photography. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;