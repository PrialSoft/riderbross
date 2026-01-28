-- ============================================
-- MIGRACIÓN: Agregar campo 'orden' a CategoriasServicio
-- ============================================
-- Este script agrega el campo 'orden' (INT) a la tabla CategoriasServicio
-- para permitir ordenar las categorías por prioridad.

-- Agregar la columna 'orden' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categoriasservicio' 
        AND column_name = 'orden'
    ) THEN
        ALTER TABLE categoriasservicio 
        ADD COLUMN orden INT DEFAULT 0;
        
        -- Actualizar las categorías existentes con un orden secuencial
        -- basado en su ID
        UPDATE categoriasservicio 
        SET orden = id 
        WHERE orden IS NULL OR orden = 0;
        
        -- Crear índice para mejorar las consultas ordenadas
        CREATE INDEX IF NOT EXISTS idx_categorias_servicio_orden 
        ON categoriasservicio(orden);
    END IF;
END $$;




