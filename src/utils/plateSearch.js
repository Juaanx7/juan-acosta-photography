import { plateNumbers } from "../data/plateNumbers";

export const getPlateNumbersForPhoto = (eventId, photoId) => {
  return plateNumbers[eventId]?.[photoId] || [];
};

export const photoHasPlateNumber = (eventId, photoId, plateNumber) => {
  const numbers = getPlateNumbersForPhoto(eventId, photoId);

  return numbers.includes(String(plateNumber));
};