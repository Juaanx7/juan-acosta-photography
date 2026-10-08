import ResponsivePhoto from "./ResponsivePhoto";

export default function SeriesPhoto({ photo, sizes, priority = false, onOpen, caption, className = "" }) {
  const label = photo.title || photo.alt;
  return <figure className={`series-work ${className}`} data-source={photo.source}>
    <button type="button" className="series-work__open" aria-label={`Ampliar ${label}`} onClick={onOpen}>
      <ResponsivePhoto photo={photo} sizes={sizes} priority={priority} />
    </button>
    <figcaption>{caption}
      <button type="button" aria-label={`Ampliar ${label}, abrir visor`} onClick={onOpen}>Ampliar ↗</button>
    </figcaption>
  </figure>;
}
