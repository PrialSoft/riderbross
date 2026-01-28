-- ============================================
-- RIDERBROSS - Esquema Completo de Base de Datos
-- Supabase SQL Schema Consolidado
-- Versión: 1.0
-- Fecha: 2026
-- ============================================
-- Este archivo consolida todos los esquemas y migraciones
-- en un único archivo para facilitar la creación inicial de la base de datos
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
    commentarioprivado TEXT NULL, -- Campo agregado en migración
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
    IdCliente INT, -- Relación con Cliente
    commentarioprivado TEXT NULL, -- Campo agregado en migración
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
    orden INT DEFAULT 0, -- Campo para ordenar las categorías
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_categorias_servicio_nombre ON CategoriasServicio(Nombre);
CREATE INDEX IF NOT EXISTS idx_categorias_servicio_orden ON CategoriasServicio(orden);

-- ============================================
-- TABLA: TiposServicio
-- ============================================
CREATE TABLE IF NOT EXISTS TiposServicio (
    Id SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    IdCategoriaServicio INT,
    Referencia VARCHAR(500),
    predeterminado BOOLEAN NOT NULL DEFAULT false, -- Campo agregado en migración: si es true, se carga automáticamente al presionar "Servicio General"
    resultadotipovalor BOOLEAN DEFAULT FALSE, -- Campo agregado en migración: indica si requiere valor de resultado
    resultadotipoporcentaje BOOLEAN DEFAULT FALSE, -- Campo agregado en migración: indica si requiere porcentaje de resultado
    resultadotipoestado BOOLEAN DEFAULT FALSE, -- Campo agregado en migración: indica si requiere estado de resultado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdCategoriaServicio) REFERENCES CategoriasServicio(Id) ON DELETE CASCADE
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_tipos_servicio_idcategoria ON TiposServicio(IdCategoriaServicio);
CREATE INDEX IF NOT EXISTS idx_tipos_servicio_nombre ON TiposServicio(Nombre);
CREATE INDEX IF NOT EXISTS idx_tiposservicio_predeterminado ON TiposServicio(predeterminado) WHERE predeterminado = true;

-- Comentarios para documentación
COMMENT ON COLUMN TiposServicio.resultadotipovalor IS 'Indica si este tipo de servicio requiere un valor de resultado';
COMMENT ON COLUMN TiposServicio.resultadotipoporcentaje IS 'Indica si este tipo de servicio requiere un porcentaje de resultado';
COMMENT ON COLUMN TiposServicio.resultadotipoestado IS 'Indica si este tipo de servicio requiere un estado de resultado';

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
    IdVehiculo INT NOT NULL,
    IdCliente INT, -- Campo agregado en migración: relación directa con cliente
    fechaServicio DATE NOT NULL DEFAULT CURRENT_DATE,
    kmServicio BIGINT NOT NULL,
    Calificacion SMALLINT CHECK (Calificacion >= 1 AND Calificacion <= 5),
    Comentario VARCHAR(1000),
    tecnico VARCHAR(100), -- Técnico que realizó el servicio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (IdVehiculo) REFERENCES Vehiculo(Id) ON DELETE CASCADE,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(Id) ON DELETE SET NULL
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_servicios_idvehiculo ON Servicios(IdVehiculo);
CREATE INDEX IF NOT EXISTS idx_servicios_idcliente ON Servicios(IdCliente);
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
    resultadovalor VARCHAR(50) DEFAULT NULL, -- Campo agregado en migración: valor del resultado
    resultadoporcentaje VARCHAR(50) DEFAULT NULL, -- Campo agregado en migración: porcentaje del resultado
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

-- Comentarios para documentación
COMMENT ON COLUMN DetallesServicio.resultadovalor IS 'Valor del resultado del servicio (máximo 50 caracteres)';
COMMENT ON COLUMN DetallesServicio.resultadoporcentaje IS 'Porcentaje del resultado del servicio (máximo 50 caracteres)';

