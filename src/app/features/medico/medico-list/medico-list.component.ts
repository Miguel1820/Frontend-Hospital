import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { MedicoService } from '../../../core/services/medico.service';
import { CreateMedicoRequest, UpdateMedicoRequest, Medico, MedicoFilters } from '../../../shared/models/medico.model';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './medico-list.component.html',
  styleUrls: ['./medico-list.component.scss']
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
  medicoForm: FormGroup;

  constructor(private medicoService: MedicoService, private fb: FormBuilder) {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      especialidad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  ngOnInit(): void { this.loadMedicos(); }
  loadMedicos(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.medicoService.getMedicos(pagination, this.filters).subscribe({
      next: (data) => { this.medicos = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: (error) => { console.error(error); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadMedicos(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadMedicos(); }
  goToPage(page: number): void { this.currentPage = page; this.loadMedicos(); }

  openCreateModal(): void { this.editingMedico = null; this.medicoForm.reset(); this.showModal = true; }
  editMedico(medico: Medico): void { this.editingMedico = medico; this.medicoForm.patchValue(medico); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingMedico = null; this.medicoForm.reset(); }

  saveMedico(): void {
    if (this.medicoForm.invalid) { this.medicoForm.markAllAsTouched(); return; }
    const formValue = this.medicoForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingMedico) {
      const updateData: UpdateMedicoRequest = { 
        ...formValue,
        id_usuario_edicion: usuarioId
      };
      this.medicoService.updateMedico(this.editingMedico.id, updateData).subscribe(() => { this.loadMedicos(); this.closeModal(); });
    } else {
      const createData: CreateMedicoRequest = { 
        ...formValue,
        id_usuario_creacion: usuarioId
      };
      this.medicoService.createMedico(createData).subscribe(() => { this.loadMedicos(); this.closeModal(); });
    }
  }

  deleteMedico(medico: Medico): void { if(confirm('¿Desea eliminar este médico?')) this.medicoService.deleteMedico(medico.id).subscribe(() => this.loadMedicos()); }
  desactivarMedico(medico: Medico): void { if(confirm('¿Desea desactivar este médico?')) this.medicoService.desactivarMedico(medico.id).subscribe(() => this.loadMedicos()); }
}