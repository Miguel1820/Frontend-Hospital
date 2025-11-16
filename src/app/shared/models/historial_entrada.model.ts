export interface HistorialEntrada {
  id: string;  // UUID
  fecha_consulta: string;  // ISO string
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  historial_medico_id: string;
  medico_id: string;
  activo: boolean;
  created_at: string;
  // backward-compatible aliases used in templates
  paciente?: string;
  motivo?: string;
  fecha_entrada?: string;
  updated_at?: string;
}

export interface CreateHistorialEntradaRequest {
  fecha_consulta: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  historial_medico_id: string;
  medico_id: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateHistorialEntradaRequest {
  fecha_consulta?: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface HistorialEntradaFilters {
  historial_medico_id?: string;
  medico_id?: string;
  // aliases used by templates
  paciente?: string;
}