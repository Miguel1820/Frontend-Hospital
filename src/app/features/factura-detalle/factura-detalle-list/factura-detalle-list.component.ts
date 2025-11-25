import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { decimalValidator, getErrorMessage, maxLengthValidator, minLengthValidator, nonNegativeNumberValidator, positiveNumberValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { FacturaDetalleService } from '../../../core/services/factura-detalle.service';
import { FacturaService } from '../../../core/services/factura.service';
import { CreateFacturaDetalleRequest, FacturaDetalle, FacturaDetalleFilters, UpdateFacturaDetalleRequest } from '../../../shared/models/factura-detalle.model';
import { Factura } from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-detalle-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './factura-detalle-list.component.html',
  styleUrl: './factura-detalle-list.component.scss'
})
export class FacturaDetalleListComponent implements OnInit {
  detalles: FacturaDetalle[] = [];
  facturas: Factura[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: FacturaDetalleFilters = {};
  showModal = false;
  editingDetalle: FacturaDetalle | null = null;
  detalleForm!: FormGroup;

  constructor(
    private facturaDetalleService: FacturaDetalleService,
    private facturaService: FacturaService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.detalleForm = this.fb.group({
      descripcion: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(255)]],
      cantidad: [1, [Validators.required, positiveNumberValidator()]],
      precio_unitario: [0, [Validators.required, nonNegativeNumberValidator()]],
      subtotal: [{ value: 0, disabled: true }],
      factura_id: ['', [Validators.required]]
    });

    // Calcular subtotal cuando cambien cantidad o precio_unitario
    this.detalleForm.get('cantidad')?.valueChanges.subscribe(() => this.calcularSubtotal());
    this.detalleForm.get('precio_unitario')?.valueChanges.subscribe(() => this.calcularSubtotal());
  }

  calcularSubtotal(): void {
    const cantidad = parseFloat(this.detalleForm.get('cantidad')?.value || '0');
    const precioUnitario = parseFloat(this.detalleForm.get('precio_unitario')?.value || '0');
    const subtotal = cantidad * precioUnitario;
    this.detalleForm.patchValue({ subtotal }, { emitEvent: false });
  }

  ngOnInit(): void {
    this.loadDetalles();
    this.loadFacturas();
  }

  loadDetalles(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.facturaDetalleService.getFacturasDetalle(pagination, this.filters).subscribe({
      next: (response) => {
        this.detalles = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles de factura:', error);
        alert('Error al cargar detalles de factura');
        this.loading = false;
      }
    });
  }

  loadFacturas(): void {
    this.facturaService.getFacturas({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.facturas = response.data || [];
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDetalles();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadDetalles();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadDetalles();
    }
  }

  openCreateModal(): void {
    this.editingDetalle = null;
    this.detalleForm.reset({
      descripcion: '',
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0,
      factura_id: ''
    });
    this.detalleForm.get('subtotal')?.disable();
    this.showModal = true;
  }

  editDetalle(detalle: FacturaDetalle): void {
    this.editingDetalle = detalle;
    this.detalleForm.patchValue({
      descripcion: detalle.descripcion,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      subtotal: detalle.subtotal,
      factura_id: detalle.factura_id
    });
    this.detalleForm.get('subtotal')?.disable();
    this.detalleForm.get('factura_id')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingDetalle = null;
    this.detalleForm.reset();
    this.detalleForm.get('factura_id')?.enable();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.detalleForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveDetalle(): void {
    if (this.detalleForm.invalid) {
      this.detalleForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    this.calcularSubtotal();
    const formValue = this.detalleForm.getRawValue();

    if (this.editingDetalle) {
      const updateData: UpdateFacturaDetalleRequest = {
        descripcion: formValue.descripcion,
        cantidad: parseFloat(formValue.cantidad),
        precio_unitario: parseFloat(formValue.precio_unitario),
        subtotal: parseFloat(formValue.subtotal)
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.facturaDetalleService.updateFacturaDetalle(this.editingDetalle.id, updateData).subscribe({
        next: () => {
          this.loadDetalles();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar detalle de factura:', error);
          alert('Error al actualizar el detalle de factura');
        }
      });
    } else {
      const newDetalle: CreateFacturaDetalleRequest = {
        descripcion: formValue.descripcion,
        cantidad: parseFloat(formValue.cantidad),
        precio_unitario: parseFloat(formValue.precio_unitario),
        subtotal: parseFloat(formValue.subtotal),
        factura_id: formValue.factura_id,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.facturaDetalleService.createFacturaDetalle(newDetalle).subscribe({
        next: () => {
          this.loadDetalles();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear detalle de factura:', error);
          let errorMessage = 'Error al crear el detalle de factura';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage += ': ' + error.error;
            } else if (error.error.detail) {
              errorMessage += ': ' + error.error.detail;
            } else if (error.error.message) {
              errorMessage += ': ' + error.error.message;
            } else if (Array.isArray(error.error)) {
              errorMessage += ': ' + error.error.map((e: any) => e.message || e.msg || JSON.stringify(e)).join(', ');
            }
          } else if (error.message) {
            errorMessage += ': ' + error.message;
          }
          alert(errorMessage);
        }
      });
    }
  }

  deleteDetalle(detalle: FacturaDetalle): void {
    if (confirm(`¿Está seguro de eliminar este detalle?`)) {
      this.facturaDetalleService.deleteFacturaDetalle(detalle.id).subscribe({
        next: () => {
          this.loadDetalles();
        },
        error: (error) => {
          console.error('Error al eliminar detalle de factura:', error);
          alert('Error al eliminar el detalle de factura');
        }
      });
    }
  }

  getFacturaNumero(facturaId: string): string {
    const factura = this.facturas.find(f => f.id === facturaId);
    return factura ? factura.numero_factura : 'N/A';
  }
}
