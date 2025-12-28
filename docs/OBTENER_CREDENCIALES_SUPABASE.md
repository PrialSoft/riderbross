# Cómo Obtener las Credenciales de Supabase para .env.local

Esta guía te muestra paso a paso cómo obtener las credenciales necesarias para configurar tu archivo `.env.local`.

## 📍 Paso 1: Acceder al Dashboard de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **RiderBross** (o el nombre que le hayas dado)

## 🔑 Paso 2: Obtener las Credenciales

1. En el menú lateral izquierdo, haz clic en **Settings** (Configuración)
   - Es el ícono de engranaje ⚙️ que está al final del menú

2. Dentro de Settings, haz clic en **API** (debería estar en la parte superior del submenú)

3. En la página de API verás varias secciones. Necesitas estas dos:

### a) Project URL
- Está en la sección **Project URL**
- Es una URL que se ve así: `https://xxxxxxxxxxxxx.supabase.co`
- **Copia esta URL completa**

### b) anon public key
- Está en la sección **Project API keys**
- Busca la clave que dice **`anon` `public`**
- Es una cadena larga que comienza con `eyJ...`
- Haz clic en el ícono de **copiar** (📋) al lado de esta clave para copiarla

## 📝 Paso 3: Crear o Actualizar .env.local

1. En la raíz de tu proyecto (donde está `package.json`), crea o edita el archivo `.env.local`

2. Agrega las siguientes líneas (reemplaza con tus valores reales):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxNzY5MzIwLCJleHAiOjE5NTczNDUzMjB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Ejemplo real:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTMyMCwiZXhwIjoxOTU3MzQ1MzIwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## ⚠️ Importante

1. **Nunca subas `.env.local` a Git**: Este archivo ya está en `.gitignore` para proteger tus credenciales

2. **Reinicia el servidor**: Después de crear o modificar `.env.local`, debes:
   - Detener el servidor de desarrollo (Ctrl+C)
   - Volver a iniciarlo con `npm run dev`

3. **Variables públicas**: Estas variables comienzan con `NEXT_PUBLIC_` porque Next.js las expone al cliente. Esto es seguro porque la clave `anon` está diseñada para ser pública y las políticas RLS protegen tus datos.

## 🔍 Verificar que Funciona

Después de configurar `.env.local` y reiniciar el servidor:

1. Ve a `http://localhost:3000/admin/login`
2. Intenta iniciar sesión
3. Si ves errores en la consola del navegador relacionados con Supabase, verifica:
   - Que las credenciales estén correctas
   - Que no haya espacios extra al inicio o final de los valores
   - Que el servidor se haya reiniciado después de crear el archivo

## 📸 Ubicación Visual en Supabase

```
Dashboard de Supabase
├── Menú Lateral
│   └── Settings ⚙️ (al final)
│       └── API
│           ├── Project URL ← Copia esto
│           └── Project API keys
│               └── anon public ← Copia esto
```

## 🆘 Problemas Comunes

### "Invalid API key"
- Verifica que copiaste la clave completa (son muy largas)
- Asegúrate de que no haya espacios al inicio o final
- Verifica que el archivo se llame exactamente `.env.local` (con el punto al inicio)

### "Invalid URL"
- Verifica que la URL comience con `https://`
- Asegúrate de que no haya espacios
- Verifica que la URL termine con `.supabase.co`

### Las variables no se cargan
- Reinicia el servidor de desarrollo completamente
- Verifica que el archivo esté en la raíz del proyecto (mismo nivel que `package.json`)
- Asegúrate de que el archivo se llame `.env.local` y no `env.local` o `.env.local.txt`

