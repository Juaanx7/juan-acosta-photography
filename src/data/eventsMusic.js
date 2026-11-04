import images from "./eventsMusicImages.json";

export const eventsMusicPhotos = images.photos.map(photo => ({
  ...photo,
  location: photo.caption,
  srcSet: photo.variants.map(variant => `${variant.image} ${variant.width}w`).join(", "),
}));

// Mismos bordes y altura de imagen por fila, calculados desde las fuentes orientadas.
export const eventsMusicRows = images.rows.map(files => {
  const indices = files.map(file => eventsMusicPhotos.findIndex(photo => photo.source === file));
  const ratios = indices.map(index => eventsMusicPhotos[index].width / eventsMusicPhotos[index].height);
  const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
  const gaps = (files.length - 1) * 20;
  return {
    columns: ratios.map(ratio => `minmax(0, ${ratio}fr)`).join(" "),
    items: indices.map((index, column) => {
      const fraction = ratios[column] / total;
      return { index, photo: eventsMusicPhotos[index],
        sizes: `(max-width: 580px) calc(100vw - 44px), (max-width: 600px) calc(100vw - 48px), (max-width: 900px) calc((100vw - 48px - ${gaps}px) * ${fraction}), calc((min(90vw, 2200px) - ${gaps}px) * ${fraction})` };
    }),
  };
});
