export const getEventPhotos = (event) => event?.categories
  ? event.categories.flatMap((category) => category.photos.map((photo) => ({
    ...photo,
    categoryId: category.id,
    categoryTitle: category.title,
  })))
  : event?.photos || [];
