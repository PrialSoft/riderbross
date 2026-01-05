/**
 * Utilidades para formatear y limpiar patentes
 */

/**
 * Formatea una patente aplicando la máscara visual
 * - Si contiene 7 caracteres -> ##-###-## (ej: 12-345-67)
 * - Si contiene 6 caracteres -> ###-### (ej: ABC-123)
 * @param value - Patente sin formatear (puede contener guiones o caracteres especiales)
 * @returns Patente formateada con máscara
 */
export function formatPatente(value: string): string {
  const raw = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Regla:
  // - si contiene 7 caracteres -> ##-###-##
  // - si contiene 6 caracteres -> ###-###
  if (raw.length === 7) {
    return `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5, 7)}`;
  }

  if (raw.length === 6) {
    return `${raw.slice(0, 3)}-${raw.slice(3, 6)}`;
  }

  return raw;
}

/**
 * Limpia una patente removiendo guiones y caracteres especiales
 * Solo deja letras y números en mayúsculas
 * @param value - Patente con o sin máscara
 * @returns Patente limpia (solo letras y números en mayúsculas)
 */
export function cleanPatente(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

