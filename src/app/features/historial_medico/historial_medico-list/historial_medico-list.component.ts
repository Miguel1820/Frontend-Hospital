import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { HistorialMedicoService } from '../../../core/services/historial_medico.service';
import { HistorialMedico, CreateHistorialMedicoRequest, UpdateHistorialMedicoRequest, HistorialMedicoFilters } from '../../../shared/models/historial_medico.model';

@Component({
  selector: 'app-historial-medico-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historial_medico-list.component.html',
  styleUrls: ['./historial_medico-list.component.scss']
})
export class HistorialMedicoListComponent implements OnInit {
  historiales: HistorialMedico[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: HistorialMedicoFilters = {};
  showModal = false;
  editingHistorial: HistorialMedico | null = null;
  historialForm: FormGroup;

  constructor(private service: HistorialMedicoService, private fb: FormBuilder) {
    this.historialForm = this.fb.group({
      numero_historial: ['', Validators.required],
      notas_generales: [''],
      paciente_id: ['', Validators.required]
    });
  }

  ngOnInit(): void { this.loadHistoriales(); }
  loadHistoriales(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getHistorialesMedicos(pagination, this.filters).subscribe({
      next: (data: any) => { this.historiales = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadHistoriales(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadHistoriales(); }
  goToPage(page: number): void { this.currentPage = page; this.loadHistoriales(); }

  openCreateModal(): void { this.editingHistorial = null; this.historialForm.reset(); this.showModal = true; }
  editHistorial(item: HistorialMedico): void { this.editingHistorial = item; this.historialForm.patchValue(item); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingHistorial = null; this.historialForm.reset(); }

  saveHistorial(): void {
    if (this.historialForm.invalid) { this.historialForm.markAllAsTouched(); return; }
    const formValue = this.historialForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingHistorial) {
      const updateData: UpdateHistorialMedicoRequest = { 
        ...formValue,
        id_usuario_edicion: usuarioId
      };
      this.service.updateHistorialMedico(this.editingHistorial.id, updateData).subscribe(() => { this.loadHistoriales(); this.closeModal(); });
    } else {
      const createData: CreateHistorialMedicoRequest = { 
        ...formValue,
        id_usuario_creacion: usuarioId
      };
      this.service.createHistorialMedico(createData).subscribe(() => { this.loadHistoriales(); this.closeModal(); });
    }
  }

  deleteHistorial(item: HistorialMedico): void { if(confirm('¿Desea eliminar este registro?')) this.service.deleteHistorialMedico(item.id).subscribe(() => this.loadHistoriales()); }
}