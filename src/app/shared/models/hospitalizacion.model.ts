export interface Hospitalizacion {
  id: string;
  fecha_ingreso: string;
  fecha_salida?: string;
  motivo: string;
  numero_habitacion: string;
  notas?: string;
  paciente_id: string;
  medico_id: string;
  enfermera_id?: string;
  estado: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  paciente?: Paciente;
  medico?: Medico;
  enfermera?: Enfermera;
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
  id_usuario_creacion: string;
}

export interface UpdateHospitalizacionRequest {
  fecha_ingreso?: string;
  fecha_salida?: string;
  motivo?: string;
  numero_habitacion?: string;
  notas?: string;
  estado?: string;
  id_usuario_edicion?: string;
}

export interface HospitalizacionFilters {
  paciente_id?: string;
  medico_id?: string;
  estado?: string;
}

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
}

interface Medico {
  id: string;
  nombre: string;
  apellido: string;
}

interface Enfermera {
  id: string;
  nombre: string;
  apellido: string;
}

