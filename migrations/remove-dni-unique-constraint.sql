-- ============================================
-- MIGRACIÓN: Eliminar restricción única del DNI en Clientes
-- ============================================
-- Este script elimina la restricción única del campo DNI en la tabla Clientes
-- para permitir que múltiples clientes puedan tener el mismo DNI.

-- Eliminar la restricción única del DNI
-- PostgreSQL crea automáticamente un índice único cuando se define UNIQUE en la columna
-- El nombre puede variar, así que intentamos eliminar todas las posibles variantes
DO $$ 
DECLARE
    constraint_name TEXT;
    dni_attnum SMALLINT;
BEGIN
    -- Obtener el número de atributo del campo DNI
    SELECT attnum INTO dni_attnum
    FROM pg_attribute
    WHERE attrelid = 'clientes'::regclass
        AND attname = 'dni';
    
    -- Buscar el nombre de la restricción única del DNI
    -- Usando un cast explícito para evitar problemas de tipos
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'clientes'::regclass
        AND contype = 'u'
        AND conkey = ARRAY[dni_attnum]::smallint[];
    
    -- Si se encuentra la restricción, eliminarla
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE clientes DROP CONSTRAINT IF EXISTS %I', constraint_name);
        RAISE NOTICE 'Restricción única eliminada: %', constraint_name;
    ELSE
        RAISE NOTICE 'No se encontró restricción única para el campo DNI';
    END IF;
    
    -- También intentar eliminar por nombres comunes (por si acaso)
    ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_dni_key;
    ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_dni_unique;
    ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_dni_uk;
END $$;

-- Verificar que la restricción única fue eliminada
-- (El índice idx_clientes_dni seguirá existiendo para búsquedas rápidas, pero sin restricción única)

