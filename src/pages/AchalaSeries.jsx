import { useState } from "react";
import { Link } from "react-router-dom";
import { achala } from "../data/achala";
import { routePaths } from "../data/routes";
import { seriesPhotoSizes } from "../data/photoSizes";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import SeriesInquiry from "../components/portfolio/SeriesInquiry";
import "./SanMarcosSeries.scss";
import "./AchalaSeries.scss";

const sizes = {
  wide: seriesPhotoSizes.wide,
  horizontal: seriesPhotoSizes.horizontal,
  portrait: seriesPhotoSizes.achalaPortrait,
  medium: seriesPhotoSizes.medium,
  returning: seriesPhotoSizes.returning,
};

export default function AchalaSeries() {
  const [selection, setSelection] = useState(null);

  function work(index, size, className = "", caption) {
    const photo = achala.works[index];
    return <SeriesPhoto key={photo.source} photo={photo} sizes={sizes[size]} priority={index === 0}
      className={className} caption={caption}
      onOpen={(event) => setSelection({ index, opener: event.currentTarget })} />;
  }

  return <div className="san-marcos-series achala-series">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="achala-intro">
        <p className="series-eyebrow">SERIE · PAMPA DE ACHALA, CÓRDOBA</p>
        <h1>Los Cajones <em>de Achala.</em></h1>
        <div className="achala-story">{achala.paragraphs.slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </header>
      <section aria-label="Fotografías del recorrido">
        {work(0, "wide", "", <span>{achala.title}</span>)}
        <div className="achala-pair">{work(1, "horizontal")}{work(2, "horizontal")}</div>
        <div className="achala-pair achala-verticals">{work(3, "portrait")}{work(4, "portrait")}</div>
        {work(5, "medium", "achala-wide achala-medium")}
        <div className="achala-pair achala-verticals">{work(6, "portrait")}{work(7, "portrait")}</div>
        {work(8, "wide", "achala-wide")}
      </section>
      <section className="achala-return" aria-labelledby="achala-return-title">
        {work(9, "returning")}
        <div><p className="series-eyebrow">EL REGRESO</p>
          <h2 id="achala-return-title">Otra luz, <em>el mismo paisaje.</em></h2>
          <p className="achala-return__story">{achala.paragraphs[2]}</p></div>
      </section>
      <section className="achala-golden" aria-label="Los paisajes al final de la caminata">
        {work(10, "wide")}{work(11, "wide", "", <span>Al final del camino.</span>)}
      </section>
      <SeriesInquiry message={achala.inquiry} className="series-closing achala-closing" />
      <section className="achala-more" aria-label="Otras series">
        <p className="series-eyebrow">SEGUIR EXPLORANDO</p>
        <div><Link to={routePaths.sanMarcos}>San Marcos, mi mirada <span>↗</span></Link>
          <div className="achala-more__pending">La Cumbrecita <small>Serie en preparación</small></div></div>
      </section>
    </div>
    {selection && <SeriesViewer works={achala.works} initialIndex={selection.index} title={achala.title}
      location={achala.location} opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
