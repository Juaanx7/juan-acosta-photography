import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { events } from "../data/events";

import PhotoGrid from "../components/gallery/PhotoGrid";
import PhotoModal from "../components/gallery/PhotoModal";
import SelectionBar from "../components/gallery/SelectionBar";
import Pagination from "../components/gallery/Pagination";

import "./Gallery.scss";

const PHOTOS_PER_PAGE = 16;

const Gallery = () => {
  const { eventId } = useParams();

  const event = events.find((event) => event.id === eventId);

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!event) {
    return (
      <section className="gallery-page">
        <div className="container">
          <div className="gallery-page__not-found">
            <h1>Evento no encontrado</h1>
            <p>La galería que estás buscando no existe o ya no está disponible.</p>
            <Link to="/">Volver al inicio</Link>
          </div>
        </div>
      </section>
    );
  }

  const totalPages = Math.ceil(event.photos.length / PHOTOS_PER_PAGE);

  const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;

  const currentPhotos = event.photos.slice(
    startIndex,
    startIndex + PHOTOS_PER_PAGE
  );

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  return (
    <>
      <section className="gallery-page">
        <div className="container">
          <div className="gallery-page__header">
            <Link to="/" className="gallery-page__back">
              ← Volver a eventos
            </Link>

            <h1>{event.title}</h1>
            <p>
              {event.date} · {event.location}
            </p>

            <span className="gallery-page__hint">
              Tocá el check en cada foto para armar tu pedido.
            </span>
          </div>

          <PhotoGrid
            photos={currentPhotos}
            selectedPhotos={selectedPhotos}
            togglePhotoSelection={togglePhotoSelection}
            openModal={setSelectedImage}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>

      {selectedImage && (
        <PhotoModal
          photo={selectedImage}
          photos={event.photos}
          closeModal={() => setSelectedImage(null)}
          setSelectedImage={setSelectedImage}
          setCurrentPage={setCurrentPage}
          photosPerPage={PHOTOS_PER_PAGE}
        />
      )}

      <SelectionBar
        selectedPhotos={selectedPhotos}
        event={event}
        photos={event.photos}
        togglePhotoSelection={togglePhotoSelection}
      />
    </>
  );
};

export default Gallery;