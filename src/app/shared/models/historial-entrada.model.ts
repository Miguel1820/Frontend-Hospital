export interface HistorialEntrada {
  id: string;
  fecha_consulta: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  historial_medico_id: string;
  medico_id: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  historial_medico?: HistorialMedico;
  medico?: Medico;
}

export interface CreateHistorialEntradaRequest {
  fecha_consulta: string;
  diagnostico: string;
  tratamiento?: string;
  observaciones?: string;
  historial_medico_id: string;
  medico_id: string;
  id_usuario_creacion: string;
}

export interface UpdateHistorialEntradaRequest {
  fecha_consulta?: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  id_usuario_edicion?: string;
}

export interface HistorialEntradaFilters {
  historial_medico_id?: string;
  medico_id?: string;
}

interface HistorialMedico {
  id: string;
  numero_historial: string;
}

interface Medico {
  id: string;
  nombre: string;
  apellido: string;
}

