export interface Factura {
  id: string;
  numero_factura: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: number;
  impuestos: number;
  total: number;
  notas?: string;
  paciente_id: string;
  estado: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  paciente?: Paciente;
  detalles?: FacturaDetalle[];
}

export interface CreateFacturaRequest {
  numero_factura: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: number;
  impuestos: number;
  total: number;
  notas?: string;
  paciente_id: string;
  id_usuario_creacion: string;
}

export interface UpdateFacturaRequest {
  numero_factura?: string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  subtotal?: number;
  impuestos?: number;
  total?: number;
  notas?: string;
  estado?: string;
  id_usuario_edicion?: string;
}

export interface FacturaFilters {
  paciente_id?: string;
  estado?: string;
  numero_factura?: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
}

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

