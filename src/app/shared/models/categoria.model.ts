/**
 * Modelo para la entidad Categoría
 */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

/**
 * Modelo para crear una nueva categoría
 */
export interface CreateCategoriaRequest {
  nombre: string;
  descripcion?: string;
  activa?: boolean;
}

/**
 * Modelo para actualizar una categoría
 */
export interface UpdateCategoriaRequest {
  nombre?: string;
  descripcion?: string;
  activa?: boolean;
}

/**
 * Modelo para filtros de categorías
 */
export interface CategoriaFilters {
  nombre?: string;
  activa?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
