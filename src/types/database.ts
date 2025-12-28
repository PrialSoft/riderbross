// Tipos para las entidades de la base de datos

export interface Provincia {
  Id: number;
  Descripcion: string;
}

export interface Cliente {
  Id: number;
  nombres: string;
  apellidos: string;
  telefono: number | null;
  email: string;
  localidad: string | null;
  direccion: string | null;
  fechaNacimiento: string | null;
  DNI: number;
  IdProvincia: number | null;
  Provincias?: Provincia | null;
}

export interface Marca {
  Id: number;
  Descripcion: string;
}

export interface Vehiculo {
  Id: number;
  patente: string;
  IdMarca: number | null;
  Modelo: string | null;
  anio: string | null;
  kmActual: number | null;
  fotos: string | null;
  IdCliente: number | null;
  Marcas?: Marca | null;
  Clientes?: Cliente | null;
}

export interface Estado {
  Id: number;
  Descripcion: string;
}

export interface CategoriaServicio {
  Id: number;
  Nombre: string;
}

export interface TipoServicio {
  Id: number;
  Nombre: string;
  IdCategoriaServicio: number | null;
  Referencia: string | null;
  CategoriasServicio?: CategoriaServicio | null;
}

export interface DetalleServicio {
  Id: number;
  IdServicio: number;
  IdTipoServicio: number | null;
  ProximoEnKm: number | null;
  Comentario: string | null;
  IdEstado: number | null;
  Recomendacion: string | null;
  TiposServicio?: TipoServicio | null;
  Estados?: Estado | null;
}

export interface Servicio {
  Id: number;
  Calificacion: number | null;
  Comentario: string | null;
  fechaServicio: string;
  kmServicio: number;
  IdVehiculo: number | null;
  Vehiculo?: Vehiculo | null;
  DetallesServicio?: DetalleServicio[];
}

// Tipo para servicios con relaciones expandidas (usado en queries del dashboard)
export interface ServicioWithRelations {
  Id: number;
  fechaServicio: string;
  kmServicio: number;
  Vehiculo?: {
    patente: string;
    Modelo: string | null;
    Marcas?: {
      Descripcion: string;
    } | null;
  } | null;
}

