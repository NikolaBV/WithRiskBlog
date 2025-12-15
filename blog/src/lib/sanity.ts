import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity client configuration
// Using your existing Sanity project from studio-blog
const isDev = import.meta.env.DEV;

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'bwv3bcfv',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: !isDev, // Disable CDN in dev for fresh data
  perspective: 'published', // Only fetch published content
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ Queries
export const queries = {
  // Get all published posts
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "...",
    author->{
      name,
      image
    },
    categories[]->{
      _id,
      title
    }
  }`,

  // Get single post by slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    mainImage,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      _id,
      title
    }
  }`,

  // Get all post slugs for static generation
  allPostSlugs: `*[_type == "post"].slug.current`,

  // Get all categories
  allCategories: `*[_type == "category"] {
    _id,
    title,
    description
  }`,

  // Get posts by category
  postsByCategory: `*[_type == "post" && references($categoryId)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    author->{
      name
    }
  }`,
};

// Type definitions matching your Sanity schema
export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  body?: any[];
  mainImage?: SanityImageSource;
  excerpt?: string;
  author?: {
    name: string;
    image?: SanityImageSource;
    bio?: any[];
  };
  categories?: {
    _id: string;
    title: string;
  }[];
}

export interface SanityCategory {
  _id: string;
  title: string;
  description?: string;
}

