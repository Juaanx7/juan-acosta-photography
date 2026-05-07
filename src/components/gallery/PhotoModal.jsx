import { useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./PhotoModal.scss";

const PhotoModal = ({
  photo,
  photos,
  closeModal,
  setSelectedImage,
  setCurrentPage,
  photosPerPage,
}) => {
  const currentIndex = photos.findIndex((item) => item.id === photo.id);

  const updatePageByPhotoIndex = (photoIndex) => {
    const newPage = Math.floor(photoIndex / photosPerPage) + 1;
    setCurrentPage(newPage);
  };

  const goToPrevious = (e) => {
    if (e) e.stopPropagation();

    const previousIndex =
      currentIndex === 0 ? photos.length - 1 : currentIndex - 1;

    setSelectedImage(photos[previousIndex]);
    updatePageByPhotoIndex(previousIndex);
  };

  const goToNext = (e) => {
    if (e) e.stopPropagation();

    const nextIndex =
      currentIndex === photos.length - 1 ? 0 : currentIndex + 1;

    setSelectedImage(photos[nextIndex]);
    updatePageByPhotoIndex(nextIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [currentIndex]);

  return (
    <div className="photo-modal" onClick={closeModal}>
      <button
        className="photo-modal__close"
        onClick={closeModal}
        aria-label="Cerrar imagen"
      >
        <FiX />
      </button>

      <button
        className="photo-modal__nav photo-modal__nav--left"
        onClick={goToPrevious}
        aria-label="Foto anterior"
      >
        <FiChevronLeft />
      </button>

      <div className="photo-modal__content" onClick={(e) => e.stopPropagation()}>
        <img src={photo.image} alt={photo.id} />
        <p>{photo.id}</p>
      </div>

      <button
        className="photo-modal__nav photo-modal__nav--right"
        onClick={goToNext}
        aria-label="Foto siguiente"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default PhotoModal;