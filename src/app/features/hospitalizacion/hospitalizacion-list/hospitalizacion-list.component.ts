import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { getErrorMessage, maxLengthValidator, minLengthValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { EnfermeraService } from '../../../core/services/enfermera.service';
import { HospitalizacionService } from '../../../core/services/hospitalizacion.service';
import { MedicoService } from '../../../core/services/medico.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { Enfermera } from '../../../shared/models/enfermera.model';
import { CreateHospitalizacionRequest, Hospitalizacion, HospitalizacionFilters, UpdateHospitalizacionRequest } from '../../../shared/models/hospitalizacion.model';
import { Medico } from '../../../shared/models/medico.model';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-hospitalizacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hospitalizacion-list.component.html',
  styleUrl: './hospitalizacion-list.component.scss'
})
export class HospitalizacionListComponent implements OnInit {
  hospitalizaciones: Hospitalizacion[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  enfermeras: Enfermera[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: HospitalizacionFilters = {};
  showModal = false;
  editingHospitalizacion: Hospitalizacion | null = null;
  hospitalizacionForm!: FormGroup;

  constructor(
    private hospitalizacionService: HospitalizacionService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private enfermeraService: EnfermeraService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.hospitalizacionForm = this.fb.group({
      fecha_ingreso: ['', [Validators.required]],
      fecha_salida: [''],
      motivo: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(255)]],
      numero_habitacion: ['', [Validators.required, minLengthValidator(1), maxLengthValidator(10)]],
      notas: ['', [maxLengthValidator(500)]],
      paciente_id: ['', [Validators.required]],
      medico_id: ['', [Validators.required]],
      enfermera_id: ['']
    });
  }

  ngOnInit(): void {
    this.loadHospitalizaciones();
    this.loadPacientes();
    this.loadMedicos();
    this.loadEnfermeras();
  }

  loadHospitalizaciones(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.hospitalizacionService.getHospitalizaciones(pagination, this.filters).subscribe({
      next: (response) => {
        this.hospitalizaciones = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar hospitalizaciones:', error);
        alert('Error al cargar hospitalizaciones');
        this.loading = false;
      }
    });
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.pacientes = response.data || [];
      }
    });
  }

  loadMedicos(): void {
    this.medicoService.getMedicos({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.medicos = response.data || [];
      }
    });
  }

  loadEnfermeras(): void {
    this.enfermeraService.getEnfermeras({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.enfermeras = response.data || [];
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadHospitalizaciones();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadHospitalizaciones();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHospitalizaciones();
    }
  }

  openCreateModal(): void {
    this.editingHospitalizacion = null;
    this.hospitalizacionForm.reset({
      fecha_ingreso: '',
      fecha_salida: '',
      motivo: '',
      numero_habitacion: '',
      notas: '',
      paciente_id: '',
      medico_id: '',
      enfermera_id: ''
    });
    this.hospitalizacionForm.get('paciente_id')?.enable();
    this.hospitalizacionForm.get('medico_id')?.enable();
    this.hospitalizacionForm.get('enfermera_id')?.enable();
    this.showModal = true;
  }

  editHospitalizacion(hospitalizacion: Hospitalizacion): void {
    this.editingHospitalizacion = hospitalizacion;
    const fechaIngreso = new Date(hospitalizacion.fecha_ingreso);
    const fechaSalida = hospitalizacion.fecha_salida ? new Date(hospitalizacion.fecha_salida) : null;
    this.hospitalizacionForm.patchValue({
      fecha_ingreso: fechaIngreso.toISOString().slice(0, 16),
      fecha_salida: fechaSalida ? fechaSalida.toISOString().slice(0, 16) : '',
      motivo: hospitalizacion.motivo,
      numero_habitacion: hospitalizacion.numero_habitacion,
      notas: hospitalizacion.notas || '',
      paciente_id: hospitalizacion.paciente_id,
      medico_id: hospitalizacion.medico_id,
      enfermera_id: hospitalizacion.enfermera_id || ''
    });
    this.hospitalizacionForm.get('paciente_id')?.disable();
    this.hospitalizacionForm.get('medico_id')?.disable();
    this.hospitalizacionForm.get('enfermera_id')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingHospitalizacion = null;
    this.hospitalizacionForm.reset();
    this.hospitalizacionForm.get('paciente_id')?.enable();
    this.hospitalizacionForm.get('medico_id')?.enable();
    this.hospitalizacionForm.get('enfermera_id')?.enable();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.hospitalizacionForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveHospitalizacion(): void {
    if (this.hospitalizacionForm.invalid) {
      this.hospitalizacionForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.hospitalizacionForm.getRawValue();

    if (this.editingHospitalizacion) {
      const updateData: UpdateHospitalizacionRequest = {
        fecha_ingreso: formValue.fecha_ingreso,
        fecha_salida: formValue.fecha_salida || undefined,
        motivo: formValue.motivo,
        numero_habitacion: formValue.numero_habitacion,
        notas: formValue.notas || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.hospitalizacionService.updateHospitalizacion(this.editingHospitalizacion.id, updateData).subscribe({
        next: () => {
          this.loadHospitalizaciones();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar hospitalización:', error);
          alert('Error al actualizar la hospitalización');
        }
      });
    } else {
      const newHospitalizacion: CreateHospitalizacionRequest = {
        fecha_ingreso: formValue.fecha_ingreso,
        fecha_salida: formValue.fecha_salida || undefined,
        motivo: formValue.motivo,
        numero_habitacion: formValue.numero_habitacion,
        notas: formValue.notas || undefined,
        paciente_id: formValue.paciente_id,
        medico_id: formValue.medico_id,
        enfermera_id: formValue.enfermera_id || undefined,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.hospitalizacionService.createHospitalizacion(newHospitalizacion).subscribe({
        next: () => {
          this.loadHospitalizaciones();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear hospitalización:', error);
          let errorMessage = 'Error al crear la hospitalización';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += ': ' + error.error;
            } else if (error.error.detail) {
              errorMessage += ': ' + error.error.detail;
            } else if (error.error.message) {
              errorMessage += ': ' + error.error.message;
            } else if (Array.isArray(error.error)) {
              errorMessage += ': ' + error.error.map((e: any) => e.message || e.msg || JSON.stringify(e)).join(', ');
            }
          } else if (error.message) {
            errorMessage += ': ' + error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }

  deleteHospitalizacion(hospitalizacion: Hospitalizacion): void {
    if (confirm(`¿Está seguro de eliminar la hospitalización?`)) {
      this.hospitalizacionService.deleteHospitalizacion(hospitalizacion.id).subscribe({
        next: () => {
          this.loadHospitalizaciones();
        },
        error: (error) => {
          console.error('Error al eliminar hospitalización:', error);
          alert('Error al eliminar la hospitalización');
        }
      });
    }
  }

  getPacienteNombre(pacienteId: string): string {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'N/A';
  }

  getMedicoNombre(medicoId: string): string {
    const medico = this.medicos.find(m => m.id === medicoId);
    return medico ? `${medico.nombre} ${medico.apellido}` : 'N/A';
  }

  getEnfermeraNombre(enfermeraId: string): string {
    const enfermera = this.enfermeras.find(e => e.id === enfermeraId);
    return enfermera ? `${enfermera.nombre} ${enfermera.apellido}` : 'N/A';
  }
}
