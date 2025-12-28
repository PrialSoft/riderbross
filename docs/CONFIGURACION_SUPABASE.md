# Configuración de Supabase para RiderBross

Esta guía te ayudará a configurar Supabase y PostgreSQL para el panel de administración de RiderBross.

## 📋 Requisitos Previos

1. Una cuenta en [Supabase](https://supabase.com)
2. Un proyecto creado en Supabase

## 🚀 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Haz clic en "New Project"
3. Completa la información:
   - **Name**: RiderBross (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala en un lugar seguro)
   - **Region**: Elige la región más cercana a tus usuarios
4. Haz clic en "Create new project"
5. Espera a que se complete la configuración (puede tardar unos minutos)

## 🗄️ Paso 2: Configurar la Base de Datos

### 2.1. Ejecutar el Esquema Base

1. En el Dashboard de Supabase, ve a **SQL Editor** (ícono de base de datos en el menú lateral)
2. Haz clic en **New Query**
3. Copia y pega el contenido de `supabase-schema-nuevo.sql` en el editor
4. Haz clic en **Run** (o presiona `Ctrl+Enter`)
5. Verifica que no haya errores
6. Deberías ver que se crearon las siguientes tablas:
   - Provincias
   - Clientes
   - Marcas
   - Vehiculo
   - CategoriasServicio
   - TiposServicio
   - Estados
   - Servicios
   - DetallesServicio

### 2.2. Ejecutar el Esquema de Administración

1. En el mismo SQL Editor, crea una nueva query
2. Copia y pega el contenido de `supabase-admin-schema-nuevo.sql`
3. Haz clic en **Run**
4. Verifica que todas las políticas RLS se hayan creado correctamente
5. Deberías ver que se creó la tabla `usuarios_admin` y todas las políticas de seguridad

## 👤 Paso 3: Crear el Primer Usuario Administrador

### Opción A: Desde el Dashboard de Supabase (Recomendado)

1. Ve a **Authentication** > **Users** en el menú lateral
2. Haz clic en **Add User** > **Create New User**
3. Completa:
   - **Email**: El email del administrador (ej: `admin@riderbross.com`)
   - **Password**: Una contraseña segura
   - **Auto Confirm User**: Activa esta opción para que el usuario pueda iniciar sesión inmediatamente
4. Haz clic en **Create User**
5. **IMPORTANTE**: Copia el **User UID** que aparece (lo necesitarás en el siguiente paso)

### Opción B: Desde el SQL Editor

Si prefieres crear el usuario directamente desde SQL:

```sql
-- Primero, crea el usuario en auth.users (esto normalmente se hace desde el Dashboard)
-- Luego, ejecuta esto para agregarlo a usuarios_admin:
INSERT INTO usuarios_admin (id, email, nombre, rol, activo)
VALUES (
  'UUID_DEL_USUARIO_AQUI',  -- Reemplaza con el UUID del usuario creado
  'admin@riderbross.com',    -- El email del administrador
  'Administrador Principal',  -- Nombre del administrador
  'super_admin',              -- Rol: 'admin' o 'super_admin'
  true                        -- Activo
);
```

### 3.1. Agregar el Usuario a la Tabla de Administradores

1. Ve al **SQL Editor**
2. Ejecuta esta query (reemplaza los valores con los de tu usuario):

```sql
INSERT INTO usuarios_admin (id, email, nombre, rol, activo)
VALUES (
  'TU_USER_UID_AQUI',        -- El UUID que copiaste en el paso anterior
  'admin@riderbross.com',    -- El email del administrador
  'Administrador Principal',  -- Nombre del administrador
  'super_admin',              -- Rol: 'super_admin' para acceso completo
  true                        -- Activo
);
```

3. Haz clic en **Run**
4. Verifica que el registro se haya creado correctamente

## 🔑 Paso 4: Obtener las Credenciales de API

1. En el Dashboard de Supabase, ve a **Settings** > **API**
2. Encontrarás dos valores importantes:
   - **Project URL**: `https://tu-proyecto.supabase.co`
   - **anon public key**: Una clave larga que comienza con `eyJ...`

## 🔐 Paso 5: Configurar Variables de Entorno

1. En la raíz de tu proyecto, crea un archivo `.env.local` (si no existe)
2. Agrega las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

3. Reemplaza los valores con los que obtuviste en el Paso 4
4. **IMPORTANTE**: Nunca subas el archivo `.env.local` a Git (ya está en `.gitignore`)

## ✅ Paso 6: Verificar la Configuración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3000/admin/login`
3. Inicia sesión con las credenciales del administrador que creaste
4. Deberías ser redirigido al dashboard de administración

## 🛠️ Solución de Problemas

### Error: "Invalid API key" o "Invalid credentials"

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo después de cambiar las variables de entorno

### Error: "Row Level Security policy violation"

- Verifica que hayas ejecutado `supabase-admin-schema.sql`
- Asegúrate de que el usuario esté en la tabla `usuarios_admin` con `activo = true`
- Verifica que el rol del usuario sea `'admin'` o `'super_admin'`

### No puedo iniciar sesión

- Verifica que el usuario esté confirmado en Supabase (Authentication > Users)
- Asegúrate de que `Auto Confirm User` esté activado al crear el usuario
- Verifica que el email y la contraseña sean correctos

### El usuario no tiene permisos

- Verifica que el usuario esté en la tabla `usuarios_admin`
- Asegúrate de que `activo = true` y `rol IN ('admin', 'super_admin')`
- Ejecuta esta query para verificar:

```sql
SELECT * FROM usuarios_admin WHERE id = 'TU_USER_UID';
```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security (RLS) en Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Autenticación en Next.js con Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## 🔒 Seguridad

- **Nunca** compartas tus credenciales de API
- **Nunca** subas `.env.local` a Git
- Usa contraseñas seguras para los usuarios administradores
- Considera usar variables de entorno en producción (Vercel, Netlify, etc.)
- Revisa regularmente los usuarios activos en `usuarios_admin`

