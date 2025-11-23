export interface HistorialMedico {
  id: string;
  numero_historial: string;
  notas_generales?: string;
  paciente_id: string;
  estado: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  paciente?: Paciente;
}

export interface CreateHistorialMedicoRequest {
  numero_historial: string;
  notas_generales?: string;
  paciente_id: string;
  id_usuario_creacion: string;
}

export interface UpdateHistorialMedicoRequest {
  numero_historial?: string;
  notas_generales?: string;
  estado?: string;
  id_usuario_edicion?: string;
}

export interface HistorialMedicoFilters {
  paciente_id?: string;
  numero_historial?: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
}

