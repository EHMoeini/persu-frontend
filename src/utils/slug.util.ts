/**
 * Creates a URL-safe slug from arbitrary text, including non-latin scripts.
 *
 * - zero-width characters collapse to spaces
 * - forbidden characters (spaces, punctuation, symbols) become `replaceWith`
 * - repeated separators collapse to one
 * - leading/trailing separators are trimmed
 */
export function createSlug(raw: string | undefined, replaceWith = '-'): string {
  const esc = replaceWith.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let slug = (raw ?? '').trim() || 'share';
  slug = slug.replace(/[\u200B-\u200D\uFEFF]/g, ' ');
  slug = slug.replace(/[!\/\s():;"'?,\\`@.|#&%$^*]+/g, replaceWith);
  slug = slug.replace(new RegExp(`${esc}{2,}`, 'g'), replaceWith);
  slug = slug.replace(new RegExp(`^${esc}|${esc}$`, 'g'), '');

  return slug;
}
