import { useState } from "react";
import PlateSearch from "../components/gallery/PlateSearch";
import PhotoGrid from "../components/gallery/PhotoGrid";
import { Link, Navigate, useParams } from "react-router-dom";
import { events } from "../data/events";
import "./EventCategories.scss";
import SelectionBar from "../components/gallery/SelectionBar";
import { useEventSelection } from "../hooks/useEventSelection";
import PhotoModal from "../components/gallery/PhotoModal";

const EventCategories = () => {
  const { eventId } = useParams();

  const event = events.find((item) => item.id === eventId);

  const {
    selectedPhotos,
    togglePhotoSelection,
    clearSelection,
  } = useEventSelection(eventId);

  const [searchResults, setSearchResults] = useState([]);
  const [searchedPlate, setSearchedPlate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  if (!event.categories) {
    return <Navigate to={`/evento/${event.id}/galeria`} replace />;
  }

  // resto...

const handlePlateSearch = (results, plateNumber) => {
  setSearchResults(results);
  setSearchedPlate(plateNumber);
};

const allEventPhotos = event.categories
  ? event.categories.flatMap((category) =>
      category.photos.map((photo) => ({
        ...photo,
        categoryId: category.id,
        categoryTitle: category.title,
      }))
    )
  : event.photos || [];

  return (
    <>
      <section className="event-categories">
        <div className="container">
          <div className="event-categories__header">
            <Link to="/#eventos" className="event-categories__back">
              ← Volver a eventos
            </Link>

            <span>{event.location}</span>
            <h1>{event.title}</h1>

            <PlateSearch
              event={event}
              photos={allEventPhotos}
              onSearch={handlePlateSearch}
            />

            {searchedPlate && (
              <section className="event-categories__search-results">
                <h2>Fotos del corredor #{searchedPlate}</h2>

                {searchResults.length > 0 ? (
                  <>
                    <p>
                      Encontramos {searchResults.length}{" "}
                      {searchResults.length === 1 ? "foto" : "fotos"}.
                    </p>

                    <PhotoGrid
                      photos={searchResults}
                      selectedPhotos={selectedPhotos}
                      togglePhotoSelection={togglePhotoSelection}
                      openModal={setSelectedImage}
                    />
                  </>
                ) : (
                  <p>
                    No encontramos fotos para ese número. Podés revisar los
                    circuitos manualmente.
                  </p>
                )}
              </section>
            )}

            <p>
              Las fotos están separadas por categoría para que puedas encontrar tu
              tanda más rápido.
            </p>
          </div>

          <div className="event-categories__grid">
            {event.categories.map((category) => (
              <Link
                to={`/evento/${event.id}/${category.id}`}
                className="event-category-card"
                key={category.id}
              >
                <div className="event-category-card__image">
                  <img src={category.coverImage} alt={category.title} />
                </div>

                <div className="event-category-card__content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span>Ver galería</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SelectionBar
          selectedPhotos={selectedPhotos}
          event={event}
          photos={allEventPhotos}
          togglePhotoSelection={togglePhotoSelection}
          clearSelection={clearSelection}
        />
      </section>

      {selectedImage && (
        <PhotoModal
          photo={selectedImage}
          photos={searchResults}
          closeModal={() => setSelectedImage(null)}
          setSelectedImage={setSelectedImage}
          setCurrentPage={() => {}}
          photosPerPage={searchResults.length || 1}
        />
      )}
    </>
  );
  ;
};

export default EventCategories;