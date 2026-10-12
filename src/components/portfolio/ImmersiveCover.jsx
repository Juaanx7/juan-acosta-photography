import { useEffect, useRef, useState } from "react";
import { coverPhotos } from "../../data/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ImmersiveCover() {
  const root = useRef(null);
  const photoFrame = useRef(null);
  const [frameSize, setFrameSize] = useState(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 580px)");
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [announcement, setAnnouncement] = useState("");
  const availableWidth = frameSize ? Math.max(0, frameSize.width - (mobile ? 0 : 112)) : 0;
  const displayedWidth = frameSize ? Math.min(availableWidth, frameSize.height * coverPhotos[active].width / coverPhotos[active].height) : 0;

  useEffect(() => {
    const navbar = document.getElementById("site-header");
    const measure = () => {
      // Una notificación pendiente puede llegar durante el cambio de ruta.
      if (!root.current || !photoFrame.current) return;
      root.current.style.setProperty("--navbar-height", `${navbar.getBoundingClientRect().height}px`);
      const { width, height } = photoFrame.current.getBoundingClientRect();
      setFrameSize((previous) => previous?.width === width && previous?.height === height ? previous : { width, height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(navbar);
    observer.observe(photoFrame.current);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(root.current);
    const visibilityChanged = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || hovered || focused || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % coverPhotos.length), 6000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, hovered, focused, visible, tabVisible, active]);

  function selectPhoto(next) {
    setActive(next);
    setAnnouncement(`${next + 1} de ${coverPhotos.length}: ${coverPhotos[next].title}`);
  }

  function move(direction) {
    selectPhoto((active + direction + coverPhotos.length) % coverPhotos.length);
  }

  return (
    <section ref={root} className="immersive-cover" aria-label="Selección de fotografías" aria-roledescription="carrusel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <header className="immersive-cover__title"><h1>Juan Acosta Photography</h1></header>
      <div ref={photoFrame} className="immersive-cover__stage" style={{ "--photo-width": `${displayedWidth}px` }}>
        <div className="immersive-cover__photos" id="portada-fotografias" aria-live="off">
          {frameSize && coverPhotos.map((photo, index) => (
            <img key={photo.image} src={photo.image} srcSet={photo.srcSet}
              sizes={`${Math.ceil(Math.min(availableWidth, frameSize.height * photo.width / photo.height))}px`}
              width={photo.width} height={photo.height} alt={photo.alt} aria-hidden={index !== active}
              className={index === active ? "is-active" : ""}
              fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
          ))}
        </div>
        <button className="immersive-cover__arrow immersive-cover__arrow--previous" type="button" onClick={() => move(-1)} aria-label="Fotografía anterior" aria-controls="portada-fotografias">←</button>
        <button className="immersive-cover__arrow immersive-cover__arrow--next" type="button" onClick={() => move(1)} aria-label="Fotografía siguiente" aria-controls="portada-fotografias">→</button>
      </div>
      <div className="immersive-cover__controls">
        <span className="immersive-cover__name">{coverPhotos[active].title}</span>
        <div className="immersive-cover__dots" role="group" aria-label="Elegir fotografía">
          {coverPhotos.map((photo, index) => <button key={photo.image} type="button" onClick={() => selectPhoto(index)}
            aria-label={`Mostrar fotografía ${index + 1}: ${photo.title}`} aria-controls="portada-fotografias" aria-current={index === active ? "true" : undefined}>
            <span aria-hidden="true" />
          </button>)}
        </div>
      </div>
      <span className="portfolio-sr" role="status">{announcement}</span>
    </section>
  );
}
