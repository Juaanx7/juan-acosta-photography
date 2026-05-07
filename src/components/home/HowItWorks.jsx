import { FiSearch, FiCheckSquare, FiMessageCircle } from "react-icons/fi";
import "./HowItWorks.scss";

const steps = [
  {
    icon: <FiSearch />,
    title: "1. Buscá tu evento",
    text: "Ingresá a la galería del evento donde participaste.",
  },
  {
    icon: <FiCheckSquare />,
    title: "2. Elegí tus fotos",
    text: "Seleccioná las imágenes que querés comprar.",
  },
  {
    icon: <FiMessageCircle />,
    title: "3. Pedilas por WhatsApp",
    text: "La web arma el mensaje automáticamente con los códigos de tus fotos.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how" id="como-comprar">
      <div className="how__container">
        <h2>Cómo comprar</h2>

        <div className="how__grid">
          {steps.map((step) => (
            <article className="how__step" key={step.title}>
              <div className="how__icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;