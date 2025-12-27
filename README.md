# RiderBross - Sistema de Gestión de Servicio Técnico

Aplicación web para RiderBross, un taller especializado en servicio técnico de motocicletas.

## 🚀 Características

- **Landing Page Responsive**: Diseño mobile-first con Hero, Servicios y Buscador de Patente prominente
- **Consulta Pública**: Los clientes pueden consultar el estado de su moto por patente
- **Vista Timeline**: Visualización cronológica de servicios técnicos
- **Diseño Responsive**: 100% funcional en smartphones, tablets y desktops
- **Material UI**: Componentes modernos y accesibles
- **Supabase**: Base de datos y autenticación

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI Framework**: Material UI (MUI)
- **Base de Datos**: Supabase
- **Estilos**: CSS Modules + globals.css
- **Fechas**: Dayjs
- **Tablas**: @tanstack/react-table (DataTable custom)
- **Reportes**: jsPDF + html2canvas (PDFs), exceljs + file-saver (Excel)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🔧 Instalación

1. Clona el repositorio o navega al directorio del proyecto:
```bash
cd riderbross
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto con:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
riderbross/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── globals.css         # Estilos globales y variables CSS
│   │   ├── layout.tsx          # Layout principal con Navbar
│   │   ├── page.tsx            # Landing page
│   │   └── consulta/           # Rutas de consulta pública
│   │       ├── page.tsx        # Página de búsqueda
│   │       └── [patente]/      # Vista detallada por patente
│   │           └── page.tsx
│   ├── components/              # Componentes React
│   │   └── Navbar/             # Navbar responsive
│   ├── lib/                    # Utilidades y configuraciones
│   │   ├── supabase/           # Cliente de Supabase
│   │   ├── mui/                # Tema de Material UI
│   │   └── dayjs.ts            # Configuración de Dayjs
│   ├── types/                  # Tipos TypeScript
│   │   └── ficha.ts            # Tipos de fichas técnicas
│   └── utils/                  # Utilidades
│       └── ui/                 # Componentes UI reutilizables
│           └── table/          # DataTable custom
└── public/                     # Archivos estáticos
```

## 🗄️ Esquema de Base de Datos

### Tabla: `motocicletas`
- `id` (uuid, primary key)
- `patente` (text, unique)
- `marca` (text)
- `modelo` (text)
- `km_actual` (integer)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabla: `fichas_tecnicas`
- `id` (uuid, primary key)
- `motocicleta_id` (uuid, foreign key → motocicletas.id)
- `fecha_servicio` (date)
- `km_servicio` (integer)
- `checklist` (jsonb)
- `bateria` (jsonb)
- `iluminacion` (jsonb)
- `transmision` (jsonb)
- `ruedas` (jsonb)
- `frenos` (jsonb)
- `observaciones` (text, nullable)
- `valvulas` (jsonb, nullable)
- `tecnico` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🎨 Variables CSS Personalizadas

El proyecto utiliza variables CSS en `globals.css` para mantener consistencia:

- **Colores de Marca**: `--primary`, `--secondary`, `--accent`
- **Breakpoints**: `--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`
- **Espaciado**: `--spacing-xs` a `--spacing-3xl`
- **Tipografía**: `--font-family-primary`, `--font-size-*`

## 📱 Diseño Responsive

El proyecto sigue un enfoque **Mobile-First**:
- **Mobile** (< 600px): Navegación hamburguesa, layouts verticales
- **Tablet** (600px - 900px): Layouts adaptativos
- **Desktop** (> 900px): Layouts completos con navegación horizontal

## 🚧 Próximas Funcionalidades

- [ ] Panel de administración protegido
- [ ] Formulario de carga de datos optimizado para taller
- [ ] Generación de PDFs (formato idéntico al informe de RiderBross)
- [ ] Exportación a Excel
- [ ] Autenticación con Supabase Auth

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## 🤝 Contribución

Este es un proyecto privado para RiderBross. Para cambios o mejoras, contacta al equipo de desarrollo.

## 📄 Licencia

Privado - RiderBross © 2025
