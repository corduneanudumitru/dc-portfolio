import { client } from './client';

/**
 * Fetch all projects, optionally filtered by category
 * @param category Optional category to filter by ('street', 'travel', 'landscape', 'portrait', 'architecture', 'documentary')
 * @returns Array of project documents
 */
export async function getAllProjects(category?: string) {
  const query = category
    ? `*[_type == "project" && category == "${category}"] | order(order asc, publishedAt desc) {
        _id,
        title,
        slug,
        coverImage,
        gallery,
        category,
        tags,
        description,
        imageCount,
        location,
        date,
        featured,
        order,
        publishedAt,
      }`
    : `*[_type == "project"] | order(order asc, publishedAt desc) {
        _id,
        title,
        slug,
        coverImage,
        gallery,
        category,
        tags,
        description,
        imageCount,
        location,
        date,
        featured,
        order,
        publishedAt,
      }`;

  return client.fetch(query);
}

/**
 * Fetch featured projects only
 * @returns Array of featured project documents
 */
export async function getFeaturedProjects() {
  const query = `*[_type == "project" && featured == true] | order(order asc, publishedAt desc) {
    _id,
    title,
    slug,
    coverImage,
    category,
    tags,
    description,
    imageCount,
    location,
    date,
    featured,
    publishedAt,
  }`;

  return client.fetch(query);
}

/**
 * Fetch a single project by slug
 * @param slug The project slug
 * @returns Single project document or null
 */
export async function getProjectBySlug(slug: string) {
  const query = `*[_type == "project" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    coverImage,
    gallery,
    category,
    tags,
    description,
    body,
    imageCount,
    location,
    date,
    featured,
    publishedAt,
  }`;

  return client.fetch(query);
}

/**
 * Fetch all projects with minimal data for listings
 * @returns Array of project documents with basic fields only
 */
export async function getProjectSlugs() {
  const query = `*[_type == "project"] {
    slug,
  }`;

  return client.fetch(query);
}

/**
 * Fetch all blog posts, optionally filtered by category
 * @param category Optional category to filter by ('photo-essay', 'travel-notes', 'gear', 'behind-the-images')
 * @returns Array of post documents
 */
export async function getAllPosts(category?: string) {
  const query = category
    ? `*[_type == "post" && category == "${category}"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        category,
        publishedAt,
      }`
    : `*[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        category,
        publishedAt,
      }`;

  return client.fetch(query);
}

/**
 * Fetch a single blog post by slug
 * @param slug The post slug
 * @returns Single post document or null
 */
export async function getPostBySlug(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    coverImage,
    excerpt,
    body,
    category,
    publishedAt,
  }`;

  return client.fetch(query);
}

/**
 * Fetch all blog post slugs for static generation
 * @returns Array of post documents with slug only
 */
export async function getPostSlugs() {
  const query = `*[_type == "post"] {
    slug,
  }`;

  return client.fetch(query);
}

/**
 * Fetch recent blog posts
 * @param limit Number of posts to fetch (default 5)
 * @returns Array of recent post documents
 */
export async function getRecentPosts(limit: number = 5) {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    coverImage,
    excerpt,
    category,
    publishedAt,
  }`;

  return client.fetch(query);
}

/**
 * Fetch navigation configuration
 * @returns Navigation document with items array
 */
export async function getNavigation() {
  const query = `*[_type == "navigation"][0] {
    items[] | order(order asc) {
      label,
      href,
      isExternal,
      order,
    },
  }`;

  return client.fetch(query);
}

/**
 * Fetch site settings
 * @returns Site settings document
 */
export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0] {
    siteName,
    tagline,
    heroImage,
    seoTitle,
    seoDescription,
    socialLinks[] {
      platform,
      url,
    },
    contactEmail,
    footerText,
  }`;

  return client.fetch(query);
}

/**
 * Fetch about page content
 * @returns About page document
 */
export async function getAboutPage() {
  const query = `*[_type == "about"][0] {
    portrait,
    title,
    bio,
    shortBio,
    equipment,
    exhibitions[] | order(year desc) {
      title,
      venue,
      year,
    },
  }`;

  return client.fetch(query);
}

/**
 * Get all unique project categories
 * @returns Array of category strings
 */
export async function getProjectCategories() {
  const query = `distinct(*[_type == "project"].category)`;

  return client.fetch(query);
}

/**
 * Get all unique blog post categories
 * @returns Array of category strings
 */
export async function getPostCategories() {
  const query = `distinct(*[_type == "post"].category)`;

  return client.fetch(query);
}

/**
 * Search projects by tags
 * @param tags Array of tag strings to search for
 * @returns Array of matching project documents
 */
export async function searchProjectsByTags(tags: string[]) {
  const tagQuery = tags.map((tag) => `"${tag}"`).join(', ');
  const query = `*[_type == "project" && count(tags[@ in [${tagQuery}]]) > 0] | order(publishedAt desc) {
    _id,
    title,
    slug,
    coverImage,
    category,
    tags,
    description,
    publishedAt,
  }`;

  return client.fetch(query);
}

/**
 * Get project statistics for analytics
 * @returns Object with project counts and metadata
 */
export async function getProjectStats() {
  const query = `{
    "totalProjects": count(*[_type == "project"]),
    "featuredProjects": count(*[_type == "project" && featured == true]),
    "byCategory": *[_type == "project"] {
      category
    } | group(category) | map({
      "category": .[0].category,
      "count": length(.)
    }),
    "totalImages": *[_type == "project"]. imageCount | add,
  }`;

  return client.fetch(query);
}

/**
 * Get blog post statistics
 * @returns Object with post counts and metadata
 */
export async function getPostStats() {
  const query = `{
    "totalPosts": count(*[_type == "post"]),
    "byCategory": *[_type == "post"] {
      category
    } | group(category) | map({
      "category": .[0].category,
      "count": length(.)
    }),
  }`;

  return client.fetch(query);
}
