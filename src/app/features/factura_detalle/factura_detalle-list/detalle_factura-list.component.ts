import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { FacturaDetalleService } from '../../../core/services/factura_detalle.service';
import { FacturaDetalle, CreateFacturaDetalleRequest, UpdateFacturaDetalleRequest, FacturaDetalleFilters } from '../../../shared/models/factura_detalle.model';

@Component({
  selector: 'app-factura-detalle-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalle_factura-list.component.html',
  styleUrls: ['./detalle_factura-list.component.scss']
})
export class FacturaDetalleListComponent implements OnInit {
  detalles: FacturaDetalle[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: FacturaDetalleFilters = {};
  showModal = false;
  editingDetalle: FacturaDetalle | null = null;
  detalleForm: FormGroup;

  constructor(private service: FacturaDetalleService, private fb: FormBuilder) {
    this.detalleForm = this.fb.group({
      factura_id: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [1, Validators.required],
      precio_unitario: [0, Validators.required],
      subtotal: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit(): void { this.loadDetalles(); }

  loadDetalles(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getFacturasDetalles(pagination, this.filters).subscribe({
      next: (data: any) => { this.detalles = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadDetalles(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadDetalles(); }
  goToPage(page: number): void { this.currentPage = page; this.loadDetalles(); }

  openCreateModal(): void { this.editingDetalle = null; this.detalleForm.reset(); this.showModal = true; }
  editDetalle(detalle: FacturaDetalle): void { this.editingDetalle = detalle; this.detalleForm.patchValue(detalle); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editingDetalle = null; this.detalleForm.reset(); }

  saveDetalle(): void {
    if (this.detalleForm.invalid) { this.detalleForm.markAllAsTouched(); return; }
    const formValue = this.detalleForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingDetalle) {
      const updateData: UpdateFacturaDetalleRequest = {
        descripcion: formValue.descripcion,
        cantidad: formValue.cantidad,
        precio_unitario: formValue.precio_unitario,
        subtotal: formValue.cantidad * formValue.precio_unitario,
        id_usuario_edicion: usuarioId
      };
      this.service.updateFacturaDetalle(this.editingDetalle.id, updateData).subscribe(() => { this.loadDetalles(); this.closeModal(); });
    } else {
      const createData: CreateFacturaDetalleRequest = {
        descripcion: formValue.descripcion,
        cantidad: formValue.cantidad,
        precio_unitario: formValue.precio_unitario,
        subtotal: formValue.cantidad * formValue.precio_unitario,
        factura_id: formValue.factura_id,
        id_usuario_creacion: usuarioId
      };
      this.service.createFacturaDetalle(createData).subscribe(() => { this.loadDetalles(); this.closeModal(); });
    }
  }

  deleteDetalle(detalle: FacturaDetalle): void { if(confirm('¿Desea eliminar este detalle?')) this.service.deleteFacturaDetalle(detalle.id).subscribe(() => this.loadDetalles()); }
}