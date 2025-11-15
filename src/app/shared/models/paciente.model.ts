/**
 * Modelo para la entidad Paciente
 */
export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Modelo para crear un nuevo paciente
 */
export interface CreatePacienteRequest {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Modelo para actualizar un paciente
 */
export interface UpdatePacienteRequest {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Modelo para filtros de pacientes
 */
export interface PacienteFilters {
  nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
}