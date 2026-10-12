import { useState } from "react";
import { Link } from "react-router-dom";
import { cumbrecita } from "../data/cumbrecita";
import { routePaths } from "../data/routes";
import { seriesPhotoSizes } from "../data/photoSizes";
import SeriesPhoto from "../components/portfolio/SeriesPhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import SeriesInquiry from "../components/portfolio/SeriesInquiry";
import "./SanMarcosSeries.scss";
import "./CumbrecitaSeries.scss";

// Los tamaños corresponden a las columnas y límites internos de esta serie.
const responsive = desktop => `(max-width: 650px) 280px, (max-width: 900px) ${desktop.replaceAll("min(90vw, 2200px)", "(100vw - 48px)")}, ${desktop}`;
const sizes = {
  wide: seriesPhotoSizes.wide,
  pair: responsive("calc((min(min(90vw, 2200px) * .86, 960px) - 46px) / 2)"),
  waterfall: responsive("min(440px, calc(min(90vw, 2200px) * .47))"),
  lamps: responsive("min(380px, calc(min(90vw, 2200px) * .4))"),
  mixedPortrait: responsive("min(350px, calc((min(min(90vw, 2200px) * .9, 1250px) - 60px) * .3421053))"),
  mixedLandscape: `(max-width: 580px) calc(100vw - 44px), (max-width: 650px) calc(100vw - 48px), (max-width: 900px) calc((min((100vw - 48px) * .9, 1250px) - 60px) * .6578947), calc((min(min(90vw, 2200px) * .9, 1250px) - 60px) * .6578947)`,
};

export default function CumbrecitaSeries() {
  const [selection, setSelection] = useState(null);

  function work(index, size, className = "", caption) {
    const photo = cumbrecita.works[index];
    return <SeriesPhoto key={photo.source} photo={photo} sizes={sizes[size]} priority={index === 0}
      className={className} caption={caption}
      onOpen={event => setSelection({ index, opener: event.currentTarget })} />;
  }

  return <div className="san-marcos-series cumbrecita-series">
    <div className="series-container">
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>← Volver al portfolio</Link>
      <header className="cumbrecita-intro">
        <p className="series-eyebrow">SERIE · LA CUMBRECITA, CÓRDOBA</p>
        <h1>La <em>Cumbrecita.</em></h1>
        <div className="cumbrecita-story">{cumbrecita.paragraphs.slice(0, 2).map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      </header>
      <section aria-label="La neblina, las calles y el bosque">
        {work(0, "wide", "", <span>{cumbrecita.title}</span>)}
        {work(1, "wide", "cumbrecita-wide")}
        <div className="cumbrecita-pair">{work(2, "pair")}{work(3, "pair")}</div>
        <div className="cumbrecita-pair">{work(4, "pair")}{work(5, "pair")}</div>
        {work(6, "wide", "cumbrecita-wide")}
        {work(7, "waterfall", "cumbrecita-single")}
      </section>
      <section className="cumbrecita-night" aria-labelledby="cumbrecita-night-title">
        <div className="cumbrecita-night__story">
          <p className="series-eyebrow">LAS LUCES DEL PUEBLO</p>
          <h2 id="cumbrecita-night-title">Cuando cae la <em>noche.</em></h2>
          <p>{cumbrecita.paragraphs[2]}</p>
        </div>
        <div className="cumbrecita-mixed">{work(8, "mixedPortrait")}{work(9, "mixedLandscape")}</div>
        {work(10, "lamps", "cumbrecita-single cumbrecita-lamps")}
        {work(11, "wide")}
      </section>
      <SeriesInquiry message={cumbrecita.inquiry} className="series-closing cumbrecita-closing" />
      <section className="cumbrecita-more" aria-label="Otras series">
        <p className="series-eyebrow">SEGUIR EXPLORANDO</p>
        <div><Link to={routePaths.sanMarcos}>San Marcos, mi mirada <span>↗</span></Link>
          <Link to={routePaths.achala}>Los Cajones de Achala <span>↗</span></Link></div>
      </section>
    </div>
    {selection && <SeriesViewer works={cumbrecita.works} initialIndex={selection.index} title={cumbrecita.title}
      location={cumbrecita.location} opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
