import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { getErrorMessage, maxLengthValidator, minLengthValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { CitaService } from '../../../core/services/cita.service';
import { MedicoService } from '../../../core/services/medico.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { Cita, CitaFilters, CreateCitaRequest, UpdateCitaRequest } from '../../../shared/models/cita.model';
import { Medico } from '../../../shared/models/medico.model';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.scss'
})
export class CitaListComponent implements OnInit {
  citas: Cita[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: CitaFilters = {};
  showModal = false;
  editingCita: Cita | null = null;
  citaForm!: FormGroup;

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.citaForm = this.fb.group({
      fecha_cita: ['', [Validators.required]],
      motivo: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(255)]],
      notas: ['', [maxLengthValidator(500)]],
      paciente_id: ['', [Validators.required]],
      medico_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCitas();
    this.loadPacientes();
    this.loadMedicos();
  }

  loadCitas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.citaService.getCitas(pagination, this.filters).subscribe({
      next: (response) => {
        this.citas = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        alert('Error al cargar citas');
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

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCitas();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadCitas();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCitas();
    }
  }

  openCreateModal(): void {
    this.editingCita = null;
    this.citaForm.reset({
      fecha_cita: '',
      motivo: '',
      notas: '',
      paciente_id: '',
      medico_id: ''
    });
    this.citaForm.get('paciente_id')?.enable();
    this.citaForm.get('medico_id')?.enable();
    this.showModal = true;
  }

  editCita(cita: Cita): void {
    this.editingCita = cita;
    const fecha = new Date(cita.fecha_cita);
    const fechaFormato = fecha.toISOString().slice(0, 16);
    this.citaForm.patchValue({
      fecha_cita: fechaFormato,
      motivo: cita.motivo,
      notas: cita.notas || '',
      paciente_id: cita.paciente_id,
      medico_id: cita.medico_id
    });
    this.citaForm.get('paciente_id')?.disable();
    this.citaForm.get('medico_id')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCita = null;
    this.citaForm.reset();
    this.citaForm.get('paciente_id')?.enable();
    this.citaForm.get('medico_id')?.enable();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.citaForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveCita(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.citaForm.getRawValue();

    if (this.editingCita) {
      const updateData: UpdateCitaRequest = {
        fecha_cita: formValue.fecha_cita,
        motivo: formValue.motivo,
        notas: formValue.notas || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.citaService.updateCita(this.editingCita.id, updateData).subscribe({
        next: () => {
          this.loadCitas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar cita:', error);
          alert('Error al actualizar la cita');
        }
      });
    } else {
      const newCita: CreateCitaRequest = {
        fecha_cita: formValue.fecha_cita,
        motivo: formValue.motivo,
        notas: formValue.notas || undefined,
        paciente_id: formValue.paciente_id,
        medico_id: formValue.medico_id,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.citaService.createCita(newCita).subscribe({
        next: () => {
          this.loadCitas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear cita:', error);
          let errorMessage = 'Error al crear la cita';
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

  deleteCita(cita: Cita): void {
    if (confirm(`¿Está seguro de eliminar la cita?`)) {
      this.citaService.deleteCita(cita.id).subscribe({
        next: () => {
          this.loadCitas();
        },
        error: (error) => {
          console.error('Error al eliminar cita:', error);
          alert('Error al eliminar la cita');
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
}
