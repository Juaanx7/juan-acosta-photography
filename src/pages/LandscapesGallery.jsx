import { useState } from "react";
import { Link } from "react-router-dom";
import { landscapePhotos, landscapeRows } from "../data/landscapes";
import { portfolioSeries } from "../data/portfolio";
import { routePaths } from "../data/routes";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import "./SanMarcosSeries.scss";
import "./LandscapesGallery.scss";

// Estos tamaños siguen el contenedor fluido, los espacios y las columnas asimétricas.
const responsive = desktop => `(max-width: 580px) calc(100vw - 44px), (max-width: 600px) calc(100vw - 48px), (max-width: 900px) ${desktop.replaceAll("min(90vw, 2200px)", "(100vw - 48px)")}, ${desktop}`;
const photoSizes = {
  wide: responsive("calc(min(90vw, 2200px))"),
  pair: responsive("calc((min(90vw, 2200px) - 28px) / 2)"),
  mixed: [responsive("calc((min(90vw, 2200px) - 28px) / 2.8)"), responsive("calc((min(90vw, 2200px) - 28px) * 1.8 / 2.8)")],
  night: responsive("calc((min(90vw, 2200px) * .76 - 32px) / 2)"),
};

export default function LandscapesGallery() {
  const [selection, setSelection] = useState(null);
  return <div className="san-marcos-series landscape-gallery">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="landscape-intro">
        <p className="series-eyebrow">UNA SELECCIÓN DE MI TRABAJO</p>
        <h1>Paisajes y <em>viajes.</em></h1>
        <p className="landscape-intro__copy">Salir a explorar, detenerme a mirar y descubrir cómo la luz transforma cada lugar. Una selección de paisajes, caminos y cielos que fui encontrando con mi cámara.</p>
      </header>
      <section aria-label="Fotografías de Paisajes y viajes">
        {landscapeRows.map(({ indices, layout }) => <div key={indices[0]} className={`landscape-row landscape-row--${layout}`}>
          {indices.map((index, column) => {
            const photo = landscapePhotos[index];
            return <SeriesPhoto key={photo.source} photo={photo} priority={index === 0}
              sizes={layout === "mixed" ? photoSizes.mixed[column] : photoSizes[layout]}
              caption={<span>{photo.location}</span>}
              onOpen={event => setSelection({ index, opener: event.currentTarget })} />;
          })}
        </div>)}
      </section>
      <section className="landscape-more" aria-labelledby="landscape-more-title">
        <p className="series-eyebrow">SEGUIR EXPLORANDO</p>
        <h2 id="landscape-more-title">Historias detrás de las fotos.</h2>
        <div>{portfolioSeries.map(series => <Link key={series.id} to={series.href}>{series.title}<span aria-hidden="true">↗</span></Link>)}</div>
      </section>
    </div>
    {selection && <SeriesViewer works={landscapePhotos} initialIndex={selection.index} title="Paisajes y viajes"
      opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
