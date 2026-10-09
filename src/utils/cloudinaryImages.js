// Solo adaptar las URLs de entrega ya generadas por este proyecto.
// c_limit conserva proporciones y evita ampliar por encima del recurso en Cloudinary.
export function cloudinaryImageVariants(source, widths) {
  const match = source?.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)f_auto,q_auto(?::good)?,w_\d+(\/v\d+\/.+)$/);
  if (!match) return {};
  const url = (width) => `${match[1]}f_auto,q_auto:good,c_limit,w_${width}${match[2]}`;
  return { srcSet: widths.map((width) => `${url(width)} ${width}w`).join(", ") };
}

export const galleryPhotoSizes = "(max-width: 760px) calc((100vw - 54px) / 2 - 14px), (max-width: 900px) calc((100vw - 80px) / 3 - 14px), (max-width: 1100px) calc((90vw - 32px) / 3 - 14px), calc((min(90vw, 2200px) - 54px) / 4 - 14px)";
export const eventCoverSizes = "(max-width: 580px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 80px) / 2), (max-width: 1599px) calc((90vw - 64px) / 3), calc((min(90vw, 2200px) - 96px) / 4)";
export const categoryCoverSizes = "(max-width: 580px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 76px) / 2), calc((min(90vw, 2200px) - 56px) / 3)";
