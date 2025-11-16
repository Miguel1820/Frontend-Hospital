export interface Cita {
  id: string;  // UUID
  fecha_cita: string;  // ISO string
  motivo: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  estado: string;
  activo: boolean;
  created_at: string;
  // backward-compatible aliases used in templates
  paciente?: string;
  medico?: string;
  fecha?: string;
  hora?: string;
  updated_at?: string;
}

export interface CreateCitaRequest {
  fecha_cita: string;
  motivo: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateCitaRequest {
  fecha_cita?: string;
  motivo?: string;
  notas?: string;
  estado?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface CitaFilters {
  paciente_id?: string;
  medico_id?: string;
  estado?: string;
  // alias used by templates
  paciente?: string;
}