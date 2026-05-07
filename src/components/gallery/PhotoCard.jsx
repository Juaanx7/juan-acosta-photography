import { FiCheck } from "react-icons/fi";
import "./PhotoCard.scss";

const PhotoCard = ({ photo, selected, togglePhotoSelection, openModal }) => {
  return (
    <article className={`photo-card ${selected ? "selected" : ""}`}>
      <button
        className={`photo-card__select ${selected ? "active" : ""}`}
        onClick={() => togglePhotoSelection(photo.id)}
      >
        <FiCheck />
      </button>

      <div className="photo-card__image" onClick={() => openModal(photo)}>
        <img src={photo.image} alt={photo.id} />
      </div>

      <div className="photo-card__footer">
        <span>{photo.id}</span>
      </div>
    </article>
  );
};

export default PhotoCard;