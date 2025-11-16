import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura, FacturaFilters, CreateFacturaRequest, UpdateFacturaRequest } from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: FacturaFilters = {};
  showModal = false;
  editingFactura: Factura | null = null;
  facturaForm: FormGroup;

  constructor(private service: FacturaService, private fb: FormBuilder) {
    this.facturaForm = this.fb.group({
      numero_factura: ['', Validators.required],
      fecha_emision: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required],
      subtotal: [0, Validators.required],
      impuestos: [0],
      total: [0, Validators.required],
      notas: [''],
      paciente_id: ['', Validators.required]
    });
  }

  ngOnInit(): void { this.loadFacturas(); }

  loadFacturas(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.service.getFacturas(pagination, this.filters).subscribe({
      next: data => { this.facturas = data.items || data; this.totalPages = data.totalPages || 1; this.loading = false; },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  onFilterChange(): void { this.currentPage = 1; this.loadFacturas(); }
  clearFilters(): void { this.filters = {}; this.currentPage = 1; this.loadFacturas(); }
  goToPage(page: number): void { this.currentPage = page; this.loadFacturas(); }

  openCreateModal(): void { this.editingFactura = null; this.facturaForm.reset({ impuestos: 0 }); this.showModal = true; }
  
  editFactura(factura: Factura): void { 
    this.editingFactura = factura; 
    this.facturaForm.patchValue(factura); 
    this.showModal = true; 
  }
  
  closeModal(): void { this.showModal = false; this.editingFactura = null; this.facturaForm.reset(); }

  saveFactura(): void {
    if (this.facturaForm.invalid) { this.facturaForm.markAllAsTouched(); return; }
    const formValue = this.facturaForm.value;
    const usuarioId = '123e4567-e89b-12d3-a456-426614174000'; // Placeholder UUID
    
    if (this.editingFactura) {
      const updateData: UpdateFacturaRequest = { 
        ...formValue,
        id_usuario_edicion: usuarioId
      };
      this.service.updateFactura(this.editingFactura.id, updateData).subscribe(() => { this.loadFacturas(); this.closeModal(); });
    } else {
      const createData: CreateFacturaRequest = { 
        ...formValue,
        id_usuario_creacion: usuarioId
      };
      this.service.createFactura(createData).subscribe(() => { this.loadFacturas(); this.closeModal(); });
    }
  }

  deleteFactura(factura: Factura): void { if(confirm('¿Eliminar factura?')) this.service.deleteFactura(factura.id).subscribe(() => this.loadFacturas()); }
}