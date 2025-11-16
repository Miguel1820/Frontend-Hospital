import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { PacienteService } from '../../../core/services/paciente.service';
import { CreatePacienteRequest, UpdatePacienteRequest, Paciente, PacienteFilters } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paciente-list.component.html',
  styleUrls: ['./paciente-list.component.scss']
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
  pacienteForm: FormGroup;

  constructor(private pacienteService: PacienteService, private fb: FormBuilder) {
    this.pacienteForm = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      fecha_nacimiento: ['', Validators.required],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.pacienteService.getPacientes(pagination, this.filters).subscribe({
      next: (data) => {
        this.pacientes = data.items || data; // según tu API
        this.totalPages = data.totalPages || 1;
        this.loading = false;
      },
      error: (error) => { console.error(error); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadPacientes(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadPacientes(); }
  goToPage(page: number): void { this.currentPage = page; this.loadPacientes(); }

  openCreateModal(): void { this.editingPaciente = null; this.pacienteForm.reset(); this.showModal = true; }
  editPaciente(paciente: Paciente): void { this.editingPaciente = paciente; this.pacienteForm.patchValue(paciente); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingPaciente = null; this.pacienteForm.reset(); }

  savePaciente(): void {
    if (this.pacienteForm.invalid) { this.pacienteForm.markAllAsTouched(); return; }
    const formValue = this.pacienteForm.value;

    // Usuario ficticio para la creación (en producción, obtener del usuario autenticado)
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000';

    // Asegurar que telefono y direccion no sean vacíos (el backend los requiere)
    const safePhone = (formValue.telefono || '').trim() || '0000000000';
    const safeAddress = (formValue.direccion || '').trim() || 'S/D';

    // Convertir fecha a formato YYYY-MM-DD si es necesario
    let safeDate = formValue.fecha_nacimiento;
    if (safeDate instanceof Date) {
      const year = safeDate.getFullYear();
      const month = String(safeDate.getMonth() + 1).padStart(2, '0');
      const day = String(safeDate.getDate()).padStart(2, '0');
      safeDate = `${year}-${month}-${day}`;
    }

    if (this.editingPaciente) {
      const updateData: UpdatePacienteRequest = { 
        ...formValue,
        fecha_nacimiento: safeDate,
        telefono: safePhone,
        direccion: safeAddress,
        id_usuario_edicion: usuarioId
      };
      this.pacienteService.updatePaciente(this.editingPaciente.id, updateData).subscribe(() => { this.loadPacientes(); this.closeModal(); });
    } else {
      const createData: CreatePacienteRequest = { 
        ...formValue,
        fecha_nacimiento: safeDate,
        telefono: safePhone,
        direccion: safeAddress,
        id_usuario_creacion: usuarioId
      };
      this.pacienteService.createPaciente(createData).subscribe(() => { this.loadPacientes(); this.closeModal(); });
    }
  }

  deletePaciente(paciente: Paciente): void { if(confirm('¿Desea eliminar este paciente?')) this.pacienteService.deletePaciente(paciente.id).subscribe(() => this.loadPacientes()); }
  desactivarPaciente(paciente: Paciente): void { if(confirm('¿Desea desactivar este paciente?')) this.pacienteService.desactivarPaciente(paciente.id).subscribe(() => this.loadPacientes()); }
}