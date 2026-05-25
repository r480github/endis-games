import type { PageLoad } from './$types';
import { loadCatalog } from '$lib/games/catalog';

// The grid is a client-side interactive app (localStorage favorites, infinite
// scroll), and the catalog is large — no value in server-rendering it.
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	const games = await loadCatalog(fetch);
	return { games };
};
