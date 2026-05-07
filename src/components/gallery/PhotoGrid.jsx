import PhotoCard from "./PhotoCard";
import "./PhotoGrid.scss";

const PhotoGrid = ({
  photos,
  selectedPhotos,
  togglePhotoSelection,
  openModal,
}) => {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          selected={selectedPhotos.includes(photo.id)}
          togglePhotoSelection={togglePhotoSelection}
          openModal={openModal}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;