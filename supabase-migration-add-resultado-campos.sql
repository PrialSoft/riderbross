-- ============================================
-- Migración: Agregar campos de resultado a TiposServicio y DetallesServicio
-- ============================================

-- Agregar campos booleanos a tiposservicio
ALTER TABLE tiposservicio
ADD COLUMN IF NOT EXISTS resultadotipovalor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resultadotipoporcentaje BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resultadotipoestado BOOLEAN DEFAULT FALSE;

-- Agregar campos de resultado a detallesservicio
ALTER TABLE detallesservicio
ADD COLUMN IF NOT EXISTS resultadovalor VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS resultadoporcentaje VARCHAR(50) DEFAULT NULL;

-- Comentarios para documentación
COMMENT ON COLUMN tiposservicio.resultadotipovalor IS 'Indica si este tipo de servicio requiere un valor de resultado';
COMMENT ON COLUMN tiposservicio.resultadotipoporcentaje IS 'Indica si este tipo de servicio requiere un porcentaje de resultado';
COMMENT ON COLUMN tiposservicio.resultadotipoestado IS 'Indica si este tipo de servicio requiere un estado de resultado';
COMMENT ON COLUMN detallesservicio.resultadovalor IS 'Valor del resultado del servicio (máximo 50 caracteres)';
COMMENT ON COLUMN detallesservicio.resultadoporcentaje IS 'Porcentaje del resultado del servicio (máximo 50 caracteres)';

