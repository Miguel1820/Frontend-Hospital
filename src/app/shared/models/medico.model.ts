export interface Medico {
  id: string;  // UUID
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidad: string;
  numero_licencia: string;
  activo: boolean;
  created_at: string;
  // backward-compatible alias used in templates
  fecha_creacion?: string;
  updated_at?: string;
}

export interface CreateMedicoRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidad: string;
  numero_licencia: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateMedicoRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  numero_licencia?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface MedicoFilters {
  nombre?: string;
  apellido?: string;
  email?: string;
  especialidad?: string;
  activo?: boolean;
}