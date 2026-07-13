/**
 * Convierte un nombre/apellido a PascalCase por palabra:
 * tras cada espacio, la siguiente letra queda en mayúscula y el resto en minúsculas.
 * Ej: "juan carlos" → "Juan Carlos"
 */
export function toPascalCaseName(text: string): string {
  if (!text) return text;
  return text
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      return word.charAt(0).toLocaleUpperCase('es') + word.slice(1).toLocaleLowerCase('es');
    })
    .join(' ');
}
