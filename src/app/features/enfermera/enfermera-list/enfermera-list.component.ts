import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { emailValidator, getErrorMessage, maxLengthValidator, minLengthValidator, phoneValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { EnfermeraService } from '../../../core/services/enfermera.service';
import { CreateEnfermeraRequest, Enfermera, EnfermeraFilters, UpdateEnfermeraRequest } from '../../../shared/models/enfermera.model';

@Component({
  selector: 'app-enfermera-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enfermera-list.component.html',
  styleUrl: './enfermera-list.component.scss'
})
export class EnfermeraListComponent implements OnInit {
  enfermeras: Enfermera[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: EnfermeraFilters = {};
  includeInactive = false;
  showModal = false;
  editingEnfermera: Enfermera | null = null;
  enfermeraForm!: FormGroup;

  constructor(
    private enfermeraService: EnfermeraService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.enfermeraForm = this.fb.group({
      nombre: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      apellido: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      email: ['', [Validators.required, emailValidator()]],
      telefono: ['', [phoneValidator()]],
      numero_licencia: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(50)]],
      turno: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEnfermeras();
  }

  loadEnfermeras(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.enfermeraService.getEnfermeras(pagination, this.filters, this.includeInactive).subscribe({
      next: (response) => {
        this.enfermeras = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar enfermeras:', error);
        alert('Error al cargar enfermeras');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEnfermeras();
  }

  clearFilters(): void {
    this.filters = {};
    this.includeInactive = false;
    this.currentPage = 1;
    this.loadEnfermeras();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEnfermeras();
    }
  }

  openCreateModal(): void {
    this.editingEnfermera = null;
    this.enfermeraForm.reset({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      numero_licencia: '',
      turno: ''
    });
    this.showModal = true;
  }

  editEnfermera(enfermera: Enfermera): void {
    this.editingEnfermera = enfermera;
    this.enfermeraForm.patchValue({
      nombre: enfermera.nombre,
      apellido: enfermera.apellido,
      email: enfermera.email,
      telefono: enfermera.telefono || '',
      numero_licencia: enfermera.numero_licencia,
      turno: enfermera.turno
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingEnfermera = null;
    this.enfermeraForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.enfermeraForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveEnfermera(): void {
    if (this.enfermeraForm.invalid) {
      this.enfermeraForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.enfermeraForm.value;

    if (this.editingEnfermera) {
      const updateData: UpdateEnfermeraRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        numero_licencia: formValue.numero_licencia,
        turno: formValue.turno
      };
      
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.enfermeraService.updateEnfermera(this.editingEnfermera.id, updateData).subscribe({
        next: () => {
          this.loadEnfermeras();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar enfermera:', error);
          let errorMessage = 'Error al actualizar la enfermera';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += ': ' + error.error;
            } else if (error.error.detail) {
              if (Array.isArray(error.error.detail)) {
                errorMessage += ': ' + error.error.detail.map((e: any) => {
                  if (typeof e === 'string') return e;
                  return `${e.loc?.join('.') || 'campo'}: ${e.msg || e.message || JSON.stringify(e)}`;
                }).join(', ');
              } else {
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
    } else {
      const newEnfermera: CreateEnfermeraRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        numero_licencia: formValue.numero_licencia,
        turno: formValue.turno,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.enfermeraService.createEnfermera(newEnfermera).subscribe({
        next: () => {
          this.loadEnfermeras();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear enfermera:', error);
          let errorMessage = 'Error al crear la enfermera';
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

  inactivarEnfermera(enfermera: Enfermera): void {
    if (confirm(`¿Está seguro de inactivar la enfermera "${enfermera.nombre} ${enfermera.apellido}"?`)) {
      this.enfermeraService.inactivarEnfermera(enfermera.id).subscribe({
        next: () => {
          this.loadEnfermeras();
          alert('Enfermera inactivada exitosamente');
        },
        error: (error) => {
          console.error('Error al inactivar enfermera:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido';
          alert('Error al inactivar enfermera: ' + errorMessage);
        }
      });
    }
  }

  reactivarEnfermera(enfermera: Enfermera): void {
    if (confirm(`¿Está seguro de reactivar la enfermera "${enfermera.nombre} ${enfermera.apellido}"?`)) {
      this.enfermeraService.reactivarEnfermera(enfermera.id).subscribe({
        next: () => {
          this.loadEnfermeras();
          alert('Enfermera reactivada exitosamente');
        },
        error: (error) => {
          console.error('Error al reactivar enfermera:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido';
          alert('Error al reactivar enfermera: ' + errorMessage);
        }
      });
    }
  }

  eliminarEnfermeraPermanente(enfermera: Enfermera): void {
    if (confirm(`¿Está seguro de eliminar PERMANENTEMENTE la enfermera "${enfermera.nombre} ${enfermera.apellido}"? Esta acción no se puede deshacer.`)) {
      this.enfermeraService.eliminarEnfermeraPermanente(enfermera.id).subscribe({
        next: () => {
          this.loadEnfermeras();
          alert('Enfermera eliminada permanentemente');
        },
        error: (error) => {
          console.error('Error al eliminar enfermera:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido';
          alert('Error al eliminar enfermera: ' + errorMessage);
        }
      });
    }
  }

  deleteEnfermera(enfermera: Enfermera): void {
    this.inactivarEnfermera(enfermera);
  }
}
