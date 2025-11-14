import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../../core/services/paciente.service';
import { Paciente } from '../../../shared/models/paciente.model';
import { UUIDPipe } from '../../../shared/pipes/uuid.pipe';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UUIDPipe],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.scss']
})
export class PacienteListComponent implements OnInit {

  pacientes: Paciente[] = [];
  loading = false;

  // Filtros
  filters = {
    nombre: '',
    documento: '',
    activo: ''
  };

  // Paginación
  currentPage = 1;
  totalPages = 1;

  // Modal
  showModal = false;
  editingPaciente: Paciente | null = null;

  pacienteForm = {
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    email: '',
    activo: true
  };

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  /** 🔹 Cargar pacientes */
  loadPacientes(): void {
    this.loading = true;

    this.pacienteService.getPacientes().subscribe({
      next: (pacientes) => {
        // Filtros (simple filtrado en front)
        let result = pacientes;

        if (this.filters.nombre.trim()) {
          result = result.filter(p =>
            `${p.nombre} ${p.apellido}`.toLowerCase().includes(this.filters.nombre.toLowerCase())
          );
        }

        if (this.filters.documento.trim()) {
          result = result.filter(p =>
            p.documento.includes(this.filters.documento)
          );
        }

        if (this.filters.activo !== '') {
          const isActive = this.filters.activo === 'true';
          result = result.filter(p => p.activo === isActive);
        }

        // Paginación (10 por página)
        const pageSize = 10;
        this.totalPages = Math.ceil(result.length / pageSize);

        const start = (this.currentPage - 1) * pageSize;
        this.pacientes = result.slice(start, start + pageSize);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.loading = false;
      }
    });
  }

  /** 🔹 Cambios de filtros */
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPacientes();
  }

  clearFilters(): void {
    this.filters = {
      nombre: '',
      documento: '',
      activo: ''
    };
    this.currentPage = 1;
    this.loadPacientes();
  }

  /** 🔹 Paginación */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPacientes();
  }

  /** 🔹 Abrir modal */
  openCreateModal(): void {
    this.editingPaciente = null;
    this.pacienteForm = {
      nombre: '',
      apellido: '',
      documento: '',
      telefono: '',
      email: '',
      activo: true
    };
    this.showModal = true;
  }

  /** 🔹 Editar modal */
  editPaciente(paciente: Paciente): void {
    this.editingPaciente = paciente;
    this.pacienteForm = {
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      documento: paciente.documento,
      telefono: paciente.telefono || '',
      email: paciente.email || '',
      activo: paciente.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPaciente = null;
  }

  /** 🔹 Crear / actualizar paciente */
  savePaciente(): void {
    if (!this.pacienteForm.nombre.trim() ||
        !this.pacienteForm.apellido.trim() ||
        !this.pacienteForm.documento.trim()) {
      alert('Nombre, apellido y documento son obligatorios');
      return;
    }

    const data = {
      ...this.pacienteForm,
      fecha_nacimiento: '2000-01-01',
      direccion: 'Sin dirección',
      id_usuario_creacion: '00000000-0000-0000-0000-000000000000'
    };

    if (this.editingPaciente) {
      const updateData = {
        ...this.pacienteForm,
        id_usuario_edicion: '00000000-0000-0000-0000-000000000000'
      };

      this.pacienteService.updatePaciente(this.editingPaciente.id, updateData).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        },
        error: () => alert('Error al actualizar paciente')
      });

    } else {
      this.pacienteService.createPaciente(data).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        },
        error: () => alert('Error al crear paciente')
      });
    }
  }

  /** 🔹 Eliminar */
  deletePaciente(paciente: Paciente): void {
    if (confirm(`¿Eliminar a ${paciente.nombre} ${paciente.apellido}?`)) {
      this.pacienteService.deletePaciente(paciente.id).subscribe({
        next: () => this.loadPacientes(),
        error: () => alert('Error al eliminar paciente')
      });
    }
  }
}