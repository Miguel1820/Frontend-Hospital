import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { emailValidator, getErrorMessage, phoneValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest, Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: UsuarioFilters = {};
  includeInactive = false;
  
  // Modal properties
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm!: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nombre_usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, emailValidator()]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['', [phoneValidator()]],
      es_admin: [false]
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    // Limpiar filtros vacíos antes de enviar
    const cleanFilters: UsuarioFilters = {};
    if (this.filters.email && this.filters.email.trim() !== '') {
      cleanFilters.email = this.filters.email.trim();
    }
    if (this.filters.nombre && this.filters.nombre.trim() !== '') {
      cleanFilters.nombre = this.filters.nombre.trim();
    }

    this.usuarioService.getUsuarios(pagination, Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined, this.includeInactive).subscribe({
      next: (response) => {
        this.usuarios = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        const errorMessage = error.error?.detail || error.error?.message || error.message || 'Error desconocido';
        alert('Error al cargar usuarios: ' + errorMessage);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.includeInactive = false;
    this.currentPage = 1;
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm.reset({
      nombre: '',
      nombre_usuario: '',
      email: '',
      contrasena: '',
      telefono: '',
      es_admin: false
    });
    this.usuarioForm.get('contrasena')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      nombre_usuario: (usuario as any).nombre_usuario || '',
      email: usuario.email,
      contrasena: '',
      telefono: (usuario as any).telefono || '',
      es_admin: (usuario as any).es_admin || false
    });
    this.usuarioForm.get('contrasena')?.clearValidators();
    this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm.reset({
      nombre: '',
      nombre_usuario: '',
      email: '',
      contrasena: '',
      telefono: '',
      es_admin: false
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.usuarioForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    const formValue = this.usuarioForm.value;

    if (this.editingUsuario) {
      const updateData: any = {
        nombre: formValue.nombre,
        nombre_usuario: formValue.nombre_usuario,
        email: formValue.email,
        telefono: formValue.telefono || undefined,
        es_admin: formValue.es_admin
      };
      
      const idUsuarioEdicion = this.authService.getValidUUIDForEdition();
      if (idUsuarioEdicion) {
        updateData.id_usuario_edicion = idUsuarioEdicion;
      }
      
      const usuarioId = String(this.editingUsuario.id);
      this.usuarioService.updateUsuario(usuarioId, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          let errorMessage = 'Error al actualizar el usuario';
          
          if (error.error?.detail) {
            const detail = error.error.detail;
            if (typeof detail === 'string') {
              errorMessage = detail;
            } else if (detail.message) {
              errorMessage = detail.message;
            } else if (detail.error_type && detail.message) {
              errorMessage = `${detail.error_type}: ${detail.message}`;
            } else {
              errorMessage = JSON.stringify(detail);
            }
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          alert(errorMessage);
        }
      });
    } else {
      const newUsuario: CreateUsuarioRequest = {
        nombre: formValue.nombre,
        nombre_usuario: formValue.nombre_usuario,
        email: formValue.email,
        contraseña: formValue.contrasena,
        telefono: formValue.telefono || undefined,
        es_admin: formValue.es_admin,
        id_usuario_creacion: this.authService.getValidUUIDForCreation() || undefined
      };
      
      this.usuarioService.createUsuario(newUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          let errorMessage = 'Error al crear el usuario';
          
          if (error.error?.detail) {
            const detail = error.error.detail;
            if (typeof detail === 'string') {
              errorMessage = detail;
            } else if (detail.message) {
              errorMessage = detail.message;
            } else if (detail.error_type && detail.message) {
              errorMessage = `${detail.error_type}: ${detail.message}`;
            } else {
              errorMessage = JSON.stringify(detail);
            }
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  inactivarUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de inactivar el usuario "${usuario.email}"?`)) {
      const usuarioId = String(usuario.id);
      this.usuarioService.inactivarUsuario(usuarioId).subscribe({
        next: (response) => {
          console.log('Usuario inactivado exitosamente:', response);
          this.loadUsuarios();
          alert('Usuario inactivado exitosamente');
        },
        error: (error) => {
          console.error('Error al inactivar usuario:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido al inactivar usuario';
          alert('Error al inactivar usuario: ' + errorMessage);
        }
      });
    }
  }

  reactivarUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de reactivar el usuario "${usuario.email}"?`)) {
      const usuarioId = String(usuario.id);
      this.usuarioService.reactivarUsuario(usuarioId).subscribe({
        next: (response) => {
          console.log('Usuario reactivado exitosamente:', response);
          this.loadUsuarios();
          alert('Usuario reactivado exitosamente');
        },
        error: (error) => {
          console.error('Error al reactivar usuario:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido al reactivar usuario';
          alert('Error al reactivar usuario: ' + errorMessage);
        }
      });
    }
  }

  eliminarUsuarioPermanente(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar PERMANENTEMENTE el usuario "${usuario.email}"? Esta acción no se puede deshacer.`)) {
      const usuarioId = String(usuario.id);
      this.usuarioService.eliminarUsuarioPermanente(usuarioId).subscribe({
        next: (response) => {
          console.log('Usuario eliminado permanentemente:', response);
          this.loadUsuarios();
          alert('Usuario eliminado permanentemente');
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          const errorMessage = error.error?.detail || error.error?.mensaje || error.message || 'Error desconocido al eliminar usuario';
          alert('Error al eliminar usuario: ' + errorMessage);
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    this.inactivarUsuario(usuario);
  }
}
