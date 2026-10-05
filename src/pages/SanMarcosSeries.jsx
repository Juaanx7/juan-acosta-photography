import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sanMarcos } from "../data/sanMarcos";
import { routePaths } from "../data/routes";
import { createWhatsAppLink } from "../utils/whatsapp";
import ResponsivePhoto from "../components/portfolio/ResponsivePhoto";
import SeriesViewer from "../components/portfolio/SeriesViewer";
import "./SanMarcosSeries.scss";

const sizes = {
  opening: "(max-width: 580px) calc(100vw - 44px), (max-width: 1080px) calc(100vw - 96px), 984px",
  horizontal: "(max-width: 580px) calc(100vw - 44px), (max-width: 1080px) calc((100vw - 124px) / 2), 478px",
  bridge: "(max-width: 580px) calc(100vw - 44px), (max-width: 896px) calc(100vw - 96px), 800px",
  portrait: "(max-width: 580px) 280px, (max-width: 896px) calc((100vw - 144px) / 2), 376px",
  exhibition: "(max-width: 580px) 230px, (max-width: 816px) calc((100vw - 136px) / 3), 227px",
};

export default function SanMarcosSeries() {
  const [selection, setSelection] = useState(null);
  const confirmation = useRef(null);
  const inquiryButton = useRef(null);

  function work(index, size, priority = false) {
    const photo = sanMarcos.works[index];
    return <figure key={photo.source} className="series-work">
      <button type="button" className="series-work__open" aria-label={`Ampliar ${photo.title}`}
        onClick={(event) => setSelection({ index, opener: event.currentTarget })}>
        <ResponsivePhoto photo={photo} sizes={sizes[size]} priority={priority} />
      </button>
      <figcaption><div><h2>{photo.title}</h2><p>{sanMarcos.location}</p></div>
        <button type="button" aria-label={`Ampliar ${photo.title}, abrir visor`}
          onClick={(event) => setSelection({ index, opener: event.currentTarget })}>Ampliar ↗</button></figcaption>
    </figure>;
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
    <section className="series-closing series-container" aria-labelledby="series-inquiry-title">
      <div><p className="series-eyebrow">UNA FOTOGRAFÍA PARA TU ESPACIO</p>
        <h2 id="series-inquiry-title">¿Hay una imagen<br />que te gustaría tener?</h2>
        <p>Podés consultarme por una fotografía de esta colección en formato digital o impresa a pedido.</p>
        <button type="button" ref={inquiryButton} onClick={() => confirmation.current.showModal()}>Consultar por WhatsApp ↗</button></div>
      <Link className="series-back" to={`${routePaths.portfolio}#portfolio`}>Seguir explorando el portfolio ↗</Link>
    </section>
    <dialog ref={confirmation} className="series-confirm" aria-labelledby="series-confirm-title"
      onClose={() => inquiryButton.current.focus({ preventScroll: true })}>
      <h2 id="series-confirm-title">Revisá tu consulta</h2>
      <p>Al abrir WhatsApp, podés revisar el mensaje y presionar Enviar.</p><pre>{sanMarcos.inquiry}</pre>
      <div><button type="button" onClick={() => confirmation.current.close()}>Volver a la colección</button>
        <a href={createWhatsAppLink(sanMarcos.inquiry)} target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a></div>
    </dialog>
    {selection && <SeriesViewer works={sanMarcos.works} initialIndex={selection.index} location={sanMarcos.location}
      opener={selection.opener} onDismiss={() => setSelection(null)} />}
  </div>;
}
