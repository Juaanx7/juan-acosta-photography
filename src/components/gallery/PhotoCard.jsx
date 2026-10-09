import { FiCheck } from "react-icons/fi";
import "./PhotoCard.scss";
import { cloudinaryImageVariants, galleryPhotoSizes } from "../../utils/cloudinaryImages";

const PhotoCard = ({ photo, selected, togglePhotoSelection, openModal }) => {
  return (
    <article className={`photo-card ${selected ? "selected" : ""}`}>
      <button
        className={`photo-card__select ${selected ? "active" : ""}`}
        onClick={() => togglePhotoSelection(photo.id)}
        aria-label={`${selected ? "Quitar" : "Seleccionar"} ${photo.id}`}
        aria-pressed={selected}
      >
        <FiCheck />
      </button>

      <button type="button" className="photo-card__image" aria-label={`Abrir foto ${photo.id}`} onClick={() => openModal(photo)}>
        <img
          src={photo.thumbnail || photo.image}
          {...cloudinaryImageVariants(photo.thumbnail || photo.image, [320, 640, 960, 1440])}
          sizes={galleryPhotoSizes}
          alt={photo.id}
          loading="lazy"
        />
      </button>

      <div className="photo-card__footer">
        <span>{photo.id}</span>
      </div>
    </article>
  );
};

export default PhotoCard;
