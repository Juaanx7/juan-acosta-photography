import { events } from "../../data/events";
import EventCard from "./EventCard";
import "./EventsSection.scss";

const EventsSection = () => {
  return (
    <section className="events-section" id="eventos">
      <div className="events-section__container">
        <h2>Eventos recientes</h2>

        <div className="events-section__grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;