import { useEffect, useRef, useState } from "react";
import { coverPhotos } from "../../data/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ImmersiveCover() {
  const root = useRef(null);
  const photoFrame = useRef(null);
  const [frameSize, setFrameSize] = useState(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => !document.hidden);
  const [announcement, setAnnouncement] = useState("");
  const wantsPlayback = playing && (!reducedMotion || motionOptIn);

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
    if (!playing || (reducedMotion && !motionOptIn) || hovered || focused || !visible || !tabVisible) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % coverPhotos.length), 6000);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, motionOptIn, hovered, focused, visible, tabVisible, active]);

  function move(direction) {
    const next = (active + direction + coverPhotos.length) % coverPhotos.length;
    setActive(next);
    setAnnouncement(`${next + 1} de ${coverPhotos.length}: ${coverPhotos[next].title}`);
  }

  return (
    <section ref={root} className="immersive-cover" aria-label="Selección de fotografías" aria-roledescription="carrusel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <header className="immersive-cover__title"><h1>Juan Acosta Photography</h1></header>
      <div ref={photoFrame} className="immersive-cover__photos" aria-live="off">
        {frameSize && coverPhotos.map((photo, index) => (
          <img key={photo.image} src={photo.image} srcSet={photo.srcSet}
            sizes={`${Math.ceil(Math.min(frameSize.width, frameSize.height * photo.width / photo.height))}px`}
            width={photo.width} height={photo.height} alt={photo.alt} aria-hidden={index !== active}
            className={index === active ? "is-active" : ""}
            fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
        ))}
      </div>
      <div className="immersive-cover__controls">
        <span className="immersive-cover__name">{coverPhotos[active].title}</span>
        <div className="immersive-cover__buttons">
          <button type="button" onClick={() => { setPlaying(!wantsPlayback); setMotionOptIn(true); }} aria-label={wantsPlayback ? "Pausar el cambio automático" : "Reproducir el cambio automático"}>{wantsPlayback ? "Pausar" : "Reproducir"}</button>
          <button type="button" onClick={() => move(-1)} aria-label="Fotografía anterior">←</button>
          <span>{active + 1} / {coverPhotos.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Fotografía siguiente">→</button>
        </div>
      </div>
      <span className="portfolio-sr" role="status">{announcement}</span>
    </section>
  );
}
