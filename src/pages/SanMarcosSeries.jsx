import { useState } from "react";
import { Link } from "react-router-dom";
import { sanMarcos } from "../data/sanMarcos";
import { routePaths } from "../data/routes";
import { seriesPhotoSizes } from "../data/photoSizes";
import ResponsivePhoto from "../components/portfolio/ResponsivePhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesInquiry from "../components/portfolio/SeriesInquiry";
import "./SanMarcosSeries.scss";

const sizes = {
  opening: seriesPhotoSizes.wide,
  horizontal: seriesPhotoSizes.horizontal,
  bridge: seriesPhotoSizes.medium,
  portrait: seriesPhotoSizes.sanMarcosPortrait,
  exhibition: seriesPhotoSizes.exhibition,
};

export default function SanMarcosSeries() {
  const [selection, setSelection] = useState(null);

  function work(index, size, priority = false) {
    const photo = sanMarcos.works[index];
    return <SeriesPhoto key={photo.source} photo={photo} sizes={sizes[size]} priority={priority}
      onOpen={(event) => setSelection({ index, opener: event.currentTarget })}
      caption={<div><h2>{photo.title}</h2><p>{sanMarcos.location}</p></div>} />;
  }

  return <div className="san-marcos-series">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="series-heading">
        <p className="series-eyebrow">SERIE · SAN MARCOS SIERRAS</p>
        <h1>San Marcos,<br /><em>mi mirada.</em></h1>
        <p>{sanMarcos.introduction}</p>
      </header>
      <section aria-label="Las seis fotografías de la colección">
        {work(0, "opening", true)}
        <div className="series-landscapes">{work(1, "horizontal")}{work(2, "horizontal")}</div>
        <div className="series-bridge">{work(3, "bridge")}</div>
        <div className="series-portraits">{work(4, "portrait")}{work(5, "portrait")}</div>
      </section>
    </div>
    <section className="series-exhibition" aria-labelledby="exhibition-title">
      <div className="series-container">
        <div className="series-exhibition__intro">
          <div><p className="series-eyebrow">LA EXPERIENCIA DE LA MUESTRA</p>
            <h2 id="exhibition-title">Del paisaje<br /><em>al papel.</em></h2><p className="series-exhibition__date">{sanMarcos.exhibition.date}</p></div>
          <div className="series-exhibition__story">{sanMarcos.exhibition.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
        <div className="series-exhibition__photos">{sanMarcos.exhibition.photos.map((photo) => <figure key={photo.source}>
          <ResponsivePhoto photo={photo} sizes={sizes.exhibition} /><figcaption>{photo.title}</figcaption>
        </figure>)}</div>
      </div>
    </section>
    <SeriesInquiry message={sanMarcos.inquiry}>
      <div><Link className="series-back" to={routePaths.achala}>Los Cajones de Achala ↗</Link><br />
        <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>Seguir explorando el portfolio ↗</Link></div>
    </SeriesInquiry>
    {selection && <SeriesViewer works={sanMarcos.works} initialIndex={selection.index} location={sanMarcos.location}
      opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
