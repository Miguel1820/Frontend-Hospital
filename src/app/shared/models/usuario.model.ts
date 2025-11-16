export interface Usuario {
  id: string;  // UUID
  nombre: string;
  nombre_usuario: string;
  email: string;
  telefono?: string;
  es_admin: boolean;
  activo: boolean;
  created_at: string;
  // backward-compatible alias used in templates
  fecha_creacion?: string;
  updated_at?: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  nombre_usuario: string;
  email: string;
  telefono?: string;
  es_admin: boolean;
  contraseña: string;
  id_usuario_creacion: string; // UUID
  // optional aliases accepted by some components
  password?: string;
  apellido?: string;
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  nombre_usuario?: string;
  email?: string;
  telefono?: string;
  es_admin?: boolean;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface UsuarioFilters {
  nombre?: string;
  nombre_usuario?: string;
  email?: string;
  es_admin?: boolean;
  activo?: boolean;
}

export interface ChangePasswordRequest {
  contraseña_actual: string;
  contraseña_nueva: string;
  contraseña_confirmacion: string;
}