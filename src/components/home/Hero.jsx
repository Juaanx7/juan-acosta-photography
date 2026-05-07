import "./Hero.scss";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__eyebrow">Juan Acosta Photography</span>

          <h1>Fotografía de deporte y aventura</h1>

          <p>
            Galerías de eventos deportivos outdoor para que encuentres y encargues
            tus fotos de forma simple.
          </p>

          <a href="#eventos" className="hero__button">
            Ver eventos
          </a>
        </div>

        <div className="hero__image">
          <img src="/images/hero-bike.webp" alt="Ciclista en acción" />
        </div>
      </div>
    </section>
  );
};

export default Hero;