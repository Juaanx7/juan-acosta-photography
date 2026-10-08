import { useRef } from "react";
import { createWhatsAppLink } from "../../utils/whatsapp";

export default function SeriesInquiry({ message, className = "series-closing series-container", children }) {
  const confirmation = useRef(null);
  const inquiryButton = useRef(null);
  return <>
    <section className={className} aria-labelledby="series-inquiry-title">
      <div><p className="series-eyebrow">UNA FOTOGRAFÍA PARA TU ESPACIO</p>
        <h2 id="series-inquiry-title">¿Hay una imagen<br />que te gustaría tener?</h2>
        <p>Podés consultarme por una fotografía de esta colección en formato digital o impresa a pedido.</p>
        <button type="button" ref={inquiryButton} onClick={() => confirmation.current.showModal()}>Consultar por WhatsApp ↗</button></div>
      {children}
    </section>
    <dialog ref={confirmation} className="series-confirm" aria-labelledby="series-confirm-title"
      onClose={() => inquiryButton.current.focus({ preventScroll: true })}>
      <h2 id="series-confirm-title">Revisá tu consulta</h2>
      <p>Al abrir WhatsApp, podés revisar el mensaje y presionar Enviar.</p><pre>{message}</pre>
      <div><button type="button" onClick={() => confirmation.current.close()}>Volver a la colección</button>
        <a href={createWhatsAppLink(message)} target="_blank" rel="noopener noreferrer">Abrir WhatsApp ↗</a></div>
    </dialog>
  </>;
}
