/**
 * Modelo para la entidad Producto
 */
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  categoria?: {
    id: number;
    nombre: string;
  };
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

/**
 * Modelo para crear un nuevo producto
 */
export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: number;
  activo?: boolean;
}

/**
 * Modelo para actualizar un producto
 */
export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoria_id?: number;
  activo?: boolean;
}

/**
 * Modelo para filtros de productos
 */
export interface ProductoFilters {
  nombre?: string;
  categoria_id?: number;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  activo?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}
