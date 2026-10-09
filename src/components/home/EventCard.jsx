import { Link } from "react-router-dom";
import "./EventCard.scss";
import { cloudinaryImageVariants, eventCoverSizes } from "../../utils/cloudinaryImages";

const EventCard = ({ event }) => {
  return (
    <article className="event-card">
      <Link to={`/evento/${event.id}`} className="event-card__image">
        <img src={event.coverImage} {...cloudinaryImageVariants(event.coverImage, [640, 960, 1440, 1920, 2560])}
          sizes={eventCoverSizes} alt={event.title} loading="lazy" />
      </Link>

      <div className="event-card__content">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
        <span>{event.location}</span>

        <Link to={`/evento/${event.id}`} className="event-card__button">
          Ver galería
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
