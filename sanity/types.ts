import { SanityImageAsset } from '@sanity/image-url/lib/types/types';

/**
 * Portable Text / Block Content type
 * Used in body, bio, and other rich text fields
 */
export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  children: Array<{
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
    openInNewTab?: boolean;
  }>;
}

export interface PortableTextImage {
  _type: 'image';
  _key: string;
  asset: SanityImageAsset;
  alt: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export type PortableText = (PortableTextBlock | PortableTextImage)[];

/**
 * Image type with metadata
 */
export interface SanityImage {
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Slug type
 */
export interface Slug {
  current: string;
}

/**
 * Photography Project
 */
export interface Project {
  _id: string;
  _type: 'project';
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: Slug;
  coverImage: SanityImage;
  gallery: Array<{
    _key: string;
    image: SanityImage;
    caption?: string;
  }>;
  category: 'street' | 'travel' | 'landscape' | 'portrait' | 'architecture' | 'documentary';
  tags?: string[];
  description: string;
  body?: PortableText;
  imageCount?: number;
  location?: string;
  date?: string;
  featured?: boolean;
  order?: number;
  publishedAt: string;
}

/**
 * Blog Post
 */
export interface Post {
  _id: string;
  _type: 'post';
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: Slug;
  coverImage?: SanityImage;
  excerpt: string;
  body: PortableText;
  category: 'photo-essay' | 'travel-notes' | 'gear' | 'behind-the-images';
  publishedAt: string;
}

/**
 * Navigation Item
 */
export interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
  order: number;
}

/**
 * Navigation Document
 */
export interface Navigation {
  _id: string;
  _type: 'navigation';
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  items: NavItem[];
}

/**
 * Social Link
 */
export interface SocialLink {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'behance' | 'flickr' | 'youtube' | 'tiktok';
  url: string;
}

/**
 * Site Settings
 */
export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  siteName: string;
  tagline?: string;
  heroImage?: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
  socialLinks?: SocialLink[];
  contactEmail?: string;
  footerText?: string;
}

/**
 * Exhibition Record
 */
export interface Exhibition {
  title: string;
  venue: string;
  year: number;
}

/**
 * About Page Document
 */
export interface About {
  _id: string;
  _type: 'about';
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  portrait?: SanityImage;
  title: string;
  bio: PortableText;
  shortBio: string;
  equipment?: string[];
  exhibitions?: Exhibition[];
}

/**
 * Type guards to check if content is of specific type
 */
export const isProject = (doc: any): doc is Project => doc._type === 'project';
export const isPost = (doc: any): doc is Post => doc._type === 'post';
export const isNavigation = (doc: any): doc is Navigation => doc._type === 'navigation';
export const isSiteSettings = (doc: any): doc is SiteSettings => doc._type === 'siteSettings';
export const isAbout = (doc: any): doc is About => doc._type === 'about';

/**
 * Project category options
 */
export const PROJECT_CATEGORIES = ['street', 'travel', 'landscape', 'portrait', 'architecture', 'documentary'] as const;
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

/**
 * Post category options
 */
export const POST_CATEGORIES = ['photo-essay', 'travel-notes', 'gear', 'behind-the-images'] as const;
export type PostCategory = typeof POST_CATEGORIES[number];

/**
 * Social platform options
 */
export const SOCIAL_PLATFORMS = ['instagram', 'twitter', 'facebook', 'linkedin', 'behance', 'flickr', 'youtube', 'tiktok'] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];
