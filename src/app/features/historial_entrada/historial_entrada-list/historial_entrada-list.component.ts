import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { HistorialEntradaService } from '../../../core/services/historial_entrada.service';
import { HistorialEntrada, CreateHistorialEntradaRequest, UpdateHistorialEntradaRequest, HistorialEntradaFilters } from '../../../shared/models/historial_entrada.model';

@Component({
  selector: 'app-historial-entrada-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historial_entrada-list.component.html',
  styleUrls: ['./historial_entrada-list.component.scss']
})
export class HistorialEntradaListComponent implements OnInit {
  entradas: HistorialEntrada[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: HistorialEntradaFilters = {};
  showModal = false;
  editingEntrada: HistorialEntrada | null = null;
  entradaForm: FormGroup;

  constructor(private service: HistorialEntradaService, private fb: FormBuilder) {
    this.entradaForm = this.fb.group({
      historial_medico_id: ['', Validators.required],
      medico_id: ['', Validators.required],
      fecha_consulta: ['', Validators.required],
      diagnostico: ['', Validators.required],
      tratamiento: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void { this.loadEntradas(); }
  loadEntradas(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getHistorialesEntradas(pagination, this.filters).subscribe({
      next: (data: any) => { this.entradas = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadEntradas(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadEntradas(); }
  goToPage(page: number): void { this.currentPage = page; this.loadEntradas(); }

  openCreateModal(): void { this.editingEntrada = null; this.entradaForm.reset(); this.showModal = true; }
  editEntrada(item: HistorialEntrada): void { this.editingEntrada = item; this.entradaForm.patchValue(item); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingEntrada = null; this.entradaForm.reset(); }

  saveEntrada(): void {
    if (this.entradaForm.invalid) { this.entradaForm.markAllAsTouched(); return; }
    const formValue = this.entradaForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingEntrada) {
      const updateData: UpdateHistorialEntradaRequest = {
        fecha_consulta: formValue.fecha_consulta,
        diagnostico: formValue.diagnostico,
        tratamiento: formValue.tratamiento,
        observaciones: formValue.observaciones,
        id_usuario_edicion: usuarioId
      };
      this.service.updateHistorialEntrada(this.editingEntrada.id, updateData).subscribe(() => { this.loadEntradas(); this.closeModal(); });
    } else {
      const createData: CreateHistorialEntradaRequest = {
        fecha_consulta: formValue.fecha_consulta,
        diagnostico: formValue.diagnostico,
        tratamiento: formValue.tratamiento,
        observaciones: formValue.observaciones,
        historial_medico_id: formValue.historial_medico_id,
        medico_id: formValue.medico_id,
        id_usuario_creacion: usuarioId
      };
      this.service.createHistorialEntrada(createData).subscribe(() => { this.loadEntradas(); this.closeModal(); });
    }
  }

  deleteEntrada(item: HistorialEntrada): void { if(confirm('¿Desea eliminar este registro?')) this.service.deleteHistorialEntrada(item.id).subscribe(() => this.loadEntradas()); }
}