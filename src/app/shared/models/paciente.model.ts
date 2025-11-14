/**
 * Modelo para la entidad Paciente
 */
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono?: string; //opcional
  email?: string; //opcional
  activo: boolean; 
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

/**
 * Modelo para crear un nuevo paciente
 */
export interface CreatePacienteRequest {
  nombre: string;
  apellido: string;
  documento: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento: string;
  direccion: string;
  id_usuario_creacion: string;
}

/**
 * Modelo para actualizar un paciente
 */
export interface UpdatePacienteRequest {
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
}

/**
 * Modelo para filtros de pacientes
 */
export interface PacienteFilters {
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
  email?: string;
  activo?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}