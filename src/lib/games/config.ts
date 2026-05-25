/**
 * Base URL where the game files + books.json are hosted.
 *
 *  - ''                          -> same origin (served from this site's own /books).
 *  - 'https://games.example.com' -> games live on your VPS (cross-origin).
 *
 * Change this to your VPS URL to serve the 9GB of games off the VPS instead of
 * bundling them in the codebase. No trailing slash needed.
 *
 * NOTE: this value is baked in at build time, so rebuild/redeploy after changing it.
 * If you prefer per-environment config, swap this for `$env/static/public`
 * (e.g. PUBLIC_GAMES_BASE) and set it in your build env.
 */
export const GAMES_BASE = '';
