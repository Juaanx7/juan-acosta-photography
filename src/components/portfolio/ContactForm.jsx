import { useRef, useState } from "react";
import { buildContactMessage, contactReasons, createWhatsAppLink } from "../../utils/whatsapp";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", reason: "", message: "" });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const dialog = useRef(null);
  const submit = useRef(null);

  function prepare(event) {
    event.preventDefault();
    try {
      setPreview(buildContactMessage(values));
      setError("");
      dialog.current.showModal();
    } catch (validationError) {
      setError(validationError.message);
    }
  }
  function change(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
    setError("");
  }

  return <section className="portfolio-contact" id="contacto" aria-labelledby="contact-title">
    <div>
      <p className="portfolio-eyebrow">CONTACTO</p><h2 id="contact-title">Hablemos de tu próximo proyecto.</h2>
      <p>Una carrera, un recital, un encuentro o una fotografía para tu espacio. Contame qué tenés en mente.</p>
      <div className="portfolio-contact__location"><span className="portfolio-eyebrow">DESDE</span><p>San Marcos Sierras<br />Córdoba, Argentina</p></div>
      <a href="https://www.instagram.com/juanacostaph" target="_blank" rel="noopener noreferrer">También me encontrás en Instagram ↗ <span>@juanacostaph</span></a>
    </div>
    <form onSubmit={prepare} className="portfolio-contact__form">
      <label htmlFor="contact-name">Tu nombre<input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={change} /></label>
      <label htmlFor="contact-reason">¿En qué puedo ayudarte?<select id="contact-reason" name="reason" required value={values.reason} onChange={change}>
        <option value="">Elegí un motivo</option>{contactReasons.map((reason) => <option key={reason}>{reason}</option>)}
      </select></label>
      <label htmlFor="contact-message">Contame un poco más<textarea id="contact-message" name="message" rows={4} required maxLength={3000} placeholder="Qué imaginás, dónde y para cuándo…" value={values.message} onChange={change} /></label>
      {error && <p role="alert">{error}</p>}
      <button className="portfolio-action" type="submit" ref={submit}>Continuar por WhatsApp</button>
      <p className="portfolio-contact__note">Primero vas a revisar tu consulta. El mensaje lo enviás vos desde WhatsApp.</p>
    </form>
    <dialog ref={dialog} className="portfolio-confirm" aria-labelledby="contact-confirm-title" onClose={() => submit.current.focus()}>
      <h2 id="contact-confirm-title">Revisá tu consulta</h2><p>Al abrir WhatsApp, podés revisar el mensaje y presionar Enviar.</p>
      <pre>{preview}</pre>
      <div><button type="button" onClick={() => dialog.current.close()}>Volver al formulario</button>
        <a className="portfolio-action" href={createWhatsAppLink(preview)} target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a></div>
    </dialog>
  </section>;
}
