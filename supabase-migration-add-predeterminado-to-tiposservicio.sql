-- Agregar campo predeterminado (BOOLEAN) a la tabla tiposservicio
-- Si un tipo de servicio tiene predeterminado = true, se cargará automáticamente al presionar "Servicio General"

ALTER TABLE public.tiposservicio
ADD COLUMN IF NOT EXISTS predeterminado BOOLEAN NOT NULL DEFAULT false;

-- Crear índice para mejorar las consultas de tipos predeterminados
CREATE INDEX IF NOT EXISTS idx_tiposservicio_predeterminado 
  ON public.tiposservicio(predeterminado) 
  WHERE predeterminado = true;

