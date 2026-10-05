import { useEffect, useRef, useState } from "react";
import ResponsivePhoto from "./ResponsivePhoto";

export default function SeriesViewer({ works, initialIndex, location, opener, onDismiss }) {
  const [index, setIndex] = useState(initialIndex);
  const [frame, setFrame] = useState({ width: 960, height: 600 });
  const dialog = useRef(null);
  const stage = useRef(null);
  const photo = works[index];
  const move = (direction) => setIndex((current) => (current + direction + works.length) % works.length);

  useEffect(() => {
    const element = dialog.current;
    const scrollY = window.scrollY;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    const observer = new ResizeObserver(([entry]) => setFrame({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage.current);
    return () => {
      observer.disconnect();
      document.body.style.overflow = overflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      opener?.focus({ preventScroll: true });
    };
  }, [opener]);

  function keyboard(event) {
    if (event.key === "Tab") {
      const buttons = dialog.current.querySelectorAll("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return <dialog ref={dialog} className="series-viewer" aria-labelledby="series-viewer-title"
    onClose={onDismiss} onKeyDown={keyboard}>
    <div className="series-viewer__layout">
      <header><h2 id="series-viewer-title" aria-live="polite">{photo.title}</h2>
        <button type="button" autoFocus onClick={() => dialog.current.close()}>Cerrar ×</button></header>
      <div className="series-viewer__stage" ref={stage}>
        <ResponsivePhoto photo={photo} priority sizes={`${Math.ceil(Math.min(frame.width, frame.height * photo.width / photo.height))}px`} />
      </div>
      <div className="series-viewer__controls">
        <button type="button" aria-label="Obra anterior" onClick={() => move(-1)}>←</button>
        <span aria-live="polite">{index + 1} / {works.length}</span>
        <button type="button" aria-label="Obra siguiente" onClick={() => move(1)}>→</button>
      </div>
      <p className="series-viewer__location">{location}</p>
    </div>
  </dialog>;
}
