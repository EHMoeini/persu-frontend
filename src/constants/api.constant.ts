/**
 * API configuration. Values come from env files at the project root
 * (see `.env.example`). Only `NEXT_PUBLIC_*` variables are readable in the
 * browser, and they are inlined at build time.
 */

/**
 * Backend base URL. Empty string means same-origin (relative) requests.
 * The browser and the server both read this value; the endpoints carry only
 * the path.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
