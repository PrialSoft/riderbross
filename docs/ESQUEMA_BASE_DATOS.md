# Esquema de Base de Datos - RiderBross

Este documento describe la estructura completa de la base de datos de RiderBross.

## 📊 Diagrama de Relaciones

```
Provincias (1) ──< (N) Clientes
                          │
                          │ (1)
                          │
                          ▼
Marcas (1) ──< (N) Vehiculo ──< (N) Servicios ──< (N) DetallesServicio
                                                          │
                                                          │ (N)
                                                          │
CategoriasServicio (1) ──< (N) TiposServicio ────────────┘
                                                          │
Estados (1) ──────────────────────────────────────────────┘
```

## 📋 Descripción de Tablas

### 1. Provincias
Almacena las provincias de Argentina.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| Descripcion | VARCHAR(20) | Nombre de la provincia (único) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Datos iniciales**: Se insertan automáticamente las 23 provincias argentinas.

---

### 2. Clientes
Almacena la información de los clientes del taller.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| nombres | VARCHAR(100) | Nombres del cliente |
| apellidos | VARCHAR(50) | Apellidos del cliente |
| telefono | NUMERIC | Teléfono de contacto |
| email | VARCHAR(50) | Email (único) |
| IdProvincia | INT | FK → Provincias.Id |
| localidad | VARCHAR(100) | Localidad del cliente |
| direccion | VARCHAR(100) | Dirección del cliente |
| fechaNacimiento | DATE | Fecha de nacimiento |
| DNI | NUMERIC(15) | DNI (único) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices**: email, DNI, IdProvincia, nombres+apellidos

---

### 3. Marcas
Almacena las marcas de motocicletas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| Descripcion | VARCHAR(50) | Nombre de la marca (único) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

---

### 4. Vehiculo
Almacena la información de las motocicletas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| patente | VARCHAR(20) | Patente del vehículo (único) |
| IdMarca | INT | FK → Marcas.Id |
| Modelo | VARCHAR(50) | Modelo del vehículo |
| anio | DATE | Año del vehículo |
| kmActual | BIGINT | Kilometraje actual (default: 0) |
| fotos | BYTEA | Fotos del vehículo (opcional) |
| IdCliente | INT | FK → Clientes.Id |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices**: patente, IdMarca, IdCliente

---

### 5. CategoriasServicio
Almacena las categorías de servicios (Mantenimiento, Reparación, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| Nombre | VARCHAR(50) | Nombre de la categoría (único) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Datos iniciales**: Mantenimiento, Reparación, Revisión, Diagnóstico, Limpieza

---

### 6. TiposServicio
Almacena los tipos específicos de servicios dentro de cada categoría.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| Nombre | VARCHAR(50) | Nombre del tipo de servicio |
| IdCategoriaServicio | INT | FK → CategoriasServicio.Id |
| Referencia | VARCHAR(500) | Referencia o descripción del servicio |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices**: IdCategoriaServicio, Nombre

---

### 7. Estados
Almacena los estados posibles de un servicio o detalle de servicio.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| Descripcion | VARCHAR(50) | Descripción del estado |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Datos iniciales**: Pendiente, En Proceso, Completado, Cancelado, Requiere Atención, Aprobado, Rechazado

---

### 8. Servicios
Almacena los servicios realizados a los vehículos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| IdVehiculo | INT | FK → Vehiculo.Id (NOT NULL) |
| fechaServicio | DATE | Fecha del servicio (default: CURRENT_DATE) |
| kmServicio | BIGINT | Kilometraje al momento del servicio |
| Calificacion | SMALLINT | Calificación del servicio (1-5) |
| Comentario | VARCHAR(1000) | Comentarios generales del servicio |
| tecnico | VARCHAR(100) | Nombre del técnico que realizó el servicio |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices**: IdVehiculo, fechaServicio, kmServicio

---

### 9. DetallesServicio
Almacena los detalles específicos de cada servicio (qué se hizo, estado, recomendaciones).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | SERIAL PRIMARY KEY | Identificador único |
| IdServicio | INT | FK → Servicios.Id (NOT NULL) |
| IdTipoServicio | INT | FK → TiposServicio.Id |
| ProximoEnKm | BIGINT | Próximo servicio en X kilómetros |
| Comentario | VARCHAR(1000) | Comentarios específicos del detalle |
| IdEstado | INT | FK → Estados.Id |
| Recomendacion | VARCHAR(1000) | Recomendaciones del técnico |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices**: IdServicio, IdTipoServicio, IdEstado

---

## 🔐 Políticas de Seguridad (RLS)

### Lectura Pública
Las siguientes tablas permiten lectura pública (para consulta por patente):
- Provincias
- Marcas
- Estados
- CategoriasServicio
- TiposServicio
- Vehiculo
- Servicios
- DetallesServicio
- Clientes (limitada)

### Escritura/Modificación/Eliminación
Solo usuarios administradores (con rol 'admin' o 'super_admin' activo) pueden:
- Insertar registros
- Actualizar registros
- Eliminar registros

---

## 🔄 Relaciones y Foreign Keys

1. **Clientes → Provincias**: `ON DELETE SET NULL`
   - Si se elimina una provincia, el IdProvincia del cliente se establece en NULL

2. **Vehiculo → Marcas**: `ON DELETE SET NULL`
   - Si se elimina una marca, el IdMarca del vehículo se establece en NULL

3. **Vehiculo → Clientes**: `ON DELETE SET NULL`
   - Si se elimina un cliente, el IdCliente del vehículo se establece en NULL

4. **TiposServicio → CategoriasServicio**: `ON DELETE CASCADE`
   - Si se elimina una categoría, se eliminan todos sus tipos de servicio

5. **Servicios → Vehiculo**: `ON DELETE CASCADE`
   - Si se elimina un vehículo, se eliminan todos sus servicios

6. **DetallesServicio → Servicios**: `ON DELETE CASCADE`
   - Si se elimina un servicio, se eliminan todos sus detalles

7. **DetallesServicio → TiposServicio**: `ON DELETE SET NULL`
   - Si se elimina un tipo de servicio, el IdTipoServicio se establece en NULL

8. **DetallesServicio → Estados**: `ON DELETE SET NULL`
   - Si se elimina un estado, el IdEstado se establece en NULL

---

## 📝 Notas Importantes

1. **SERIAL vs UUID**: Este esquema usa `SERIAL` (INTEGER autoincremental) en lugar de UUID para mantener compatibilidad con el esquema original.

2. **Campos de Auditoría**: Todas las tablas incluyen `created_at` y `updated_at` que se actualizan automáticamente mediante triggers.

3. **Índices**: Se han creado índices en campos frecuentemente consultados para mejorar el rendimiento.

4. **Datos Iniciales**: Al ejecutar el esquema, se insertan automáticamente:
   - 23 provincias argentinas
   - 7 estados comunes
   - 5 categorías de servicio básicas

5. **BYTEA para Fotos**: El campo `fotos` en la tabla `Vehiculo` usa tipo `BYTEA` para almacenar imágenes binarias. Considera usar almacenamiento externo (Supabase Storage) para archivos grandes.

---

## 🚀 Próximos Pasos

1. Ejecutar `supabase-schema-nuevo.sql` en Supabase SQL Editor
2. Ejecutar `supabase-admin-schema-nuevo.sql` para configurar políticas RLS
3. Crear el primer usuario administrador
4. Configurar las variables de entorno en `.env.local`

