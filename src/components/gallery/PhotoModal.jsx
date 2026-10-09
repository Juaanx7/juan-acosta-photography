import { useCallback, useEffect, useRef } from "react";
import { cloudinaryImageVariants } from "../../utils/cloudinaryImages";
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
  const modal = useRef(null);
  const currentIndex = photos.findIndex((item) => item.id === photo.id);

  const updatePageByPhotoIndex = useCallback((photoIndex) => {
    const newPage = Math.floor(photoIndex / photosPerPage) + 1;
    setCurrentPage(newPage);
  }, [photosPerPage, setCurrentPage]);

  const goToPrevious = useCallback((e) => {
    if (e) e.stopPropagation();

    const previousIndex =
      currentIndex === 0 ? photos.length - 1 : currentIndex - 1;

    setSelectedImage(photos[previousIndex]);
    updatePageByPhotoIndex(previousIndex);
  }, [currentIndex, photos, setSelectedImage, updatePageByPhotoIndex]);

  const goToNext = useCallback((e) => {
    if (e) e.stopPropagation();

    const nextIndex =
      currentIndex === photos.length - 1 ? 0 : currentIndex + 1;

    setSelectedImage(photos[nextIndex]);
    updatePageByPhotoIndex(nextIndex);
  }, [currentIndex, photos, setSelectedImage, updatePageByPhotoIndex]);

  useEffect(() => {
    const opener = document.activeElement;
    const scrollY = window.scrollY;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.current.querySelector("button").focus();
    return () => {
      document.body.style.overflow = overflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      const returnTarget = opener?.isConnected ? opener : document.querySelector(".photo-card__image");
      returnTarget?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Tab") {
        const buttons = modal.current.querySelectorAll("button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if ((e.shiftKey && document.activeElement === first) || (!e.shiftKey && document.activeElement === last)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, goToNext, goToPrevious]);

  useEffect(() => {
    const previousIndex =
      currentIndex === 0 ? photos.length - 1 : currentIndex - 1;

    const nextIndex =
      currentIndex === photos.length - 1 ? 0 : currentIndex + 1;

    const previousImage = new Image();
    previousImage.src = photos[previousIndex].image;

    const nextImage = new Image();
    nextImage.src = photos[nextIndex].image;
  }, [currentIndex, photos]);

  return (
    <div ref={modal} className="photo-modal" role="dialog" aria-modal="true" aria-label={`Foto ${photo.id}`} onClick={closeModal}>
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
        <img src={photo.image} {...cloudinaryImageVariants(photo.image, [640, 960, 1440, 1920, 2560, 3200, 4400])}
          sizes="min(90vw, 2200px)" alt={photo.id} loading="eager" />
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
