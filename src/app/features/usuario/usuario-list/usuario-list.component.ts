import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  
  // Modal properties
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm = {
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    activo: true
  };

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // Agregar un dato dummy para pruebas
    this.usuarios = [{
      id: 1,
      email: 'admin@example.com',
      nombre: 'Administrador',
      apellido: 'Sistema',
      activo: true,
      ultimo_acceso: new Date().toISOString(),
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    }];
    this.totalPages = 1;
    // this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.usuarioService.getUsuarios(pagination, this.filters).subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
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
    this.usuarioForm = {
      email: '',
      nombre: '',
      apellido: '',
      password: '',
      activo: true
    };
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm = {
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      password: '',
      activo: usuario.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
    this.usuarioForm = {
      email: '',
      nombre: '',
      apellido: '',
      password: '',
      activo: true
    };
  }

  saveUsuario(): void {
    if (!this.usuarioForm.email.trim() || !this.usuarioForm.nombre.trim() || !this.usuarioForm.apellido.trim()) {
      alert('Email, nombre y apellido son requeridos');
      return;
    }

    if (!this.editingUsuario && !this.usuarioForm.password.trim()) {
      alert('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (this.editingUsuario) {
      // Actualizar usuario existente
      const updateData: any = {
        email: this.usuarioForm.email,
        nombre: this.usuarioForm.nombre,
        apellido: this.usuarioForm.apellido,
        activo: this.usuarioForm.activo
      };
      
      // Solo incluir password si se proporcionó
      if (this.usuarioForm.password.trim()) {
        updateData.password = this.usuarioForm.password;
      }
      
      this.usuarioService.updateUsuario(this.editingUsuario.id, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      // Crear nuevo usuario
      const newUsuario = {
        email: this.usuarioForm.email,
        nombre: this.usuarioForm.nombre,
        apellido: this.usuarioForm.apellido,
        password: this.usuarioForm.password,
        activo: this.usuarioForm.activo
      };
      
      this.usuarioService.createUsuario(newUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          alert('Error al crear el usuario');
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar el usuario "${usuario.email}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
