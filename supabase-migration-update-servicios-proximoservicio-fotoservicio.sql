-- ============================================
-- RiderBross - Migración: servicios
-- - Quitar campo tecnico
-- - Agregar proximoservicio (BIGINT)
-- - Agregar fotoservicio (BYTEA)
-- ============================================

ALTER TABLE public.servicios
  DROP COLUMN IF EXISTS tecnico,
  ADD COLUMN IF NOT EXISTS proximoservicio BIGINT NULL,
  ADD COLUMN IF NOT EXISTS fotoservicio BYTEA NULL;


