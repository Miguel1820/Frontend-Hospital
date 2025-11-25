import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { decimalValidator, getErrorMessage, maxLengthValidator, minLengthValidator, nonNegativeNumberValidator } from '../../../core/validators/custom-validators';
import { AuthService } from '../../../core/services/auth.service';
import { FacturaService } from '../../../core/services/factura.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { CreateFacturaRequest, Factura, FacturaFilters, UpdateFacturaRequest } from '../../../shared/models/factura.model';
import { Paciente } from '../../../shared/models/paciente.model';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './factura-list.component.html',
  styleUrl: './factura-list.component.scss'
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  pacientes: Paciente[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  filters: FacturaFilters = {};
  showModal = false;
  editingFactura: Factura | null = null;
  facturaForm!: FormGroup;

  constructor(
    private facturaService: FacturaService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.facturaForm = this.fb.group({
      numero_factura: ['', [Validators.required, minLengthValidator(3), maxLengthValidator(50)]],
      fecha_emision: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]],
      subtotal: [0, [Validators.required, nonNegativeNumberValidator()]],
      impuestos: [0, [nonNegativeNumberValidator()]],
      total: [{ value: 0, disabled: true }],
      notas: ['', [maxLengthValidator(500)]],
      paciente_id: ['', [Validators.required]]
    });

    // Calcular total cuando cambien subtotal o impuestos
    this.facturaForm.get('subtotal')?.valueChanges.subscribe(() => this.calcularTotal());
    this.facturaForm.get('impuestos')?.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal(): void {
    const subtotal = parseFloat(this.facturaForm.get('subtotal')?.value || '0');
    const impuestos = parseFloat(this.facturaForm.get('impuestos')?.value || '0');
    const total = subtotal + impuestos;
    this.facturaForm.patchValue({ total }, { emitEvent: false });
  }

  ngOnInit(): void {
    this.loadFacturas();
    this.loadPacientes();
  }

  loadFacturas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.facturaService.getFacturas(pagination, this.filters).subscribe({
      next: (response) => {
        this.facturas = response.data || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar facturas:', error);
        alert('Error al cargar facturas');
        this.loading = false;
      }
    });
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.pacientes = response.data || [];
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadFacturas();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadFacturas();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadFacturas();
    }
  }

  openCreateModal(): void {
    this.editingFactura = null;
    this.facturaForm.reset({
      numero_factura: '',
      fecha_emision: '',
      fecha_vencimiento: '',
      subtotal: 0,
      impuestos: 0,
      total: 0,
      notas: '',
      paciente_id: ''
    });
    this.facturaForm.get('total')?.disable();
    this.showModal = true;
  }

  editFactura(factura: Factura): void {
    this.editingFactura = factura;
    const fechaEmision = new Date(factura.fecha_emision);
    const fechaVencimiento = new Date(factura.fecha_vencimiento);
    this.facturaForm.patchValue({
      numero_factura: factura.numero_factura,
      fecha_emision: fechaEmision.toISOString().slice(0, 16),
      fecha_vencimiento: fechaVencimiento.toISOString().slice(0, 16),
      subtotal: factura.subtotal,
      impuestos: factura.impuestos,
      total: factura.total,
      notas: factura.notas || '',
      paciente_id: factura.paciente_id
    });
    this.facturaForm.get('total')?.disable();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingFactura = null;
    this.facturaForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.facturaForm.get(fieldName);
    return control ? getErrorMessage(control, fieldName) : '';
  }

  saveFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente');
      return;
    }

    this.calcularTotal();
    const formValue = this.facturaForm.getRawValue();

    if (this.editingFactura) {
      const updateData: UpdateFacturaRequest = {
        numero_factura: formValue.numero_factura,
        fecha_emision: formValue.fecha_emision,
        fecha_vencimiento: formValue.fecha_vencimiento,
        subtotal: parseFloat(formValue.subtotal),
        impuestos: parseFloat(formValue.impuestos || '0'),
        total: parseFloat(formValue.total),
        notas: formValue.notas || undefined
      };
      const userId = this.authService.getValidUUIDForEdition();
      if (userId) {
        updateData.id_usuario_edicion = userId;
      }

      this.facturaService.updateFactura(this.editingFactura.id, updateData).subscribe({
        next: () => {
          this.loadFacturas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar factura:', error);
          alert('Error al actualizar la factura');
        }
      });
    } else {
      const newFactura: CreateFacturaRequest = {
        numero_factura: formValue.numero_factura,
        fecha_emision: formValue.fecha_emision,
        fecha_vencimiento: formValue.fecha_vencimiento,
        subtotal: parseFloat(formValue.subtotal),
        impuestos: parseFloat(formValue.impuestos || '0'),
        total: parseFloat(formValue.total),
        notas: formValue.notas || undefined,
        paciente_id: formValue.paciente_id,
        id_usuario_creacion: this.authService.getValidUUIDForCreation()
      };
      
      this.facturaService.createFactura(newFactura).subscribe({
        next: () => {
          this.loadFacturas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear factura:', error);
          let errorMessage = 'Error al crear la factura';
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

  deleteFactura(factura: Factura): void {
    if (confirm(`¿Está seguro de eliminar la factura "${factura.numero_factura}"?`)) {
      this.facturaService.deleteFactura(factura.id).subscribe({
        next: () => {
          this.loadFacturas();
        },
        error: (error) => {
          console.error('Error al eliminar factura:', error);
          alert('Error al eliminar la factura');
        }
      });
    }
  }

  getPacienteNombre(pacienteId: string): string {
    const paciente = this.pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'N/A';
  }
}
