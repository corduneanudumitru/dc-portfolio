import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo as PhotoType } from "@/portfolio/data";
export default function Photo({
  photo,
  priority = false,
  viewer = false,
  locale = "en",
}: {
  photo: PhotoType;
  priority?: boolean;
  viewer?: boolean;
  locale?: string;
}) {
  return (
    <Image
      src={photo.src}
      width={photo.width}
      height={photo.height}
      alt={locale === "ro" && photo.altRo ? photo.altRo : photo.alt}
      sizes={
        viewer
          ? "90vw"
          : "(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 45vw"
      }
      priority={priority}
      style={{ "--image-ratio": photo.width / photo.height } as CSSProperties}
    />
  );
}
