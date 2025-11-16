export interface Factura {
  id: string;  // UUID
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
  created_at: string;
  // backward-compatible aliases used in templates
  paciente?: string;
  fecha?: string;
  updated_at?: string;
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
  id_usuario_creacion: string; // UUID
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
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface FacturaFilters {
  paciente_id?: string;
  estado?: string;
  // alias used by templates
  paciente?: string;
}