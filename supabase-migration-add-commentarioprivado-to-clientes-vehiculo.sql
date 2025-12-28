-- ============================================
-- RiderBross - Migración:
-- Agregar commentarioprivado a clientes y vehiculo
-- (columnas en minúscula)
-- ============================================

ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS commentarioprivado TEXT NULL;

ALTER TABLE public.vehiculo
  ADD COLUMN IF NOT EXISTS commentarioprivado TEXT NULL;


