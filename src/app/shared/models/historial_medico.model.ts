export interface HistorialMedico {
  id: string;  // UUID
  numero_historial: string;
  notas_generales?: string;
  paciente_id: string;
  estado: string;
  activo: boolean;
  created_at: string;
  // backward-compatible aliases used in templates
  paciente?: string;
  medico?: string;
  diagnostico?: string;
  fecha?: string;
  updated_at?: string;
}

export interface CreateHistorialMedicoRequest {
  numero_historial: string;
  notas_generales?: string;
  paciente_id: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateHistorialMedicoRequest {
  numero_historial?: string;
  notas_generales?: string;
  estado?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface HistorialMedicoFilters {
  paciente_id?: string;
  estado?: string;
  // aliases used by templates
  paciente?: string;
  medico?: string;
}