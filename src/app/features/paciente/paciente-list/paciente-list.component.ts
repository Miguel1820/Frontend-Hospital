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

  filters: PacienteFilters = {
    primer_nombre: '',
    apellido: '',
    email: '',
    activo: ''
  };

  showModal = false;
  editingPaciente: Paciente | null = null;

  pacienteForm: any = {
    primer_nombre: '',
    segundo_nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    direccion: '',
    activo: true,
    id_usuario_creacion: "11111111-1111-1111-1111-111111111111"
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

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPacientes();
  }

  clearFilters(): void {
    this.filters = {
      primer_nombre: '',
      apellido: '',
      email: '',
      activo: ''
    };
    this.loadPacientes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPacientes();
  }

  openCreateModal(): void {
    this.editingPaciente = null;
    this.pacienteForm = {
      primer_nombre: '',
      segundo_nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      direccion: '',
      activo: true,
      id_usuario_creacion: "11111111-1111-1111-1111-111111111111"
    };
    this.showModal = true;
  }

  editPaciente(p: Paciente): void {
    this.editingPaciente = p;
    this.pacienteForm = {
      primer_nombre: p.primer_nombre,
      segundo_nombre: p.segundo_nombre || '',
      apellido: p.apellido,
      email: p.email,
      telefono: p.telefono || '',
      fecha_nacimiento: p.fecha_nacimiento,
      direccion: p.direccion || '',
      activo: p.activo,
      id_usuario_creacion: p.id_usuario_creacion
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  savePaciente(): void {

    if (!this.pacienteForm.primer_nombre.trim() ||
        !this.pacienteForm.apellido.trim() ||
        !this.pacienteForm.email.trim()) {
      alert('Primer nombre, apellido y email son obligatorios');
      return;
    }

    // Forzamos UUID por ahora
    this.pacienteForm.id_usuario_creacion = "11111111-1111-1111-1111-111111111111";

    console.log("Payload enviado al backend:", this.pacienteForm);

    if (this.editingPaciente) {
      this.pacienteService.update(Number(this.editingPaciente.id), this.pacienteForm).subscribe({
        next: (resp) => {
          console.log('Respuesta backend (update):', resp);
          this.loadPacientes();
          this.closeModal();
        },
        error: (err) => console.error('Error en update:', err)
      });

    } else {
      this.pacienteService.create(this.pacienteForm).subscribe({
        next: (resp) => {
          console.log('Respuesta backend (create):', resp);
          this.loadPacientes();
          this.closeModal();
        },
        error: (err) => console.error('Error en create:', err)
      });
    }
  }

  deletePaciente(p: Paciente): void {
    if (confirm(`¿Seguro que deseas eliminar a ${p.primer_nombre}?`)) {
      this.pacienteService.delete(Number(p.id)).subscribe({
        next: () => this.loadPacientes()
      });
    }
  }
}