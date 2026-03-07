import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { urlFor } from './client';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  fit?: 'max' | 'min' | 'clip' | 'crop' | 'fill' | 'fillmax' | 'scale';
  auto?: 'format';
}

/**
 * Generate an optimized image URL from a Sanity image asset
 * @param source The image source from Sanity
 * @param options Image transformation options
 * @returns The optimized image URL string
 */
export function getImageUrl(
  source: SanityImageSource | null | undefined,
  options: ImageOptions = {}
): string {
  if (!source) {
    return '';
  }

  let imageUrl = urlFor(source);

  if (options.width) {
    imageUrl = imageUrl.width(options.width);
  }

  if (options.height) {
    imageUrl = imageUrl.height(options.height);
  }

  if (options.quality) {
    imageUrl = imageUrl.quality(options.quality);
  }

  if (options.fit) {
    imageUrl = imageUrl.fit(options.fit);
  }

  if (options.auto) {
    imageUrl = imageUrl.auto(options.auto);
  }

  return imageUrl.url();
}

/**
 * Get responsive image URLs for different screen sizes
 * @param source The image source from Sanity
 * @returns Object with URLs for different breakpoints
 */
export function getResponsiveImageUrls(source: SanityImageSource | null | undefined) {
  if (!source) {
    return {
      mobile: '',
      tablet: '',
      desktop: '',
      original: '',
    };
  }

  return {
    mobile: getImageUrl(source, { width: 640, quality: 80, fit: 'max' }),
    tablet: getImageUrl(source, { width: 1024, quality: 85, fit: 'max' }),
    desktop: getImageUrl(source, { width: 1920, quality: 90, fit: 'max' }),
    original: getImageUrl(source, { auto: 'format' }),
  };
}

/**
 * Get a thumbnail URL for preview images
 * @param source The image source from Sanity
 * @param size The thumbnail size (default 300px)
 * @returns The thumbnail URL string
 */
export function getThumbnailUrl(
  source: SanityImageSource | null | undefined,
  size: number = 300
): string {
  return getImageUrl(source, {
    width: size,
    height: size,
    fit: 'crop',
    quality: 75,
  });
}

/**
 * Get a hero/banner image URL
 * @param source The image source from Sanity
 * @param width The banner width (default 1920)
 * @returns The hero image URL string
 */
export function getHeroImageUrl(
  source: SanityImageSource | null | undefined,
  width: number = 1920
): string {
  return getImageUrl(source, {
    width,
    quality: 90,
    fit: 'fill',
  });
}
