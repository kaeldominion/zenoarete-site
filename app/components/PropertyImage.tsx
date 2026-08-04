interface PropertyImageProps {
  photoNumber: number;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function source(photoNumber: number, width: 480 | 960 | 1440) {
  return `/images/airbnb/photo-${String(photoNumber).padStart(3, "0")}-${width}.webp`;
}

export default function PropertyImage({
  photoNumber,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: PropertyImageProps) {
  return (
    <img
      src={source(photoNumber, 960)}
      srcSet={`${source(photoNumber, 480)} 480w, ${source(photoNumber, 960)} 960w, ${source(photoNumber, 1440)} 1440w`}
      sizes={sizes}
      alt={alt}
      width={1440}
      height={960}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={className}
    />
  );
}
