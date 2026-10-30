import { useState } from "react";
import { Link } from "react-router-dom";
import { mountainSportsPhotos, mountainSportsRows } from "../data/mountainSports";
import { routePaths } from "../data/routes";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import "./SanMarcosSeries.scss";
import "./LandscapesGallery.scss";
import "./MountainSportsGallery.scss";

// Se conservan el contenedor y los espacios del portfolio; cambian las columnas.
const responsive = desktop => `(max-width: 580px) calc(100vw - 44px), (max-width: 600px) calc(100vw - 48px), (max-width: 900px) ${desktop.replaceAll("min(90vw, 2200px)", "(100vw - 48px)")}, ${desktop}`;
const photoSizes = {
  wide: responsive("calc(min(90vw, 2200px))"),
  pair: responsive("calc((min(90vw, 2200px) - 28px) / 2)"),
  portraits: responsive("calc((min(90vw, 2200px) * .78 - 28px) / 2)"),
  mixed: [responsive("calc((min(90vw, 2200px) - 28px) * 1.75 / 2.75)"), responsive("calc((min(90vw, 2200px) - 28px) / 2.75)")],
};

export default function MountainSportsGallery() {
  const [selection, setSelection] = useState(null);
  return <div className="san-marcos-series landscape-gallery mountain-sports-gallery">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="landscape-intro">
        <p className="series-eyebrow">ACCIÓN · PERSONAS · ENTORNO</p>
        <h1>Deportes en <em>montaña.</em></h1>
        <p className="landscape-intro__copy">La intensidad de una bajada, el esfuerzo de cada subida y los momentos que se comparten en el camino. Mi mirada sobre el deporte y los paisajes donde sucede.</p>
      </header>
      <section aria-label="Selección de fotografías deportivas">
        {mountainSportsRows.map(({ indices, layout }) => <div key={indices[0]} className={`landscape-row mountain-row--${layout}${layout === "wide" ? " landscape-row--wide" : ""}`}>
          {indices.map((index, column) => {
            const photo = mountainSportsPhotos[index];
            return <SeriesPhoto key={photo.source} photo={photo} priority={index === 0}
              sizes={layout === "mixed" ? photoSizes.mixed[column] : photoSizes[layout]}
              caption={<span>{photo.race}</span>}
              onOpen={event => setSelection({ index, opener: event.currentTarget })} />;
          })}
        </div>)}
      </section>
      <section className="mountain-contact" aria-labelledby="mountain-contact-title">
        <div><p className="series-eyebrow">FOTOGRAFÍA DEPORTIVA</p>
          <h2 id="mountain-contact-title">Nos encontramos en el próximo circuito.</h2>
          <p>Coberturas de carreras, sesiones con corredores y proyectos al aire libre.</p></div>
        <Link to={`${routePaths.portfolio}#contacto`}>Consultar por una cobertura <span aria-hidden="true">↗</span></Link>
      </section>
      <section className="mountain-shop" aria-labelledby="mountain-shop-title">
        <div><h2 id="mountain-shop-title">¿Buscás tus fotos de una carrera?</h2>
          <p>Encontrá las galerías completas en la tienda deportiva.</p></div>
        <Link to={routePaths.sportsShop}>Ver fotos de carreras <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
    {selection && <SeriesViewer works={mountainSportsPhotos} initialIndex={selection.index} title="Deportes en montaña"
      opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
