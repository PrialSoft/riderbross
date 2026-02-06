-- Migración: Eliminar campos de resultado valor y renombrar campos
-- 1. Eliminar resultadotipovalor de tiposservicio (no se usará más)
-- 2. Renombrar tipovalorpordefecto a comentariopordefecto en tiposservicio
-- 3. Eliminar resultadovalor y resultadoporcentaje de detallesservicio
-- 4. resultadotipoestado siempre será true (ya está configurado)

-- 1. Eliminar la columna resultadotipovalor de tiposservicio
ALTER TABLE tiposservicio
DROP COLUMN IF EXISTS resultadotipovalor;

-- 2. Renombrar tipovalorpordefecto a comentariopordefecto
ALTER TABLE tiposservicio
RENAME COLUMN tipovalorpordefecto TO comentariopordefecto;

-- Actualizar el comentario de la columna
COMMENT ON COLUMN tiposservicio.comentariopordefecto IS 'Comentario por defecto que aparecerá en el cuadro de comentario del detalle de servicio';

-- 3. Eliminar resultadovalor y resultadoporcentaje de detallesservicio
ALTER TABLE detallesservicio
DROP COLUMN IF EXISTS resultadovalor;

ALTER TABLE detallesservicio
DROP COLUMN IF EXISTS resultadoporcentaje;



