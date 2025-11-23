import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { emailValidator, getErrorMessage, maxLengthValidator, minLengthValidator, numberValidator, phoneValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { MedicoService } from '../../../core/services/medico.service';
import { CreateMedicoRequest, Medico, MedicoFilters, UpdateMedicoRequest } from '../../../shared/models/medico.model';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico-list.component.html',
  styleUrl: './medico-list.component.scss'
})
export class MedicoListComponent implements OnInit {
  medicos: Medico[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: MedicoFilters = {};
  showModal = false;
  editingMedico: Medico | null = null;
  medicoForm!: FormGroup;

  constructor(
    private medicoService: MedicoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      apellido: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      email: ['', [Validators.required, emailValidator()]],
      telefono: ['', [phoneValidator()]],
      fecha_nacimiento: ['', [Validators.required]],
      especialidad: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      numero_licencia: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(50)]],
      consultorio: ['', [maxLengthValidator(50)]],
      direccion: ['', [maxLengthValidator(255)]]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.medicoService.getMedicos(pagination, this.filters).subscribe({
      next: (response) => {
        this.medicos = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar médicos:', error);
        let errorMessage = 'Error al cargar médicos';
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage += ': ' + error.error;
          } else if (error.error.detail) {
            errorMessage += ': ' + (typeof error.error.detail === 'string' ? error.error.detail : JSON.stringify(error.error.detail));
          } else if (error.error.message) {
            errorMessage += ': ' + error.error.message;
          }
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
        alert(errorMessage);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadMedicos();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadMedicos();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMedicos();
    }
  }

  openCreateModal(): void {
    this.editingMedico = null;
    this.medicoForm.reset({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      especialidad: '',
      numero_licencia: '',
      consultorio: '',
      direccion: ''
    });
    this.showModal = true;
  }

  editMedico(medico: Medico): void {
    this.editingMedico = medico;
    this.medicoForm.patchValue({
      nombre: medico.nombre,
      apellido: medico.apellido,
      email: medico.email,
      telefono: medico.telefono || '',
      fecha_nacimiento: (medico as any).fecha_nacimiento || '',
      especialidad: medico.especialidad,
      numero_licencia: medico.numero_licencia,
      consultorio: (medico as any).consultorio || '',
      direccion: (medico as any).direccion || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingMedico = null;
    this.medicoForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.medicoForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveMedico(): void {
    if (this.medicoForm.invalid) {
      this.medicoForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.medicoForm.value;

    if (this.editingMedico) {
      const updateData: UpdateMedicoRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        especialidad: formValue.especialidad,
        numero_licencia: formValue.numero_licencia,
        fecha_nacimiento: formValue.fecha_nacimiento,
        consultorio: formValue.consultorio || undefined,
        direccion: formValue.direccion || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.medicoService.updateMedico(this.editingMedico.id, updateData).subscribe({
        next: () => {
          this.loadMedicos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar médico:', error);
          let errorMessage = 'Error al actualizar el médico';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += ': ' + error.error;
            } else if (error.error.detail) {
              if (Array.isArray(error.error.detail)) {
                errorMessage += ': ' + error.error.detail.map((e: any) => {
                  const loc = e.loc ? e.loc.join('.') : '';
                  return `${loc}: ${e.msg || e.message || JSON.stringify(e)}`;
                }).join(', ');
              } else {
                errorMessage += ': ' + error.error.detail;
              }
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
    } else {
      const newMedico: CreateMedicoRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        especialidad: formValue.especialidad,
        numero_licencia: formValue.numero_licencia,
        fecha_nacimiento: formValue.fecha_nacimiento,
        consultorio: formValue.consultorio || undefined,
        direccion: formValue.direccion || undefined,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.medicoService.createMedico(newMedico).subscribe({
        next: () => {
          this.loadMedicos();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear médico:', error);
          let errorMessage = 'Error al crear el médico';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += ': ' + error.error;
            } else if (error.error.detail) {
              if (Array.isArray(error.error.detail)) {
                const errorDetails = error.error.detail.map((e: any) => {
                  if (typeof e === 'string') return e;
                  if (e.loc && e.msg) {
                    return `${e.loc.join('.')}: ${e.msg}`;
                  }
                  if (e.type) {
                    return `${e.type}: ${e.msg || JSON.stringify(e)}`;
                  }
                  if (e.message) return e.message;
                  if (e.msg) return e.msg;
                  return JSON.stringify(e);
                }).join(' | ');
                errorMessage += ': ' + errorDetails;
              } else if (typeof error.error.detail === 'string') {
                errorMessage += ': ' + error.error.detail;
              }
            } else if (error.error.message) {
              errorMessage += ': ' + error.error.message;
            }
          } else if (error.message) {
            errorMessage += ': ' + error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }

  deleteMedico(medico: Medico): void {
    if (confirm(`¿Está seguro de eliminar el médico "${medico.nombre} ${medico.apellido}"?`)) {
      this.medicoService.deleteMedico(medico.id).subscribe({
        next: () => {
          this.loadMedicos();
        },
        error: (error) => {
          console.error('Error al eliminar médico:', error);
          alert('Error al eliminar el médico');
        }
      });
    }
  }
}
