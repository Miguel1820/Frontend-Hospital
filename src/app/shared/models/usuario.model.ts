/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id: string;
  nombre: string;
  nombre_usuario: string;
  email: string;
  telefono?: string;
  es_admin: boolean;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion?: string;
  id_usuario_creacion?: string;
  id_usuario_edicion?: string;
}

/**
 * Modelo para crear un nuevo usuario
 */
export interface CreateUsuarioRequest {
  nombre: string;
  nombre_usuario: string;
  email: string;
  contraseña: string;
  id_usuario_creacion?: string;
  telefono?: string;
  es_admin?: boolean;
}

/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  nombre?: string;
  nombre_usuario?: string;
  email?: string;
  telefono?: string;
  es_admin?: boolean;
  activo?: boolean;
  id_usuario_edicion?: string;
}

/**
 * Modelo para cambiar contraseña
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Modelo para filtros de usuarios
 */
export interface UsuarioFilters {
  email?: string;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
