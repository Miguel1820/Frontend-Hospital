export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreatePacienteRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  id_usuario_creacion: string;
}

export interface UpdatePacienteRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  activo?: boolean;
  id_usuario_edicion?: string;
}

export interface PacienteFilters {
  nombre?: string;
  email?: string;
  activo?: boolean | string;
}

