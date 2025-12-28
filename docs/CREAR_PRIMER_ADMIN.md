# Crear el Primer Usuario Administrador

Sigue estos pasos para crear tu primer usuario administrador en Supabase.

## Paso 1: Crear Usuario en Supabase Auth

1. Ve al Dashboard de Supabase
2. Navega a **Authentication** > **Users** en el menú lateral
3. Haz clic en **Add User** > **Create New User**
4. Completa el formulario:
   - **Email**: `admin@riderbross.com` (o el email que prefieras)
   - **Password**: Crea una contraseña segura
   - **Auto Confirm User**: ✅ **Activa esta opción** (importante para poder iniciar sesión inmediatamente)
5. Haz clic en **Create User**
6. **IMPORTANTE**: Copia el **User UID** que aparece (es un UUID largo, lo necesitarás en el siguiente paso)

## Paso 2: Agregar Usuario a la Tabla de Administradores

1. Ve al **SQL Editor** en Supabase
2. Crea una nueva query
3. Ejecuta este SQL (reemplaza los valores con los de tu usuario):

```sql
INSERT INTO usuarios_admin (id, email, nombre, rol, activo)
VALUES (
  'TU_USER_UID_AQUI',           -- Reemplaza con el UUID que copiaste
  'admin@riderbross.com',        -- El email del administrador
  'Administrador Principal',      -- Nombre del administrador
  'super_admin',                  -- Rol: 'super_admin' para acceso completo
  true                            -- Activo
);
```

4. Haz clic en **Run**
5. Verifica que el registro se haya creado correctamente ejecutando:

```sql
SELECT * FROM usuarios_admin WHERE email = 'admin@riderbross.com';
```

Deberías ver tu usuario con `rol = 'super_admin'` y `activo = true`.

## Paso 3: Verificar que Funciona

1. Ve a `http://localhost:3000/admin/login` (o tu URL de desarrollo)
2. Inicia sesión con:
   - **Email**: El email que usaste (ej: `admin@riderbross.com`)
   - **Password**: La contraseña que creaste
3. Deberías ser redirigido automáticamente al dashboard

## Solución de Problemas

### Error: "Invalid login credentials"
- Verifica que el email y la contraseña sean correctos
- Asegúrate de que "Auto Confirm User" esté activado al crear el usuario

### Error: "Row Level Security policy violation"
- Verifica que hayas ejecutado `supabase-admin-schema-nuevo.sql`
- Verifica que el usuario esté en la tabla `usuarios_admin` con `activo = true`
- Ejecuta esta query para verificar:

```sql
SELECT * FROM usuarios_admin WHERE id = 'TU_USER_UID';
```

### No puedo iniciar sesión
- Verifica que el usuario esté confirmado en Supabase (Authentication > Users)
- Asegúrate de que `Auto Confirm User` esté activado
- Verifica que el email y la contraseña sean correctos

