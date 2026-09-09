import { useEffect, useState } from "react";

const getStorageKey = (eventId) => `juan-photo-selection-${eventId}`;

const loadSelection = (eventId) => {
  try {
    const savedSelection = localStorage.getItem(getStorageKey(eventId));
    const selection = savedSelection ? JSON.parse(savedSelection) : [];
    return Array.isArray(selection) &&
      selection.every((photoId) => typeof photoId === "string")
      ? selection
      : [];
  } catch {
    return [];
  }
};

export const useEventSelection = (eventId) => {
  const [selection, setSelection] = useState(() => ({
    eventId,
    selectedPhotos: loadSelection(eventId),
  }));

  // React repite el render antes de mostrar hijos con la selección anterior.
  if (selection.eventId !== eventId) {
    setSelection({ eventId, selectedPhotos: loadSelection(eventId) });
  }

  useEffect(() => {
    if (selection.eventId !== eventId) return;

    try {
      localStorage.setItem(
        getStorageKey(selection.eventId),
        JSON.stringify(selection.selectedPhotos)
      );
    } catch {
      // Si el almacenamiento no está disponible, la selección sigue en memoria.
    }
  }, [eventId, selection]);

  const togglePhotoSelection = (photoId) => {
    setSelection((prev) => ({
      ...prev,
      selectedPhotos: prev.selectedPhotos.includes(photoId)
        ? prev.selectedPhotos.filter((id) => id !== photoId)
        : [...prev.selectedPhotos, photoId],
    }));
  };

  const clearSelection = () => {
    setSelection((prev) => ({ ...prev, selectedPhotos: [] }));
  };

  return {
    selectedPhotos: selection.selectedPhotos,
    togglePhotoSelection,
    clearSelection,
  };
};
