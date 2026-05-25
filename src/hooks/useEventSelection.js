import { useEffect, useState } from "react";

const getStorageKey = (eventId) => `juan-photo-selection-${eventId}`;

const loadSelection = (eventId) => {
  const savedSelection = localStorage.getItem(getStorageKey(eventId));
  return savedSelection ? JSON.parse(savedSelection) : [];
};

export const useEventSelection = (eventId) => {
  const [selectedPhotos, setSelectedPhotos] = useState(() =>
    loadSelection(eventId)
  );

  useEffect(() => {
    localStorage.setItem(
      getStorageKey(eventId),
      JSON.stringify(selectedPhotos)
    );
  }, [eventId, selectedPhotos]);

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const clearSelection = () => {
    setSelectedPhotos([]);
  };

  return {
    selectedPhotos,
    togglePhotoSelection,
    clearSelection,
  };
};