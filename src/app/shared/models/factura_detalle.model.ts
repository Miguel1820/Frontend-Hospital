export interface FacturaDetalle {
  id: string;  // UUID
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  factura_id: string;
  activo: boolean;
  created_at: string;
  // backward-compatible aliases used in templates
  factura?: string;
  producto?: string;
  total?: number;
  updated_at?: string;
}

export interface CreateFacturaDetalleRequest {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  factura_id: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateFacturaDetalleRequest {
  descripcion?: string;
  cantidad?: number;
  precio_unitario?: number;
  subtotal?: number;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface FacturaDetalleFilters {
  factura_id?: string;
  // alias used by templates
  factura?: string;
}