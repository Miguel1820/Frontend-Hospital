import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { EnfermeraService } from '../../../core/services/enfermera.service';
import { Enfermera, CreateEnfermeraRequest, UpdateEnfermeraRequest, EnfermeraFilters } from '../../../shared/models/enfermera.model';

@Component({
  selector: 'app-enfermera-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enfermera-list.component.html',
  styleUrls: ['./enfermera-list.component.scss']
})
export class EnfermeraListComponent implements OnInit {
  enfermeras: Enfermera[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: EnfermeraFilters = {};
  showModal = false;
  editingEnfermera: Enfermera | null = null;
  enfermeraForm: FormGroup;

  constructor(private service: EnfermeraService, private fb: FormBuilder) {
    this.enfermeraForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      numero_licencia: ['', Validators.required],
      turno: ['mañana', Validators.required]
    });
  }

  ngOnInit(): void { this.loadEnfermeras(); }

  loadEnfermeras(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getEnfermeras(pagination, this.filters).subscribe({
      next: data => { this.enfermeras = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadEnfermeras(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadEnfermeras(); }
  goToPage(page: number): void { this.currentPage = page; this.loadEnfermeras(); }

  openCreateModal(): void { this.editingEnfermera = null; this.enfermeraForm.reset({ turno: 'mañana' }); this.showModal = true; }
  
  editEnfermera(enfermera: Enfermera): void { 
    this.editingEnfermera = enfermera; 
    this.enfermeraForm.patchValue(enfermera); 
    this.showModal = true; 
  }
  
  closeModal(): void { this.showModal = false; this.editingEnfermera = null; this.enfermeraForm.reset(); }

  saveEnfermera(): void {
    if (this.enfermeraForm.invalid) { this.enfermeraForm.markAllAsTouched(); return; }
    const formValue = this.enfermeraForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingEnfermera) {
      const updateData: UpdateEnfermeraRequest = { 
        ...formValue,
        id_usuario_edicion: usuarioId
      };
      this.service.updateEnfermera(this.editingEnfermera.id, updateData).subscribe(() => { this.loadEnfermeras(); this.closeModal(); });
    } else {
      const createData: CreateEnfermeraRequest = { 
        ...formValue,
        id_usuario_creacion: usuarioId
      };
      this.service.createEnfermera(createData).subscribe(() => { this.loadEnfermeras(); this.closeModal(); });
    }
  }

  deleteEnfermera(enfermera: Enfermera): void { if(confirm('¿Eliminar enfermera?')) this.service.deleteEnfermera(enfermera.id).subscribe(() => this.loadEnfermeras()); }
}