export interface Hospitalizacion {
  id: string;  // UUID
  fecha_ingreso: string;  // ISO string
  fecha_salida?: string;  // ISO string
  motivo: string;
  numero_habitacion: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  enfermera_id?: string;
  estado: string;
  activo: boolean;
  created_at: string;
  // backward-compatible aliases used in templates
  paciente?: string;
  medico?: string;
  updated_at?: string;
}

export interface CreateHospitalizacionRequest {
  fecha_ingreso: string;
  fecha_salida?: string;
  motivo: string;
  numero_habitacion: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  enfermera_id?: string;
  id_usuario_creacion: string; // UUID
}

export interface UpdateHospitalizacionRequest {
  fecha_ingreso?: string;
  fecha_salida?: string;
  motivo?: string;
  numero_habitacion?: string;
  notas?: string;
  estado?: string;
  activo?: boolean;
  id_usuario_edicion: string; // UUID
}

export interface HospitalizacionFilters {
  paciente_id?: string;
  medico_id?: string;
  estado?: string;
  // aliases used by templates
  paciente?: string;
  medico?: string;
}