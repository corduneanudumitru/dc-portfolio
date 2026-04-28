interface SanityImageLike {
  asset?: {
    _ref?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
}

function parseDimensionsFromRef(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || height === 0) {
    return null;
  }

  return { width, height, aspectRatio: width / height };
}

export function getImageAspectRatio(image?: SanityImageLike | null, fallback = 1.5) {
  const metadataRatio = image?.asset?.metadata?.dimensions?.aspectRatio;
  if (typeof metadataRatio === 'number' && Number.isFinite(metadataRatio) && metadataRatio > 0) {
    return metadataRatio;
  }

  const width = image?.asset?.metadata?.dimensions?.width;
  const height = image?.asset?.metadata?.dimensions?.height;
  if (
    typeof width === 'number' &&
    typeof height === 'number' &&
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    height > 0
  ) {
    return width / height;
  }

  return parseDimensionsFromRef(image?.asset?._ref)?.aspectRatio || fallback;
}

