import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { getErrorMessage, maxLengthValidator, minLengthValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { HistorialEntradaService } from '../../../core/services/historial-entrada.service';
import { HistorialMedicoService } from '../../../core/services/historial-medico.service';
import { MedicoService } from '../../../core/services/medico.service';
import { CreateHistorialEntradaRequest, HistorialEntrada, HistorialEntradaFilters, UpdateHistorialEntradaRequest } from '../../../shared/models/historial-entrada.model';
import { HistorialMedico } from '../../../shared/models/historial-medico.model';
import { Medico } from '../../../shared/models/medico.model';

@Component({
  selector: 'app-historial-entrada-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historial-entrada-list.component.html',
  styleUrl: './historial-entrada-list.component.scss'
})
export class HistorialEntradaListComponent implements OnInit {
  historiales: HistorialEntrada[] = [];
  historialesMedicos: HistorialMedico[] = [];
  medicos: Medico[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: HistorialEntradaFilters = {};
  showModal = false;
  editingHistorial: HistorialEntrada | null = null;
  historialForm!: FormGroup;

  constructor(
    private historialEntradaService: HistorialEntradaService,
    private historialMedicoService: HistorialMedicoService,
    private medicoService: MedicoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.historialForm = this.fb.group({
      fecha_consulta: ['', [Validators.required]],
      diagnostico: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(255)]],
      tratamiento: ['', [maxLengthValidator(500)]],
      observaciones: ['', [maxLengthValidator(500)]],
      historial_medico_id: ['', [Validators.required]],
      medico_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadHistoriales();
    this.loadHistorialesMedicos();
    this.loadMedicos();
  }

  loadHistoriales(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.historialEntradaService.getHistorialesEntrada(pagination, this.filters).subscribe({
      next: (response) => {
        this.historiales = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar historiales de entrada:', error);
        alert('Error al cargar historiales de entrada');
        this.loading = false;
      }
    });
  }

  loadHistorialesMedicos(): void {
    this.historialMedicoService.getHistorialesMedicos({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.historialesMedicos = response.data || [];
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
      fecha_consulta: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      historial_medico_id: '',
      medico_id: ''
    });
    this.historialForm.get('historial_medico_id')?.enable();
    this.historialForm.get('medico_id')?.enable();
    this.showModal = true;
  }

  editHistorial(historial: HistorialEntrada): void {
    this.editingHistorial = historial;
    const fecha = new Date(historial.fecha_consulta);
    this.historialForm.patchValue({
      fecha_consulta: fecha.toISOString().slice(0, 16),
      diagnostico: historial.diagnostico,
      tratamiento: historial.tratamiento || '',
      observaciones: historial.observaciones || '',
      historial_medico_id: historial.historial_medico_id,
      medico_id: historial.medico_id
    });
    this.historialForm.get('historial_medico_id')?.disable();
    this.historialForm.get('medico_id')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingHistorial = null;
    this.historialForm.reset();
    this.historialForm.get('historial_medico_id')?.enable();
    this.historialForm.get('medico_id')?.enable();
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
      const updateData: UpdateHistorialEntradaRequest = {
        fecha_consulta: formValue.fecha_consulta,
        diagnostico: formValue.diagnostico,
        tratamiento: formValue.tratamiento || undefined,
        observaciones: formValue.observaciones || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.historialEntradaService.updateHistorialEntrada(this.editingHistorial.id, updateData).subscribe({
        next: () => {
          this.loadHistoriales();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar historial de entrada:', error);
          alert('Error al actualizar el historial de entrada');
        }
      });
    } else {
      const newHistorial: CreateHistorialEntradaRequest = {
        fecha_consulta: formValue.fecha_consulta,
        diagnostico: formValue.diagnostico,
        tratamiento: formValue.tratamiento || undefined,
        observaciones: formValue.observaciones || undefined,
        historial_medico_id: formValue.historial_medico_id,
        medico_id: formValue.medico_id,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.historialEntradaService.createHistorialEntrada(newHistorial).subscribe({
        next: () => {
          this.loadHistoriales();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear historial de entrada:', error);
          let errorMessage = 'Error al crear el historial de entrada';
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

  deleteHistorial(historial: HistorialEntrada): void {
    if (confirm(`¿Está seguro de eliminar este historial de entrada?`)) {
      this.historialEntradaService.deleteHistorialEntrada(historial.id).subscribe({
        next: () => {
          this.loadHistoriales();
        },
        error: (error) => {
          console.error('Error al eliminar historial de entrada:', error);
          alert('Error al eliminar el historial de entrada');
        }
      });
    }
  }

  getHistorialMedicoNumero(historialMedicoId: string): string {
    const historial = this.historialesMedicos.find(h => h.id === historialMedicoId);
    return historial ? historial.numero_historial : 'N/A';
  }

  getMedicoNombre(medicoId: string): string {
    const medico = this.medicos.find(m => m.id === medicoId);
    return medico ? `${medico.nombre} ${medico.apellido}` : 'N/A';
  }
}
