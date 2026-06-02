import { createClient } from '@sanity/client';

export const client = createClient({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
	// Static builds should read fresh Sanity data instead of a potentially stale CDN snapshot.
	useCdn: false,
	apiVersion: '2024-01-01',
});

// ─── Types ──────────────────────────────────────────────────────────────────

export type SanityImage = {
	_type: 'image';
	asset: { _ref: string; _type: 'reference' };
	hotspot?: { x: number; y: number; height: number; width: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	alt?: string;
};

export type PortableTextBlock = {
	_type: string;
	_key: string;
	[key: string]: unknown;
};

export type ProjectPost = {
	_id: string;
	projectSlug: string;
	projectName: string;
	postSlug: { current: string };
	title: string;
	description?: string;
	metaDescription?: string;
	pubDate: string;
	updatedDate?: string;
	heroImage?: SanityImage;
	body?: PortableTextBlock[];
};

export type Thought = {
	_id: string;
	title: string;
	description?: string;
	metaDescription?: string;
	pubDate: string;
	updatedDate?: string;
	slug: { current: string };
	body?: PortableTextBlock[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Mirrors the slugify in project schema — strips characters invalid in URL paths
function sanitizeSlug(slug: string): string {
	return slug
		.toLowerCase()
		.trim()
		.replace(/[?]+/g, '')
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9\-가-힣]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAllProjectPosts(): Promise<ProjectPost[]> {
	const posts: ProjectPost[] = await client.fetch(
		`*[_type == "projectPost"] | order(pubDate desc) {
      _id,
      "projectSlug": coalesce(project->slug.current, project->name, projectSlug),
      "projectName": coalesce(project->name, project->slug.current, projectSlug),
      postSlug, title, description, metaDescription,
      pubDate, updatedDate, heroImage
    }`,
	);
	return posts.map((p) => ({ ...p, projectSlug: sanitizeSlug(p.projectSlug) }));
}

export async function getProjectPost(
	projectSlug: string,
	postSlug: string,
): Promise<ProjectPost | null> {
	// Fetch by postSlug and filter client-side using sanitized comparison,
	// since the raw Sanity slug may contain URL-invalid characters (e.g. "?").
	const posts: ProjectPost[] = await client.fetch(
		`*[_type == "projectPost" && postSlug.current == $postSlug] {
      _id,
      "projectSlug": coalesce(project->slug.current, project->name, projectSlug),
      "projectName": coalesce(project->name, project->slug.current, projectSlug),
      postSlug, title, description, metaDescription,
      pubDate, updatedDate, heroImage, body
    }`,
		{ postSlug },
	);
	const match = posts.find((p) => sanitizeSlug(p.projectSlug) === projectSlug);
	if (!match) return null;
	return { ...match, projectSlug: sanitizeSlug(match.projectSlug) };
}

export async function getAllThoughts(): Promise<Thought[]> {
	return client.fetch(
		`*[_type == "thought"] | order(pubDate desc) {
      _id, title, description, metaDescription, pubDate, updatedDate, slug
    }`,
	);
}

export async function getThought(slug: string): Promise<Thought | null> {
	return client.fetch(
		`*[_type == "thought" && slug.current == $slug][0] {
      _id, title, description, metaDescription, pubDate, updatedDate, slug, body
    }`,
		{ slug },
	);
}
