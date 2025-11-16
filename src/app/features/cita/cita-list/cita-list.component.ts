import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, CreateCitaRequest, UpdateCitaRequest, CitaFilters } from '../../../shared/models/cita.model';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cita-list.component.html',
  styleUrls: ['./cita-list.component.scss']
})
export class CitaListComponent implements OnInit {
  citas: Cita[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: CitaFilters = {};
  showModal = false;
  editingCita: Cita | null = null;
  citaForm: FormGroup;

  constructor(private service: CitaService, private fb: FormBuilder) {
    this.citaForm = this.fb.group({
      fecha_cita: ['', Validators.required],
      motivo: ['', Validators.required],
      notas: [''],
      paciente_id: ['', Validators.required],
      medico_id: ['', Validators.required]
    });
  }

  ngOnInit(): void { this.loadCitas(); }

  loadCitas(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getCitas(pagination, this.filters).subscribe({
      next: data => { this.citas = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadCitas(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadCitas(); }
  goToPage(page: number): void { this.currentPage = page; this.loadCitas(); }

  openCreateModal(): void { this.editingCita = null; this.citaForm.reset(); this.showModal = true; }
  
  editCita(cita: Cita): void { 
    this.editingCita = cita; 
    this.citaForm.patchValue(cita); 
    this.showModal = true; 
  }
  
  closeModal(): void { this.showModal = false; this.editingCita = null; this.citaForm.reset(); }

  saveCita(): void {
    if (this.citaForm.invalid) { this.citaForm.markAllAsTouched(); return; }
    const formValue = this.citaForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingCita) {
      const updateData: UpdateCitaRequest = { 
        ...formValue,
        id_usuario_edicion: usuarioId
      };
      this.service.updateCita(this.editingCita.id, updateData).subscribe(() => { this.loadCitas(); this.closeModal(); });
    } else {
      const createData: CreateCitaRequest = { 
        ...formValue,
        id_usuario_creacion: usuarioId
      };
      this.service.createCita(createData).subscribe(() => { this.loadCitas(); this.closeModal(); });
    }
  }

  deleteCita(cita: Cita): void { if(confirm('¿Eliminar cita?')) this.service.deleteCita(cita.id).subscribe(() => this.loadCitas()); }
}