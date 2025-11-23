export interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidad: string;
  numero_licencia: string;
  fecha_nacimiento: string;
  consultorio?: string;
  direccion?: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  id_usuario_creacion?: string;
  id_usuario_edicion?: string;
}

export interface CreateMedicoRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  especialidad: string;
  numero_licencia: string;
  consultorio?: string;
  direccion?: string;
  id_usuario_creacion?: string;
}

export interface UpdateMedicoRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
  numero_licencia?: string;
  fecha_nacimiento?: string;
  consultorio?: string;
  direccion?: string;
  activo?: boolean;
  id_usuario_edicion?: string;
}

export interface MedicoFilters {
  nombre?: string;
  especialidad?: string;
}

