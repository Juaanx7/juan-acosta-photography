import { Link } from "react-router-dom";
import "./AboutMe.scss";

export default function AboutMe() {
  return <section className="about-me" id="sobre-mi" aria-labelledby="about-me-heading">
    <div className="about-me__layout">
      <figure className="about-me__portrait">
        <img
          src="/images/portfolio/sobre-mi/retrato-juan-acosta-680.webp"
          srcSet={[320, 530, 680, 1020].map(width => `/images/portfolio/sobre-mi/retrato-juan-acosta-${width}.webp ${width}w`).join(", ")}
          sizes="(max-width: 650px) 265px, (max-width: 900px) min(340px, calc((100vw - 118px) * .4)), min(340px, calc((90vw - 70px) * .4))"
          width="2250" height="4000" loading="lazy" decoding="async"
          alt="Juan Acosta en un paisaje de montañas y formaciones rocosas"
        />
        <figcaption>Juan Acosta · San Marcos Sierras, Córdoba</figcaption>
      </figure>
      <div className="about-me__text">
        <p className="portfolio-eyebrow">SOBRE MÍ</p>
        <h2 id="about-me-heading">Una forma de <em>mirar.</em></h2>
        <p className="about-me__introduction">Soy Juan Acosta, fotógrafo de San Marcos Sierras, Córdoba.</p>
        <div className="about-me__story">
          <p>Empecé con la fotografía casi sin querer, buscando algo que todavía no sabía nombrar. Aprendí de otros fotógrafos, contemplando el paisaje, probando y volviendo al mismo lugar hasta entender la luz.</p>
          <p>Con el tiempo entendí que fotografiar es, sobre todo, una forma de estar y de sentirme parte del lugar. Disfruto todo el proceso: cómo los distintos tonos del día transforman un cerro, la quietud de esperar a que salgan las estrellas, el momento en que una imagen finalmente transmite lo que sentí.</p>
          <p>San Marcos Sierras es parte de esa mirada. También lo son los viajes, los senderos y los deportes en montaña: experiencias que me llevan a explorar y descubrir qué fotografiar. Comparto mis imágenes para que quienes las vean puedan sentir algo de lo que viví al tomarlas.</p>
        </div>
        <Link to="/#contacto" className="about-me__talk">Conversemos ↗</Link>
      </div>
    </div>
  </section>;
}
