-- ============================================
-- RIDERBROSS - Esquema de Base de Datos
-- Supabase SQL Schema
-- ============================================

-- Tabla: motocicletas
CREATE TABLE IF NOT EXISTS motocicletas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patente TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  km_actual INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: fichas_tecnicas
CREATE TABLE IF NOT EXISTS fichas_tecnicas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  motocicleta_id UUID NOT NULL REFERENCES motocicletas(id) ON DELETE CASCADE,
  fecha_servicio DATE NOT NULL,
  km_servicio INTEGER NOT NULL,
  
  -- Checklist de servicios (JSONB)
  checklist JSONB NOT NULL DEFAULT '{
    "aceite": false,
    "valvulas": false,
    "filtros": false,
    "otros": []
  }'::jsonb,
  
  -- Valores de batería (JSONB)
  bateria JSONB NOT NULL DEFAULT '{
    "off": 0,
    "ignicion": 0,
    "ralenti": 0,
    "rpm_5000": 0
  }'::jsonb,
  
  -- Sistema de iluminación (JSONB)
  iluminacion JSONB NOT NULL DEFAULT '{
    "delantera": false,
    "trasera": false,
    "intermitentes": false,
    "stop": false,
    "observaciones": null
  }'::jsonb,
  
  -- Sistema de transmisión (JSONB)
  transmision JSONB NOT NULL DEFAULT '{
    "cadena": false,
    "correa": false,
    "cardan": false,
    "observaciones": null
  }'::jsonb,
  
  -- Sistema de ruedas (JSONB)
  ruedas JSONB NOT NULL DEFAULT '{
    "delantera_psi": 0,
    "trasera_psi": 0,
    "observaciones": null
  }'::jsonb,
  
  -- Sistema de frenos (JSONB)
  frenos JSONB NOT NULL DEFAULT '{
    "delantero": false,
    "trasero": false,
    "observaciones": null
  }'::jsonb,
  
  -- Observaciones generales
  observaciones TEXT,
  
  -- Valores de válvulas (JSONB, opcional)
  valvulas JSONB DEFAULT NULL,
  
  -- Técnico que realizó el servicio
  tecnico TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_motocicleta_id 
  ON fichas_tecnicas(motocicleta_id);

CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_fecha_servicio 
  ON fichas_tecnicas(fecha_servicio DESC);

CREATE INDEX IF NOT EXISTS idx_motocicletas_patente 
  ON motocicletas(patente);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_motocicletas_updated_at
  BEFORE UPDATE ON motocicletas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fichas_tecnicas_updated_at
  BEFORE UPDATE ON fichas_tecnicas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (RLS) - Permitir lectura pública
ALTER TABLE motocicletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas_tecnicas ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública de motocicletas
CREATE POLICY "Permitir lectura pública de motocicletas"
  ON motocicletas
  FOR SELECT
  USING (true);

-- Política: Permitir lectura pública de fichas técnicas
CREATE POLICY "Permitir lectura pública de fichas técnicas"
  ON fichas_tecnicas
  FOR SELECT
  USING (true);

-- NOTA: Para el panel de administración, necesitarás crear políticas adicionales
-- que permitan INSERT, UPDATE y DELETE solo para usuarios autenticados con rol de admin.

