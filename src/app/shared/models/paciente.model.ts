/**
 * Modelo para la entidad Paciente
 */
export interface Paciente {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  activo: boolean;
  id_usuario_creacion: number;
}

/**
 * Modelo para crear un nuevo paciente
 */
export interface CreatePacienteRequest {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  activo: boolean;
  id_usuario_creacion: number;
}

/**
 * Modelo para actualizar un paciente
 */
export interface UpdatePacienteRequest {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  activo: boolean;
  id_usuario_creacion: number;
}

/**
 * Modelo para filtros de pacientes
 */
export interface PacienteFilters {
  primer_nombre: string;
  apellido: string;
  email: string;
  activo: string;
}