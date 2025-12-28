-- ============================================
-- RIDERBROSS - Esquema de Administración Actualizado
-- Supabase SQL Schema - Políticas RLS para Administradores
-- ============================================

-- ============================================
-- 1. CREAR TABLA DE USUARIOS ADMINISTRADORES
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
-- 2. FUNCIÓN HELPER PARA VERIFICAR SI ES ADMIN
-- ============================================
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

-- ============================================
-- 3. POLÍTICAS RLS PARA PROVINCIAS
-- ============================================
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

-- ============================================
-- 4. POLÍTICAS RLS PARA CLIENTES
-- ============================================
DROP POLICY IF EXISTS "Permitir lectura pública de Clientes" ON Clientes;
DROP POLICY IF EXISTS "Permitir escritura admin Clientes" ON Clientes;
DROP POLICY IF EXISTS "Permitir actualización admin Clientes" ON Clientes;
DROP POLICY IF EXISTS "Permitir eliminación admin Clientes" ON Clientes;

-- Política: Lectura pública limitada (solo para consulta por patente/vehículo)
CREATE POLICY "Permitir lectura pública de Clientes"
    ON Clientes FOR SELECT USING (true);

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

-- ============================================
-- 5. POLÍTICAS RLS PARA MARCAS
-- ============================================
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

-- ============================================
-- 6. POLÍTICAS RLS PARA VEHICULO
-- ============================================
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

-- ============================================
-- 7. POLÍTICAS RLS PARA CATEGORIAS SERVICIO
-- ============================================
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

-- ============================================
-- 8. POLÍTICAS RLS PARA TIPOS SERVICIO
-- ============================================
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

-- ============================================
-- 9. POLÍTICAS RLS PARA ESTADOS
-- ============================================
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

-- ============================================
-- 10. POLÍTICAS RLS PARA SERVICIOS
-- ============================================
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

-- ============================================
-- 11. POLÍTICAS RLS PARA DETALLES SERVICIO
-- ============================================
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

-- ============================================
-- 12. POLÍTICAS RLS PARA USUARIOS_ADMIN
-- ============================================
ALTER TABLE usuarios_admin ENABLE ROW LEVEL SECURITY;

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
-- 13. TRIGGER PARA ACTUALIZAR updated_at EN USUARIOS_ADMIN
-- ============================================
CREATE TRIGGER update_usuarios_admin_updated_at
    BEFORE UPDATE ON usuarios_admin
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NOTAS IMPORTANTES:
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

