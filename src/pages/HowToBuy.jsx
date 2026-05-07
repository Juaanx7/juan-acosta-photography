import { Link } from "react-router-dom";
import { FiSearch, FiCheckSquare, FiMessageCircle, FiDownload } from "react-icons/fi";
import "./HowToBuy.scss";

const HowToBuy = () => {
  return (
    <section className="how-to-buy">
      <div className="container">
        <div className="how-to-buy__header">
          <span>Proceso de compra</span>
          <h1>Cómo comprar tus fotos</h1>
          <p>
            Elegí el evento, seleccioná tus fotos favoritas y enviá el pedido
            automáticamente por WhatsApp.
          </p>
        </div>

        <div className="how-to-buy__steps">
          <article>
            <FiSearch />
            <h3>1. Buscá tu evento</h3>
            <p>Ingresá a la galería del evento donde participaste.</p>
          </article>

          <article>
            <FiCheckSquare />
            <h3>2. Seleccioná tus fotos</h3>
            <p>Marcá las fotos que querés comprar desde la galería.</p>
          </article>

          <article>
            <FiMessageCircle />
            <h3>3. Enviá el pedido</h3>
            <p>La web arma automáticamente un mensaje de WhatsApp con los códigos de las fotos.</p>
          </article>

          <article>
            <FiDownload />
            <h3>4. Recibí tus archivos</h3>
            <p>Después de coordinar el pago, recibís las fotos en alta calidad y sin marca de agua.</p>
          </article>
        </div>

        <div className="how-to-buy__note">
          <h2>Importante</h2>
          <p>
            Las imágenes que ves en la web están en baja resolución y con marca de agua.
            La entrega final se realiza en alta calidad y sin marca de agua.
          </p>
        </div>

        <Link to="/#eventos" className="how-to-buy__button">
          Ver eventos disponibles
        </Link>
      </div>
    </section>
  );
};

export default HowToBuy;