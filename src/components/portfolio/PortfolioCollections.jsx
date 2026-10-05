import { useState } from "react";
import { portfolioCategories, portfolioSeries } from "../../data/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";

function CollectionCover({ item }) {
  return item.image
    ? <img src={item.image} srcSet={item.srcSet}
        sizes="(max-width: 580px) calc(100vw - 40px), (max-width: 1600px) calc((100vw - 116px) / 3), 495px"
        width={item.width} height={item.height} alt={item.alt} loading="lazy" decoding="async" />
    : <div className="portfolio-placeholder"><span>{item.eyebrow}</span><em>{item.coverTitle}</em></div>;
}

export default function PortfolioCollections() {
  const mobile = useMediaQuery("(max-width: 580px)");
  const perPage = mobile ? 1 : 3;
  const [position, setPosition] = useState(0);
  const start = Math.min(Math.floor(position / perPage) * perPage, portfolioCategories.length - perPage);
  return <>
    <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
      <div className="portfolio-section__heading"><h2 id="portfolio-title">Explorar mi trabajo</h2><span>Portfolio</span></div>
      <div className="portfolio-grid" id="portfolio-categories" aria-label="Categorías del portfolio">
        {portfolioCategories.slice(start, start + perPage).map((item) => <article key={item.id} className="portfolio-category">
          <CollectionCover item={item} /><h3>{item.title}</h3><p className="portfolio-pending">Galería en preparación</p>
        </article>)}
      </div>
      <div className="portfolio-category-controls">
        <span role="status">{mobile ? start + 1 : `${start + 1}–${start + perPage}`} de {portfolioCategories.length}</span>
        <button type="button" aria-label="Categorías anteriores" aria-controls="portfolio-categories" disabled={start === 0} onClick={() => setPosition(start - perPage)}>←</button>
        <button type="button" aria-label="Categorías siguientes" aria-controls="portfolio-categories" disabled={start + perPage >= portfolioCategories.length} onClick={() => setPosition(start + perPage)}>→</button>
      </div>
    </section>
    <section className="portfolio-section" aria-labelledby="series-title">
      <div className="portfolio-section__heading"><h2 id="series-title">Historias en imágenes</h2><span>Series</span></div>
      <div className="portfolio-grid portfolio-series">
        {portfolioSeries.map((item) => <article key={item.id}>
          <CollectionCover item={item} /><p className="portfolio-eyebrow">{item.label}</p><h3>{item.title}</h3>
          <p>{item.description}</p><span className="portfolio-pending">Serie en preparación</span>
        </article>)}
      </div>
    </section>
  </>;
}
