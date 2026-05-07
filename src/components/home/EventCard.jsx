import { Link } from "react-router-dom";
import "./EventCard.scss";

const EventCard = ({ event }) => {
  return (
    <article className="event-card">
      <Link to={`/evento/${event.id}`} className="event-card__image">
        <img src={event.coverImage} alt={event.title} />
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