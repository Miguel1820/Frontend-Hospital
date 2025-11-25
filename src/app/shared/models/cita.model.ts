export interface Cita {
  id: string;
  fecha_cita: string;
  motivo: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  estado: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  paciente?: Paciente;
  medico?: Medico;
}

export interface CreateCitaRequest {
  fecha_cita: string;
  motivo: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  id_usuario_creacion: string;
}

export interface UpdateCitaRequest {
  fecha_cita?: string;
  motivo?: string;
  notas?: string;
  estado?: string;
  id_usuario_edicion?: string;
}

export interface CitaFilters {
  paciente_id?: string;
  medico_id?: string;
  estado?: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
}

interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
}

