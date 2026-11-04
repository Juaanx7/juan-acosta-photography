import { useState } from "react";
import { Link } from "react-router-dom";
import { eventsMusicPhotos, eventsMusicRows } from "../data/eventsMusic";
import { routePaths } from "../data/routes";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import "./SanMarcosSeries.scss";
import "./LandscapesGallery.scss";
import "./EventsMusicGallery.scss";

export default function EventsMusicGallery() {
  const [selection, setSelection] = useState(null);
  return <div className="san-marcos-series landscape-gallery events-music-gallery">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="landscape-intro">
        <p className="series-eyebrow">ARTISTAS · ENCUENTROS · EMOCIONES</p>
        <h1>Eventos y <em>música.</em></h1>
        <p className="landscape-intro__copy">La energía del escenario, la emoción del público y los momentos que se comparten alrededor de la música. Fotografías para volver a sentir lo que se vivió.</p>
      </header>
      <section className="events-music-photos" aria-label="Galería de eventos y música">
        {eventsMusicRows.map(row => <div className="events-music-row" key={row.items[0].photo.source} style={{ "--events-columns": row.columns }}>
          {row.items.map(({ photo, index, sizes }) => <SeriesPhoto key={photo.source} photo={photo} sizes={sizes} priority={index === 0}
            caption={<span>{photo.artist ? <><strong>{photo.artist}</strong>{" · "}{photo.event}</> : photo.event}</span>}
            onOpen={event => setSelection({ index, opener: event.currentTarget })} />)}
        </div>)}
      </section>
      <section className="events-music-contact" aria-labelledby="events-music-contact-title">
        <div><p className="series-eyebrow">CONTEMOS LO QUE SUCEDE</p>
          <h2 id="events-music-contact-title">Tu próximo evento, en imágenes.</h2>
          <p>Coberturas de recitales, festivales y encuentros culturales.</p></div>
        <Link to={`${routePaths.portfolio}#contacto`}>Consultar por una cobertura <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
    {selection && <SeriesViewer works={eventsMusicPhotos} initialIndex={selection.index} title="Eventos y música"
      opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
