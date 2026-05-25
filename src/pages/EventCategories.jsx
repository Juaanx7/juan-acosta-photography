import { Link, Navigate, useParams } from "react-router-dom";
import { events } from "../data/events";
import "./EventCategories.scss";
import SelectionBar from "../components/gallery/SelectionBar";
import { useEventSelection } from "../hooks/useEventSelection";

const EventCategories = () => {
  const { eventId } = useParams();

  const event = events.find((item) => item.id === eventId);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  if (!event.categories) {
    return <Navigate to={`/evento/${event.id}/galeria`} replace />;
  }

  const {
  selectedPhotos,
  togglePhotoSelection,
  clearSelection,
} = useEventSelection(eventId);

const allEventPhotos = event.categories
  ? event.categories.flatMap((category) => category.photos)
  : [];

  return (
    <section className="event-categories">
      <div className="container">
        <div className="event-categories__header">
          <Link to="/#eventos" className="event-categories__back">
            ← Volver a eventos
          </Link>
          <span>{event.location}</span>
          <h1>{event.title}</h1>
          <p>
            Las fotos están separadas por categoría para que puedas encontrar tu
            tanda más rápido.
          </p>
        </div>

        <div className="event-categories__grid">
          {event.categories.map((category) => (
            <Link
              to={`/evento/${event.id}/${category.id}`}
              className="event-category-card"
              key={category.id}
            >
              <div className="event-category-card__image">
                <img src={category.coverImage} alt={category.title} />
              </div>

              <div className="event-category-card__content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <span>Ver galería</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <SelectionBar
        selectedPhotos={selectedPhotos}
        event={event}
        photos={allEventPhotos}
        togglePhotoSelection={togglePhotoSelection}
        clearSelection={clearSelection}
      />
    </section>    
  );
};

export default EventCategories;