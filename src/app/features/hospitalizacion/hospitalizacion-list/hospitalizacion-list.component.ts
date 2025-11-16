import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { HospitalizacionService } from '../../../core/services/hospitalizacion.service';
import { Hospitalizacion, CreateHospitalizacionRequest, UpdateHospitalizacionRequest, HospitalizacionFilters } from '../../../shared/models/hospitalizacion.model';

@Component({
  selector: 'app-hospitalizacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './hospitalizacion-list.component.html',
  styleUrls: ['./hospitalizacion-list.component.scss']
})
export class HospitalizacionListComponent implements OnInit {
  hospitalizaciones: Hospitalizacion[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: HospitalizacionFilters = {};
  showModal = false;
  editingHospitalizacion: Hospitalizacion | null = null;
  hospitalizacionForm: FormGroup;

  constructor(private service: HospitalizacionService, private fb: FormBuilder) {
    this.hospitalizacionForm = this.fb.group({
      paciente: ['', Validators.required],
      medico: ['', Validators.required],
      fecha_ingreso: ['', Validators.required],
      fecha_salida: ['']
    });
  }

  ngOnInit(): void { this.loadHospitalizaciones(); }
  loadHospitalizaciones(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getHospitalizaciones(pagination, this.filters).subscribe({
      next: (data) => { this.hospitalizaciones = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadHospitalizaciones(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadHospitalizaciones(); }
  goToPage(page: number): void { this.currentPage = page; this.loadHospitalizaciones(); }

  openCreateModal(): void { this.editingHospitalizacion = null; this.hospitalizacionForm.reset(); this.showModal = true; }
  editHospitalizacion(item: Hospitalizacion): void { this.editingHospitalizacion = item; this.hospitalizacionForm.patchValue(item); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingHospitalizacion = null; this.hospitalizacionForm.reset(); }

  saveHospitalizacion(): void {
    if (this.hospitalizacionForm.invalid) { this.hospitalizacionForm.markAllAsTouched(); return; }
    const formValue = this.hospitalizacionForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingHospitalizacion) {
      const updateData: UpdateHospitalizacionRequest = {
        fecha_ingreso: formValue.fecha_ingreso,
        fecha_salida: formValue.fecha_salida,
        id_usuario_edicion: usuarioId
      };
      this.service.updateHospitalizacion(this.editingHospitalizacion.id, updateData).subscribe(() => { this.loadHospitalizaciones(); this.closeModal(); });
    } else {
      const createData: CreateHospitalizacionRequest = {
        paciente_id: formValue.paciente,
        medico_id: formValue.medico,
        fecha_ingreso: formValue.fecha_ingreso,
        fecha_salida: formValue.fecha_salida,
        motivo: '',
        numero_habitacion: '',
        id_usuario_creacion: usuarioId
      };
      this.service.createHospitalizacion(createData).subscribe(() => { this.loadHospitalizaciones(); this.closeModal(); });
    }
  }

  deleteHospitalizacion(item: Hospitalizacion): void { if(confirm('¿Desea eliminar esta hospitalización?')) this.service.deleteHospitalizacion(item.id).subscribe(() => this.loadHospitalizaciones()); }
  desactivarHospitalizacion(item: Hospitalizacion): void { if(confirm('¿Desea cambiar el estado de esta hospitalización?')) this.service.cambiarEstado(item.id, 'inactivo').subscribe(() => this.loadHospitalizaciones()); }
}