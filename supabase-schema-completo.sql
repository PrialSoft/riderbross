-- ============================================
-- RIDERBROSS - Esquema completo (único archivo)
-- Supabase / PostgreSQL
-- Versión: 2.0 (2026)
-- ============================================
-- Incluye el contenido anterior de supabase-schema-completo.sql y las
-- migraciones en /migrations (tipos de servicio, detalle sin resultadovalor).
--
-- Convenciones alineadas con la app Next.js + Supabase:
-- - Tablas y columnas en minúsculas (PostgREST).
-- - Columnas camelCase SOLO entre comillas: "comentarioPrivado" (clientes, vehiculo).
-- - tiposservicio: comentariopordefecto, proximoenkm, resultadotipoestado (sin resultadotipovalor).
-- - detallesservicio: proximoenkm, comentario (sin resultadovalor / resultadoporcentaje).
-- ============================================

-- ============================================
-- TABLA: provincias
-- ============================================
CREATE TABLE IF NOT EXISTS provincias (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provincias_descripcion ON provincias(descripcion);

-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    telefono NUMERIC NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    idprovincia INT,
    localidad VARCHAR(100),
    direccion VARCHAR(100),
    fechanacimiento DATE,
    dni NUMERIC(15) NOT NULL,
    "comentarioPrivado" TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (idprovincia) REFERENCES provincias(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_dni ON clientes(dni);
CREATE INDEX IF NOT EXISTS idx_clientes_idprovincia ON clientes(idprovincia);
CREATE INDEX IF NOT EXISTS idx_clientes_nombres_apellidos ON clientes(nombres, apellidos);

-- ============================================
-- TABLA: marcas
-- ============================================
CREATE TABLE IF NOT EXISTS marcas (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marcas_descripcion ON marcas(descripcion);

-- ============================================
-- TABLA: vehiculo
-- ============================================
CREATE TABLE IF NOT EXISTS vehiculo (
    id SERIAL PRIMARY KEY,
    patente VARCHAR(20) NOT NULL UNIQUE,
    idmarca INT,
    modelo VARCHAR(50),
    anio DATE,
    kmactual BIGINT DEFAULT 0,
    fotos BYTEA,
    idcliente INT,
    "comentarioPrivado" TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (idmarca) REFERENCES marcas(id) ON DELETE SET NULL,
    FOREIGN KEY (idcliente) REFERENCES clientes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_vehiculo_patente ON vehiculo(patente);
CREATE INDEX IF NOT EXISTS idx_vehiculo_idmarca ON vehiculo(idmarca);
CREATE INDEX IF NOT EXISTS idx_vehiculo_idcliente ON vehiculo(idcliente);

-- ============================================
-- TABLA: categoriasservicio
-- ============================================
CREATE TABLE IF NOT EXISTS categoriasservicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    orden INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_servicio_nombre ON categoriasservicio(nombre);
CREATE INDEX IF NOT EXISTS idx_categorias_servicio_orden ON categoriasservicio(orden);

-- ============================================
-- TABLA: tiposservicio
-- ============================================
CREATE TABLE IF NOT EXISTS tiposservicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    idcategoriaservicio INT,
    referencia VARCHAR(500),
    predeterminado BOOLEAN NOT NULL DEFAULT false,
    resultadotipoestado BOOLEAN NOT NULL DEFAULT true,
    comentariopordefecto VARCHAR(100) DEFAULT NULL,
    proximoenkm BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (idcategoriaservicio) REFERENCES categoriasservicio(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tipos_servicio_idcategoria ON tiposservicio(idcategoriaservicio);
CREATE INDEX IF NOT EXISTS idx_tipos_servicio_nombre ON tiposservicio(nombre);
CREATE INDEX IF NOT EXISTS idx_tiposservicio_predeterminado ON tiposservicio(predeterminado) WHERE predeterminado = true;

COMMENT ON COLUMN tiposservicio.resultadotipoestado IS 'Siempre se asigna un estado (Ok, Regular, Malo); la app fuerza true';
COMMENT ON COLUMN tiposservicio.comentariopordefecto IS 'Texto por defecto del cuadro de comentario en el detalle de servicio';
COMMENT ON COLUMN tiposservicio.proximoenkm IS 'Si true, el detalle permite/editar próximo KM para este tipo';

-- ============================================
-- TABLA: estados
-- ============================================
CREATE TABLE IF NOT EXISTS estados (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estados_descripcion ON estados(descripcion);

-- ============================================
-- TABLA: servicios
-- ============================================
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    idvehiculo INT NOT NULL,
    idcliente INT,
    fechaservicio DATE NOT NULL DEFAULT CURRENT_DATE,
    kmservicio BIGINT NOT NULL,
    calificacion SMALLINT CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario VARCHAR(1000),
    tecnico VARCHAR(100),
    fotoservicio BYTEA,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (idvehiculo) REFERENCES vehiculo(id) ON DELETE CASCADE,
    FOREIGN KEY (idcliente) REFERENCES clientes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_servicios_idvehiculo ON servicios(idvehiculo);
CREATE INDEX IF NOT EXISTS idx_servicios_idcliente ON servicios(idcliente);
CREATE INDEX IF NOT EXISTS idx_servicios_fechaservicio ON servicios(fechaservicio DESC);
CREATE INDEX IF NOT EXISTS idx_servicios_kmservicio ON servicios(kmservicio);

-- ============================================
-- TABLA: detallesservicio
-- ============================================
CREATE TABLE IF NOT EXISTS detallesservicio (
    id SERIAL PRIMARY KEY,
    idservicio INT NOT NULL,
    idtiposervicio INT,
    proximoenkm BIGINT,
    comentario VARCHAR(1000),
    idestado INT,
    recomendacion VARCHAR(1000),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (idservicio) REFERENCES servicios(id) ON DELETE CASCADE,
    FOREIGN KEY (idtiposervicio) REFERENCES tiposservicio(id) ON DELETE SET NULL,
    FOREIGN KEY (idestado) REFERENCES estados(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idservicio ON detallesservicio(idservicio);
CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idtiposervicio ON detallesservicio(idtiposervicio);
CREATE INDEX IF NOT EXISTS idx_detalles_servicio_idestado ON detallesservicio(idestado);

-- ============================================
-- TABLA: usuarios_admin
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    nombre TEXT,
    rol TEXT DEFAULT 'admin' CHECK (rol IN ('admin', 'super_admin')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_admin_email ON usuarios_admin(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_activo ON usuarios_admin(activo);
CREATE INDEX IF NOT EXISTS idx_usuarios_admin_rol ON usuarios_admin(rol);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

DROP TRIGGER IF EXISTS update_provincias_updated_at ON provincias;
CREATE TRIGGER update_provincias_updated_at
    BEFORE UPDATE ON provincias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marcas_updated_at ON marcas;
CREATE TRIGGER update_marcas_updated_at
    BEFORE UPDATE ON marcas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vehiculo_updated_at ON vehiculo;
CREATE TRIGGER update_vehiculo_updated_at
    BEFORE UPDATE ON vehiculo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categorias_servicio_updated_at ON categoriasservicio;
CREATE TRIGGER update_categorias_servicio_updated_at
    BEFORE UPDATE ON categoriasservicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tipos_servicio_updated_at ON tiposservicio;
CREATE TRIGGER update_tipos_servicio_updated_at
    BEFORE UPDATE ON tiposservicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_estados_updated_at ON estados;
CREATE TRIGGER update_estados_updated_at
    BEFORE UPDATE ON estados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_servicios_updated_at ON servicios;
CREATE TRIGGER update_servicios_updated_at
    BEFORE UPDATE ON servicios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_detalles_servicio_updated_at ON detallesservicio;
CREATE TRIGGER update_detalles_servicio_updated_at
    BEFORE UPDATE ON detallesservicio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usuarios_admin_updated_at ON usuarios_admin;
CREATE TRIGGER update_usuarios_admin_updated_at
    BEFORE UPDATE ON usuarios_admin
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================
INSERT INTO provincias (descripcion) VALUES
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
ON CONFLICT (descripcion) DO NOTHING;

INSERT INTO estados (descripcion) VALUES
    ('Pendiente'),
    ('En Proceso'),
    ('Completado'),
    ('Cancelado'),
    ('Requiere Atención'),
    ('Aprobado'),
    ('Rechazado')
ON CONFLICT (descripcion) DO NOTHING;

INSERT INTO categoriasservicio (nombre, orden) VALUES
    ('Mantenimiento', 1),
    ('Reparación', 2),
    ('Revisión', 3),
    ('Diagnóstico', 4),
    ('Limpieza', 5)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoriasservicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiposservicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE detallesservicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;

-- Quitar políticas previas (re-ejecución o esquema antiguo con otros nombres)
DROP POLICY IF EXISTS "Permitir lectura pública de provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir lectura pública de Provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir lectura pública de marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir lectura pública de Marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir lectura pública de estados" ON estados;
DROP POLICY IF EXISTS "Permitir lectura pública de Estados" ON estados;
DROP POLICY IF EXISTS "Permitir lectura pública de categoriasservicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de CategoriasServicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de tiposservicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de TiposServicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir lectura pública de Vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir lectura pública de servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir lectura pública de Servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir lectura pública de detallesservicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de DetallesServicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir lectura pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir lectura pública de Clientes" ON clientes;

DROP POLICY IF EXISTS "Permitir escritura admin provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir escritura admin Provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir actualización admin provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir actualización admin Provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir eliminación admin provincias" ON provincias;
DROP POLICY IF EXISTS "Permitir eliminación admin Provincias" ON provincias;

DROP POLICY IF EXISTS "Permitir escritura admin clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir escritura admin Clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir actualización admin clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir actualización admin Clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir eliminación admin clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir eliminación admin Clientes" ON clientes;

DROP POLICY IF EXISTS "Permitir escritura admin marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir escritura admin Marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir actualización admin marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir actualización admin Marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir eliminación admin marcas" ON marcas;
DROP POLICY IF EXISTS "Permitir eliminación admin Marcas" ON marcas;

DROP POLICY IF EXISTS "Permitir escritura admin vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir escritura admin Vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir actualización admin vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir actualización admin Vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir eliminación admin vehiculo" ON vehiculo;
DROP POLICY IF EXISTS "Permitir eliminación admin Vehiculo" ON vehiculo;

DROP POLICY IF EXISTS "Permitir escritura admin categoriasservicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir escritura admin CategoriasServicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir actualización admin categoriasservicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir actualización admin CategoriasServicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin categoriasservicio" ON categoriasservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin CategoriasServicio" ON categoriasservicio;

DROP POLICY IF EXISTS "Permitir escritura admin tiposservicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir escritura admin TiposServicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir actualización admin tiposservicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir actualización admin TiposServicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin tiposservicio" ON tiposservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin TiposServicio" ON tiposservicio;

DROP POLICY IF EXISTS "Permitir escritura admin estados" ON estados;
DROP POLICY IF EXISTS "Permitir escritura admin Estados" ON estados;
DROP POLICY IF EXISTS "Permitir actualización admin estados" ON estados;
DROP POLICY IF EXISTS "Permitir actualización admin Estados" ON estados;
DROP POLICY IF EXISTS "Permitir eliminación admin estados" ON estados;
DROP POLICY IF EXISTS "Permitir eliminación admin Estados" ON estados;

DROP POLICY IF EXISTS "Permitir escritura admin servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir escritura admin Servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir actualización admin servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir actualización admin Servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir eliminación admin servicios" ON servicios;
DROP POLICY IF EXISTS "Permitir eliminación admin Servicios" ON servicios;

DROP POLICY IF EXISTS "Permitir escritura admin detallesservicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir escritura admin DetallesServicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir actualización admin detallesservicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir actualización admin DetallesServicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin detallesservicio" ON detallesservicio;
DROP POLICY IF EXISTS "Permitir eliminación admin DetallesServicio" ON detallesservicio;

-- Lectura pública (consulta por patente / referencia)
CREATE POLICY "Permitir lectura pública de provincias"
    ON provincias FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de marcas"
    ON marcas FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de estados"
    ON estados FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de categoriasservicio"
    ON categoriasservicio FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de tiposservicio"
    ON tiposservicio FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de vehiculo"
    ON vehiculo FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de servicios"
    ON servicios FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de detallesservicio"
    ON detallesservicio FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de clientes"
    ON clientes FOR SELECT USING (true);

-- Escritura administración
CREATE POLICY "Permitir escritura admin provincias"
    ON provincias FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin provincias"
    ON provincias FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin provincias"
    ON provincias FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin clientes"
    ON clientes FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin clientes"
    ON clientes FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin clientes"
    ON clientes FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin marcas"
    ON marcas FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin marcas"
    ON marcas FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin marcas"
    ON marcas FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin vehiculo"
    ON vehiculo FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin vehiculo"
    ON vehiculo FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin vehiculo"
    ON vehiculo FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin categoriasservicio"
    ON categoriasservicio FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin categoriasservicio"
    ON categoriasservicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin categoriasservicio"
    ON categoriasservicio FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin tiposservicio"
    ON tiposservicio FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin tiposservicio"
    ON tiposservicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin tiposservicio"
    ON tiposservicio FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin estados"
    ON estados FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin estados"
    ON estados FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin estados"
    ON estados FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin servicios"
    ON servicios FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin servicios"
    ON servicios FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin servicios"
    ON servicios FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Permitir escritura admin detallesservicio"
    ON detallesservicio FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir actualización admin detallesservicio"
    ON detallesservicio FOR UPDATE
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Permitir eliminación admin detallesservicio"
    ON detallesservicio FOR DELETE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Super admins pueden ver usuarios admin" ON usuarios_admin;
DROP POLICY IF EXISTS "Super admins pueden insertar usuarios admin" ON usuarios_admin;
DROP POLICY IF EXISTS "Super admins pueden actualizar usuarios admin" ON usuarios_admin;

CREATE POLICY "Super admins pueden ver usuarios admin"
    ON usuarios_admin FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    );

CREATE POLICY "Super admins pueden insertar usuarios admin"
    ON usuarios_admin FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios_admin
            WHERE id = auth.uid() AND rol = 'super_admin'
        )
    );

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
-- NOTAS
-- ============================================
-- 1) Primer usuario admin: Auth > Users, luego:
--    INSERT INTO usuarios_admin (id, email, nombre, rol, activo)
--    VALUES ('<uuid>', 'correo@ejemplo.com', 'Nombre', 'super_admin', true);
-- 2) No ejecutar después las migraciones sueltas de /migrations: están fusionadas aquí.
-- 3) Si una base antigua usaba tablas en PascalCase (Clientes, Vehiculo...), hacer
--    un volcado lógico o renombrar manualmente; este script es para creación nueva.
-- ============================================
