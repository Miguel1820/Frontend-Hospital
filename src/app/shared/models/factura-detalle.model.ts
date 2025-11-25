export interface FacturaDetalle {
  id: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  factura_id: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateFacturaDetalleRequest {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  factura_id: string;
  id_usuario_creacion: string;
}

export interface UpdateFacturaDetalleRequest {
  descripcion?: string;
  cantidad?: number;
  precio_unitario?: number;
  subtotal?: number;
  id_usuario_edicion?: string;
}

export interface FacturaDetalleFilters {
  factura_id?: string;
}

