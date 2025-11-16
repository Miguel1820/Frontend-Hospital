export interface Paciente {
  id: string;  // UUID
  primer_nombre: string;
  segundo_nombre?: string;
  apellido: string;
  // backward-compatible aliases used in templates
  nombre?: string;
  fecha_creacion?: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string; // ISO string
  direccion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreatePacienteRequest {
  primer_nombre: string;
  segundo_nombre?: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion?: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdatePacienteRequest {
  primer_nombre?: string;
  segundo_nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface PacienteFilters {
  primer_nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
  // alias used by templates
  nombre?: string;
}
