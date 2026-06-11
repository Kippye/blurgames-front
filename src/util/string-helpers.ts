/**
 * Get a string with only The First Letter Of Each Word In Uppercase.
 * @param {string} str - The original string.
 * @return {string} The string in titlecase.
 */
export function toTitleCase(str: string): string {
  if (str === null || str.length === 0) {
    return str;
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get a string with each word in camelCase.
 * @param {string} str - The original string.
 * @return {string} The string in camelCase.
 */
export function toCamelCase(str: string): string {
  if (str === null || str.length === 0) {
    return str;
  }

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

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
