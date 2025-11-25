import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { emailValidator, getErrorMessage, maxLengthValidator, minLengthValidator, phoneValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { CreatePacienteRequest, Paciente, PacienteFilters, UpdatePacienteRequest } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.scss'
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: PacienteFilters = {};
  showModal = false;
  editingPaciente: Paciente | null = null;
  pacienteForm!: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      apellido: ['', [Validators.required, minLengthValidator(2), maxLengthValidator(100)]],
      email: ['', [Validators.required, emailValidator()]],
      telefono: ['', [phoneValidator()]],
      fecha_nacimiento: ['', [Validators.required]],
      direccion: ['', [maxLengthValidator(255)]]
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.pacienteService.getPacientes(pagination, this.filters).subscribe({
      next: (response) => {
        this.pacientes = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
        alert('Error al cargar pacientes');
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPacientes();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadPacientes();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPacientes();
    }
  }

  openCreateModal(): void {
    this.editingPaciente = null;
    this.pacienteForm.reset({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      direccion: ''
    });
    this.showModal = true;
  }

  editPaciente(paciente: Paciente): void {
    this.editingPaciente = paciente;
    this.pacienteForm.patchValue({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      email: paciente.email,
      telefono: paciente.telefono || '',
      fecha_nacimiento: paciente.fecha_nacimiento,
      direccion: paciente.direccion || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPaciente = null;
    this.pacienteForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.pacienteForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  savePaciente(): void {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.pacienteForm.value;

    if (this.editingPaciente) {
      const updateData: UpdatePacienteRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        fecha_nacimiento: formValue.fecha_nacimiento,
        direccion: formValue.direccion || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.pacienteService.updatePaciente(this.editingPaciente.id, updateData).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar paciente:', error);
          let errorMessage = 'Error al actualizar el paciente';
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
      const newPaciente: CreatePacienteRequest = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        fecha_nacimiento: formValue.fecha_nacimiento,
        direccion: formValue.direccion || undefined,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.pacienteService.createPaciente(newPaciente).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear paciente:', error);
          let errorMessage = 'Error al crear el paciente';
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

  deletePaciente(paciente: Paciente): void {
    if (confirm(`¿Está seguro de eliminar el paciente "${paciente.nombre} ${paciente.apellido}"?`)) {
      this.pacienteService.deletePaciente(paciente.id).subscribe({
        next: () => {
          this.loadPacientes();
        },
        error: (error) => {
          console.error('Error al eliminar paciente:', error);
          alert('Error al eliminar el paciente');
        }
      });
    }
  }
}
