import type { Game } from './types';
import { GAMES_BASE } from './config';

const BASE = GAMES_BASE.replace(/\/+$/, '');

/** Prefix a catalog-relative path (e.g. /books/...) with the configured games host. */
export function asset(path: string): string {
	if (!path) return path;
	if (/^https?:\/\//i.test(path)) return path; // already absolute, leave as-is
	return BASE + (path.startsWith('/') ? path : `/${path}`);
}

/** Catalog JSON location (on the configured games host). */
export const CATALOG_URL = asset('/books/books.json');

interface RawGame {
	id?: number;
	name?: string;
	cover?: string;
	thumb?: string;
	url?: string;
	special?: string[];
	author?: string;
	authorLink?: string;
}

/**
 * Normalize the raw books.json into Game records.
 * NOTE: `id` is the array index (not the json's own `id`) to stay compatible
 * with existing localStorage favorites/history written by the old page.
 */
export function normalize(raw: RawGame[]): Game[] {
	let list = raw;
	if (list.length > 0 && list[0]?.name?.includes('SUGGEST')) {
		list = list.slice(1);
	}

	return list
		.filter((z): z is RawGame & { name: string; url: string } => Boolean(z?.name && z?.url))
		.map((z, idx) => ({
			id: idx,
			name: z.name,
			cover: asset(z.cover ?? ''),
			thumb: asset(z.thumb || z.cover || ''),
			url: asset(z.url),
			tags: z.special ?? [],
			author: z.author,
			authorLink: z.authorLink
		}));
}

export async function loadCatalog(fetchFn: typeof fetch = fetch): Promise<Game[]> {
	const res = await fetchFn(CATALOG_URL);
	if (!res.ok) throw new Error(`Failed to load catalog (${res.status})`);
	return normalize(await res.json());
}

/** Unique, sorted tag list across all games. */
export function collectTags(games: Game[]): string[] {
	return [...new Set(games.flatMap((g) => g.tags))].sort((a, b) => a.localeCompare(b));
}
