export default function ResponsivePhoto({ photo, sizes, priority = false, ...props }) {
  return <img src={photo.image} srcSet={photo.srcSet} sizes={sizes}
    width={photo.width} height={photo.height} alt={photo.alt}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"}
    decoding="async" {...props} />;
}
