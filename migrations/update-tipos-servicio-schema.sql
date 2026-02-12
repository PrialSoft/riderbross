-- ============================================
-- MIGRACIÓN: Actualizar esquema de TiposServicio
-- ============================================
-- Este script:
-- 1. Elimina la columna resultadotipoporcentaje (ya no se utilizará)
-- 2. Agrega la columna tipovalorpordefecto (string libre para valor por defecto)
-- 3. Mantiene resultadotipoestado pero siempre será true (se quita del form)

-- Eliminar la columna resultadotipoporcentaje
ALTER TABLE tiposservicio 
DROP COLUMN IF EXISTS resultadotipoporcentaje;

-- Agregar la columna tipovalorpordefecto
ALTER TABLE tiposservicio 
ADD COLUMN IF NOT EXISTS tipovalorpordefecto VARCHAR(100) DEFAULT NULL;

-- Actualizar resultadotipoestado para que siempre sea true (ya que siempre se asigna un estado)
-- Esto es solo para datos existentes, el form ya no mostrará este check
UPDATE tiposservicio 
SET resultadotipoestado = true 
WHERE resultadotipoestado IS NULL OR resultadotipoestado = false;

-- Comentario para documentación
COMMENT ON COLUMN tiposservicio.tipovalorpordefecto IS 'Valor por defecto que aparece en el campo de resultado valor del detalle de servicio';