-- ============================================
-- TABLA: usuarios_admin
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    nombre TEXT,
    rol TEXT DEFAULT 'admin' CHECK (rol IN ('admin', 'super_admin')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_email ON usuarios_admin(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_activo ON usuarios_admin(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_rol ON usuarios_admin(rol);

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

-- Función helper para verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM usuarios_admin
        WHERE id = user_id
            AND activo = true
            AND rol IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

CREATE TRIGGER update_usuarios_admin_updated_at
    BEFORE UPDATE ON usuarios_admin
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
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
INSERT INTO CategoriasServicio (Nombre, orden) VALUES
    ('Mantenimiento', 1),
    ('Reparación', 2),
    ('Revisión', 3),
    ('Diagnóstico', 4),
    ('Limpieza', 5)
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
ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE LECTURA PÚBLICA
-- ============================================

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

CREATE POLICY "Permitir lectura pública de Vehiculo"
    ON Vehiculo FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de Servicios"
    ON Servicios FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de DetallesServicio"
    ON DetallesServicio FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de Clientes"
    ON Clientes FOR SELECT USING (true);

-- ============================================
-- POLÍTICAS DE ADMINISTRACIÓN (INSERT/UPDATE/DELETE)
-- ============================================

-- Provincias
DROP POLICY IF EXISTS "Permitir escritura admin Provincias" ON Provincias;
DROP POLICY IF EXISTS "Permitir actualización admin Provincias" ON Provincias;
DROP POLICY IF EXISTS "Permitir eliminación admin Provincias" ON Provincias;

CREATE POLICY "Permitir escritura admin Provincias"
    ON Provincias FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Provincias"
    ON Provincias FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Provincias"
    ON Provincias FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Clientes
DROP POLICY IF EXISTS "Permitir escritura admin Clientes" ON Clientes;
DROP POLICY IF EXISTS "Permitir actualización admin Clientes" ON Clientes;
DROP POLICY IF EXISTS "Permitir eliminación admin Clientes" ON Clientes;

CREATE POLICY "Permitir escritura admin Clientes"
    ON Clientes FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Clientes"
    ON Clientes FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Clientes"
    ON Clientes FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Marcas
DROP POLICY IF EXISTS "Permitir escritura admin Marcas" ON Marcas;
DROP POLICY IF EXISTS "Permitir actualización admin Marcas" ON Marcas;
DROP POLICY IF EXISTS "Permitir eliminación admin Marcas" ON Marcas;

CREATE POLICY "Permitir escritura admin Marcas"
    ON Marcas FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Marcas"
    ON Marcas FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Marcas"
    ON Marcas FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Vehiculo
DROP POLICY IF EXISTS "Permitir escritura admin Vehiculo" ON Vehiculo;
DROP POLICY IF EXISTS "Permitir actualización admin Vehiculo" ON Vehiculo;
DROP POLICY IF EXISTS "Permitir eliminación admin Vehiculo" ON Vehiculo;

CREATE POLICY "Permitir escritura admin Vehiculo"
    ON Vehiculo FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Vehiculo"
    ON Vehiculo FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Vehiculo"
    ON Vehiculo FOR DELETE
    USING (public.is_admin(auth.uid()));

-- CategoriasServicio
DROP POLICY IF EXISTS "Permitir escritura admin CategoriasServicio" ON CategoriasServicio;
DROP POLICY IF EXISTS "Permitir actualización admin CategoriasServicio" ON CategoriasServicio;
DROP POLICY IF EXISTS "Permitir eliminación admin CategoriasServicio" ON CategoriasServicio;

CREATE POLICY "Permitir escritura admin CategoriasServicio"
    ON CategoriasServicio FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin CategoriasServicio"
    ON CategoriasServicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin CategoriasServicio"
    ON CategoriasServicio FOR DELETE
    USING (public.is_admin(auth.uid()));

-- TiposServicio
DROP POLICY IF EXISTS "Permitir escritura admin TiposServicio" ON TiposServicio;
DROP POLICY IF EXISTS "Permitir actualización admin TiposServicio" ON TiposServicio;
DROP POLICY IF EXISTS "Permitir eliminación admin TiposServicio" ON TiposServicio;

CREATE POLICY "Permitir escritura admin TiposServicio"
    ON TiposServicio FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin TiposServicio"
    ON TiposServicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin TiposServicio"
    ON TiposServicio FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Estados
DROP POLICY IF EXISTS "Permitir escritura admin Estados" ON Estados;
DROP POLICY IF EXISTS "Permitir actualización admin Estados" ON Estados;
DROP POLICY IF EXISTS "Permitir eliminación admin Estados" ON Estados;

CREATE POLICY "Permitir escritura admin Estados"
    ON Estados FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Estados"
    ON Estados FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Estados"
    ON Estados FOR DELETE
    USING (public.is_admin(auth.uid()));

-- Servicios
DROP POLICY IF EXISTS "Permitir escritura admin Servicios" ON Servicios;
DROP POLICY IF EXISTS "Permitir actualización admin Servicios" ON Servicios;
DROP POLICY IF EXISTS "Permitir eliminación admin Servicios" ON Servicios;

CREATE POLICY "Permitir escritura admin Servicios"
    ON Servicios FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin Servicios"
    ON Servicios FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin Servicios"
    ON Servicios FOR DELETE
    USING (public.is_admin(auth.uid()));

-- DetallesServicio
DROP POLICY IF EXISTS "Permitir escritura admin DetallesServicio" ON DetallesServicio;
DROP POLICY IF EXISTS "Permitir actualización admin DetallesServicio" ON DetallesServicio;
DROP POLICY IF EXISTS "Permitir eliminación admin DetallesServicio" ON DetallesServicio;

CREATE POLICY "Permitir escritura admin DetallesServicio"
    ON DetallesServicio FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin DetallesServicio"
    ON DetallesServicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin DetallesServicio"
    ON DetallesServicio FOR DELETE
    USING (public.is_admin(auth.uid()));

-- usuarios_admin
DROP POLICY IF EXISTS "Super admins pueden ver usuarios admin" ON usuarios_admin;
DROP POLICY IF EXISTS "Super admins pueden insertar usuarios admin" ON usuarios_admin;
DROP POLICY IF EXISTS "Super admins pueden actualizar usuarios admin" ON usuarios_admin;

-- Solo los super_admins pueden ver todos los usuarios admin
CREATE POLICY "Super admins pueden ver usuarios admin"
    ON usuarios_admin FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    );

-- Solo los super_admins pueden insertar usuarios admin
CREATE POLICY "Super admins pueden insertar usuarios admin"
    ON usuarios_admin FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    );

-- Solo los super_admins pueden actualizar usuarios admin
CREATE POLICY "Super admins pueden actualizar usuarios admin"
    ON usuarios_admin FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    );

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Para crear el primer usuario administrador:
--    a) Crea un usuario en Supabase Auth (Dashboard > Authentication > Users)
--    b) Ejecuta este SQL para agregarlo a usuarios_admin:
--       INSERT INTO usuarios_admin (id, email, nombre, rol, activo)
--       VALUES ('UUID_DEL_USUARIO', 'email@ejemplo.com', 'Nombre Admin', 'super_admin', true);
--
-- 2. Las políticas RLS permiten:
--    - Lectura pública: Cualquiera puede leer tablas de referencia y consultar por patente
--    - Escritura/Actualización/Eliminación: Solo usuarios con rol 'admin' o 'super_admin' activos
--
-- 3. Para desactivar un admin sin eliminarlo:
--    UPDATE usuarios_admin SET activo = false WHERE id = 'UUID_DEL_USUARIO';
--
-- 4. Para cambiar el rol de un usuario:
--    UPDATE usuarios_admin SET rol = 'super_admin' WHERE id = 'UUID_DEL_USUARIO';
--
-- 5. Campos agregados en migraciones:
--    - CategoriasServicio.orden: Para ordenar las categorías
--    - TiposServicio.predeterminado: Si es true, se carga automáticamente al presionar "Servicio General"
--    - TiposServicio.resultadotipovalor, resultadotipoporcentaje, resultadotipoestado: Indican qué tipo de resultado requiere
--    - DetallesServicio.resultadovalor, resultadoporcentaje: Almacenan los valores de resultado
--    - Servicios.IdCliente: Relación directa con cliente
--    - Clientes.commentarioprivado: Comentarios privados del cliente
--    - Vehiculo.commentarioprivado: Comentarios privados del vehículo
-- ============================================

