export interface Enfermera {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  numero_licencia: string;
  turno: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateEnfermeraRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  numero_licencia: string;
  turno: string;
  id_usuario_creacion: string;
}

export interface UpdateEnfermeraRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  numero_licencia?: string;
  turno?: string;
  activo?: boolean;
  id_usuario_edicion?: string;
}

export interface EnfermeraFilters {
  nombre?: string;
  turno?: string;
}

