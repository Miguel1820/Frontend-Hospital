export interface Enfermera {
  id: string;  // UUID
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  numero_licencia: string;
  turno: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateEnfermeraRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  numero_licencia: string;
  turno: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateEnfermeraRequest {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  numero_licencia?: string;
  turno?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface EnfermeraFilters {
  nombre?: string;
  apellido?: string;
  email?: string;
  turno?: string;
  activo?: boolean;
}