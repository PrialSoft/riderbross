/**
 * Tipos TypeScript para el Sistema de Gestión de Servicio Técnico RiderBross
 * Basado en el modelo de datos del informe de Pablo Jaite
 */

export interface Motocicleta {
  id: string;
  patente: string; // Ej: "A160PXS"
  marca: string;
  modelo: string;
  km_actual: number;
  created_at: string;
  updated_at: string;
}

export interface ValoresBateria {
  off: number; // Ej: 12.78v
  ignicion: number; // Ej: 9.42v
  ralenti: number; // Ej: 13.87v
  rpm_5000: number; // Ej: 14.00v
}

export interface ValoresValvulas {
  admision: string; // Ej: "0.10mm"
  escape: string; // Ej: "0.15mm"
}

export interface SistemaIluminacion {
  delantera: boolean;
  trasera: boolean;
  intermitentes: boolean;
  stop: boolean;
  observaciones?: string;
}

export interface SistemaTransmision {
  cadena: boolean;
  correa: boolean;
  cardan: boolean;
  observaciones?: string;
}

export interface SistemaRuedas {
  delantera_psi: number;
  trasera_psi: number;
  observaciones?: string;
}

export interface SistemaFrenos {
  delantero: boolean;
  trasero: boolean;
  observaciones?: string;
}

export interface ChecklistServicios {
  aceite: boolean;
  valvulas: boolean;
  filtros: boolean;
  otros?: string[];
}

export interface FichaTecnica {
  id: string;
  motocicleta_id: string;
  fecha_servicio: string; // ISO date string
  km_servicio: number;
  
  // Checklist de servicios
  checklist: ChecklistServicios;
  
  // Valores de batería
  bateria: ValoresBateria;
  
  // Sistemas
  iluminacion: SistemaIluminacion;
  transmision: SistemaTransmision;
  ruedas: SistemaRuedas;
  frenos: SistemaFrenos;
  
  // Observaciones generales
  observaciones?: string;
  
  // Valores de válvulas
  valvulas?: ValoresValvulas;
  
  // Metadatos
  tecnico?: string; // Nombre del técnico
  created_at: string;
  updated_at: string;
  
  // Relación (para queries)
  motocicleta?: Motocicleta;
}

export interface FichaTecnicaWithMoto extends FichaTecnica {
  motocicleta: Motocicleta;
}

/**
 * Tipos para formularios
 */
export interface FichaTecnicaFormData {
  patente: string;
  marca: string;
  modelo: string;
  km_actual: number;
  fecha_servicio: string;
  km_servicio: number;
  checklist: ChecklistServicios;
  bateria: ValoresBateria;
  iluminacion: SistemaIluminacion;
  transmision: SistemaTransmision;
  ruedas: SistemaRuedas;
  frenos: SistemaFrenos;
  observaciones?: string;
  valvulas?: ValoresValvulas;
  tecnico?: string;
}

/**
 * Tipos para búsqueda
 */
export interface BusquedaPatente {
  patente: string;
}

export interface ResultadoBusqueda {
  motocicleta: Motocicleta;
  fichas_tecnicas: FichaTecnica[];
}

