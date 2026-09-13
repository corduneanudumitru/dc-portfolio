"use client";
import Image, { type ImageLoaderProps } from "next/image";
function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 85));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
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
      loader={sanityLoader}
      src={photo.src}
      loading={viewer ? "eager" : undefined}
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
