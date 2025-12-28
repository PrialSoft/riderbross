-- ============================================
-- RIDERBROSS - Esquema de Base de Datos Actualizado
-- Supabase SQL Schema
-- ============================================

-- ============================================
-- TABLA: Provincias
-- ============================================
CREATE TABLE IF NOT EXISTS Provincias (
    Id SERIAL PRIMARY KEY,
    Descripcion VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_provincias_descripcion ON Provincias(Descripcion);

-- ============================================
-- TABLA: Clientes
-- ============================================
CREATE TABLE IF NOT EXISTS Clientes (
    Id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    telefono NUMERIC,
    email VARCHAR(50) NOT NULL UNIQUE,
    IdProvincia INT,
    localidad VARCHAR(100),
    direccion VARCHAR(100),
    fechaNacimiento DATE,
    DNI NUMERIC(15) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdProvincia) REFERENCES Provincias(Id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_clientes_email ON Clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON Clientes(DNI);
CREATE INDEX IF NOT EXISTS idx_clientes_idprovincia ON Clientes(IdProvincia);
CREATE INDEX IF NOT EXISTS idx_clientes_nombres_apellidos ON Clientes(nombres, apellidos);

-- ============================================
-- TABLA: Marcas
-- ============================================
CREATE TABLE IF NOT EXISTS Marcas (
    Id SERIAL PRIMARY KEY,
    Descripcion VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_marcas_descripcion ON Marcas(Descripcion);

-- ============================================
-- TABLA: Vehiculo
-- ============================================
CREATE TABLE IF NOT EXISTS Vehiculo (
    Id SERIAL PRIMARY KEY,
    patente VARCHAR(20) NOT NULL UNIQUE,
    IdMarca INT,
    Modelo VARCHAR(50),
    anio DATE,
    kmActual BIGINT DEFAULT 0,
    fotos BYTEA,
    IdCliente INT, -- Relación con Cliente (agregada para vincular vehículo a cliente)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdMarca) REFERENCES Marcas(Id) ON DELETE SET NULL,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(Id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_vehiculo_patente ON Vehiculo(patente);
CREATE INDEX IF NOT EXISTS idx_vehiculo_idmarca ON Vehiculo(IdMarca);
CREATE INDEX IF NOT EXISTS idx_vehiculo_idcliente ON Vehiculo(IdCliente);

-- ============================================
-- TABLA: CategoriasServicio
-- ============================================
CREATE TABLE IF NOT EXISTS CategoriasServicio (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_categorias_servicio_nombre ON CategoriasServicio(Nombre);

-- ============================================
-- TABLA: TiposServicio
-- ============================================
CREATE TABLE IF NOT EXISTS TiposServicio (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    IdCategoriaServicio INT,
    Referencia VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdCategoriaServicio) REFERENCES CategoriasServicio(Id) ON DELETE CASCADE
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_tipos_servicio_idcategoria ON TiposServicio(IdCategoriaServicio);
CREATE INDEX IF NOT EXISTS idx_tipos_servicio_nombre ON TiposServicio(Nombre);

-- ============================================
-- TABLA: Estados
-- ============================================
CREATE TABLE IF NOT EXISTS Estados (
    Id SERIAL PRIMARY KEY,
    Descripcion VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_estados_descripcion ON Estados(Descripcion);

-- ============================================
-- TABLA: Servicios
-- ============================================
CREATE TABLE IF NOT EXISTS Servicios (
    Id SERIAL PRIMARY KEY,
    IdVehiculo INT NOT NULL, -- Relación con Vehiculo (agregada para vincular servicio a vehículo)
    fechaServicio DATE NOT NULL DEFAULT CURRENT_DATE,
    kmServicio BIGINT NOT NULL,
    Calificacion SMALLINT CHECK (Calificacion >= 1 AND Calificacion <= 5),
    Comentario VARCHAR(1000),
    tecnico VARCHAR(100), -- Técnico que realizó el servicio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdVehiculo) REFERENCES Vehiculo(Id) ON DELETE CASCADE
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_servicios_idvehiculo ON Servicios(IdVehiculo);
CREATE INDEX IF NOT EXISTS idx_servicios_fechaservicio ON Servicios(fechaServicio DESC);
CREATE INDEX IF NOT EXISTS idx_servicios_kmservicio ON Servicios(kmServicio);

-- ============================================
-- TABLA: DetallesServicio
-- ============================================
CREATE TABLE IF NOT EXISTS DetallesServicio (
    Id SERIAL PRIMARY KEY,
    IdServicio INT NOT NULL,
    IdTipoServicio INT,
    ProximoEnKm BIGINT,
    Comentario VARCHAR(1000),
    IdEstado INT,
    Recomendacion VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdServicio) REFERENCES Servicios(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdTipoServicio) REFERENCES TiposServicio(Id) ON DELETE SET NULL,
    FOREIGN KEY (IdEstado) REFERENCES Estados(Id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idservicio ON DetallesServicio(IdServicio);
CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idtiposervicio ON DetallesServicio(IdTipoServicio);
CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idestado ON DetallesServicio(IdEstado);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at en todas las tablas
CREATE TRIGGER update_provincias_updated_at
    BEFORE UPDATE ON Provincias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON Clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marcas_updated_at
    BEFORE UPDATE ON Marcas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehiculo_updated_at
    BEFORE UPDATE ON Vehiculo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_servicio_updated_at
    BEFORE UPDATE ON CategoriasServicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipos_servicio_updated_at
    BEFORE UPDATE ON TiposServicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estados_updated_at
    BEFORE UPDATE ON Estados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servicios_updated_at
    BEFORE UPDATE ON Servicios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detalles_servicio_updated_at
    BEFORE UPDATE ON DetallesServicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES (OPCIONAL)
-- ============================================

-- Insertar provincias argentinas comunes
INSERT INTO Provincias (Descripcion) VALUES
    ('Buenos Aires'),
    ('Córdoba'),
    ('Santa Fe'),
    ('Mendoza'),
    ('Tucumán'),
    ('Salta'),
    ('Entre Ríos'),
    ('Misiones'),
    ('Corrientes'),
    ('Chaco'),
    ('Santiago del Estero'),
    ('San Juan'),
    ('Jujuy'),
    ('Río Negro'),
    ('Formosa'),
    ('Neuquén'),
    ('Catamarca'),
    ('La Rioja'),
    ('La Pampa'),
    ('San Luis'),
    ('Santa Cruz'),
    ('Tierra del Fuego'),
    ('Chubut')
ON CONFLICT (Descripcion) DO NOTHING;

-- Insertar estados comunes para servicios
INSERT INTO Estados (Descripcion) VALUES
    ('Pendiente'),
    ('En Proceso'),
    ('Completado'),
    ('Cancelado'),
    ('Requiere Atención'),
    ('Aprobado'),
    ('Rechazado')
ON CONFLICT DO NOTHING;

-- Insertar categorías de servicio comunes
INSERT INTO CategoriasServicio (Nombre) VALUES
    ('Mantenimiento'),
    ('Reparación'),
    ('Revisión'),
    ('Diagnóstico'),
    ('Limpieza')
ON CONFLICT (Nombre) DO NOTHING;

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE Provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE Clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE Marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE Vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE CategoriasServicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE TiposServicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE Estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE Servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE DetallesServicio ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (para consulta por patente)
CREATE POLICY "Permitir lectura pública de Provincias"
    ON Provincias FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de Marcas"
    ON Marcas FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de Estados"
    ON Estados FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de CategoriasServicio"
    ON CategoriasServicio FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de TiposServicio"
    ON TiposServicio FOR SELECT USING (true);

-- Política: Permitir lectura pública de Vehiculo (solo para consulta por patente)
CREATE POLICY "Permitir lectura pública de Vehiculo"
    ON Vehiculo FOR SELECT USING (true);

-- Política: Permitir lectura pública de Servicios (solo para consulta por patente)
CREATE POLICY "Permitir lectura pública de Servicios"
    ON Servicios FOR SELECT USING (true);

-- Política: Permitir lectura pública de DetallesServicio (solo para consulta por patente)
CREATE POLICY "Permitir lectura pública de DetallesServicio"
    ON DetallesServicio FOR SELECT USING (true);

-- NOTA: Las políticas de INSERT, UPDATE y DELETE para administradores
-- se crearán en el archivo supabase-admin-schema.sql después de crear
-- la tabla usuarios_admin y la función is_admin()

