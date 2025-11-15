import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../../core/services/paciente.service';
import { Paciente, PacienteFilters } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  pacienteForm = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    activo: true,
  };

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading = true;

    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.totalPages = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar pacientes');
      }
    });
  }

  onFilterChange(): void {}

  clearFilters(): void {
    this.filters = {};
  }

  goToPage(page: number): void {}

  openCreateModal(): void {
    this.editingPaciente = null;
    this.pacienteForm = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      direccion: '',
      activo: true,
    };
    this.showModal = true;
  }

  editPaciente(p: Paciente): void {
    this.editingPaciente = p;
    this.pacienteForm = {
      nombre: p.nombre,
      apellido: p.apellido,
      email: p.email,
      telefono: p.telefono || '',
      fecha_nacimiento: p.fecha_nacimiento,
      direccion: p.direccion || '',
      activo: p.activo
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePaciente(): void {
    if (!this.pacienteForm.nombre.trim() || !this.pacienteForm.apellido.trim() || !this.pacienteForm.email.trim()) {
      alert('Nombre, apellido y email son obligatorios');
      return;
    }

    if (this.editingPaciente) {
      this.pacienteService.update(this.editingPaciente.id, this.pacienteForm).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        }
      });
    } else {
      this.pacienteService.create(this.pacienteForm).subscribe({
        next: () => {
          this.loadPacientes();
          this.closeModal();
        }
      });
    }
  }

  deletePaciente(p: Paciente): void {
    if (confirm(`¿Seguro que deseas eliminar a ${p.nombre}?`)) {
      this.pacienteService.delete(p.id).subscribe({
        next: () => {
          this.loadPacientes();
        }
      });
    }
  }
}