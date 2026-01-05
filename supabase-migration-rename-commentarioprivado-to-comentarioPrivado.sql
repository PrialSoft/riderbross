-- ============================================
-- RiderBross - Migración:
-- Renombrar commentarioprivado a comentarioPrivado
-- (camelCase con comillas dobles para preservar el case)
-- ============================================

-- Renombrar en tabla clientes
ALTER TABLE public.clientes
  RENAME COLUMN commentarioprivado TO "comentarioPrivado";

-- Renombrar en tabla vehiculo
ALTER TABLE public.vehiculo
  RENAME COLUMN commentarioprivado TO "comentarioPrivado";

