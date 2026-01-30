/**
 * Generates a URL-friendly slug from the given text.
 * Converts to lowercase, replaces non-alphanumeric characters with hyphens,
 * removes leading/trailing hyphens, and collapses multiple consecutive hyphens.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
