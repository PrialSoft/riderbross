/**
 * Utilidades para formatear y limpiar patentes
 */

/**
 * Formatea una patente aplicando la máscara visual
 * - Si contiene 7 caracteres -> #-###-### (ej: A-123-BCD)
 * - Si contiene 6 caracteres -> ###-### (ej: ABC-123)
 * @param value - Patente sin formatear (puede contener guiones o caracteres especiales)
 * @returns Patente formateada con máscara
 */
export function formatPatente(value: string): string {
  const raw = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Regla:
  // - si contiene 7 caracteres -> #-###-### (1-3-3)
  // - si contiene 6 caracteres -> ###-### (3-3)
  if (raw.length === 7) {
    return `${raw.slice(0, 1)}-${raw.slice(1, 4)}-${raw.slice(4, 7)}`;
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

