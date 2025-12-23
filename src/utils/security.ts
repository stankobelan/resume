/**
 * Security utilities for sanitizing and validating user input
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns The escaped text safe for insertion into HTML, or empty string if input is null/undefined
 */
export const escapeHtml = (text: string | null | undefined): string => {
  if (text === null || text === undefined) {
    return "";
  }
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};
