/**
 * Modelo para la entidad Usuario
 */
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  ultimo_acceso?: string;
}

/**
 * Modelo para crear un nuevo usuario
 */
export interface CreateUsuarioRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  activo?: boolean;
}

/**
 * Modelo para actualizar un usuario
 */
export interface UpdateUsuarioRequest {
  email?: string;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
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
