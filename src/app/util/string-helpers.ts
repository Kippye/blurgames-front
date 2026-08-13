/**
 * Convert a string in PascalCase or camelCase into a string of words, separated by spaces.
 * @param {string} str - The original string.
 * @return {string} The string with words separated.
 */
export function toSeparateWords(str: string): string {
  if (str === null || str.length === 0) {
    return str;
  }

  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}
