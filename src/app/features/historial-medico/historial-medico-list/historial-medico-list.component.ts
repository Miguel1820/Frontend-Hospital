import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { getErrorMessage, maxLengthValidator, minLengthValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { CreateHistorialMedicoRequest, HistorialMedico, HistorialMedicoFilters, UpdateHistorialMedicoRequest } from '../../../shared/models/historial-medico.model';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-historial-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historial-medico-list.component.html',
  styleUrl: './historial-medico-list.component.scss'
})
export class HistorialMedicoListComponent implements OnInit {
  historiales: HistorialMedico[] = [];
  pacientes: Paciente[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: HistorialMedicoFilters = {};
  showModal = false;
  editingHistorial: HistorialMedico | null = null;
  historialForm!: FormGroup;

  constructor(
    private historialMedicoService: HistorialMedicoService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.historialForm = this.fb.group({
      numero_historial: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(50)]],
      notas_generales: ['', [maxLengthValidator(1000)]],
      paciente_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadHistoriales();
    this.loadPacientes();
  }

  loadHistoriales(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.historialMedicoService.getHistorialesMedicos(pagination, this.filters).subscribe({
      next: (response) => {
        this.historiales = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar historiales médicos:', error);
        alert('Error al cargar historiales médicos');
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

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadHistoriales();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadHistoriales();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHistoriales();
    }
  }

  openCreateModal(): void {
    this.editingHistorial = null;
    this.historialForm.reset({
      numero_historial: '',
      notas_generales: '',
      paciente_id: ''
    });
    this.historialForm.get('paciente_id')?.enable();
    this.showModal = true;
  }

  editHistorial(historial: HistorialMedico): void {
    this.editingHistorial = historial;
    this.historialForm.patchValue({
      numero_historial: historial.numero_historial,
      notas_generales: historial.notas_generales || '',
      paciente_id: historial.paciente_id
    });
    this.historialForm.get('paciente_id')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingHistorial = null;
    this.historialForm.reset();
    this.historialForm.get('paciente_id')?.enable();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.historialForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveHistorial(): void {
    if (this.historialForm.invalid) {
      this.historialForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.historialForm.getRawValue();

    if (this.editingHistorial) {
      const updateData: UpdateHistorialMedicoRequest = {
        numero_historial: formValue.numero_historial,
        notas_generales: formValue.notas_generales || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.historialMedicoService.updateHistorialMedico(this.editingHistorial.id, updateData).subscribe({
        next: () => {
          this.loadHistoriales();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar historial médico:', error);
          alert('Error al actualizar el historial médico');
        }
      });
    } else {
      const newHistorial: CreateHistorialMedicoRequest = {
        numero_historial: formValue.numero_historial,
        notas_generales: formValue.notas_generales || undefined,
        paciente_id: formValue.paciente_id,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.historialMedicoService.createHistorialMedico(newHistorial).subscribe({
        next: () => {
          this.loadHistoriales();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear historial médico:', error);
          let errorMessage = 'Error al crear el historial médico';
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

  deleteHistorial(historial: HistorialMedico): void {
    if (confirm(`¿Está seguro de eliminar el historial médico "${historial.numero_historial}"?`)) {
      this.historialMedicoService.deleteHistorialMedico(historial.id).subscribe({
        next: () => {
          this.loadHistoriales();
        },
        error: (error) => {
          console.error('Error al eliminar historial médico:', error);
          alert('Error al eliminar el historial médico');
        }
      });
    }
  }

  getPacienteNombre(pacienteId: string): string {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'N/A';
  }
}
