import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Factura, CreateFacturaRequest, UpdateFacturaRequest, FacturaFilters } from '../../shared/models/factura.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private readonly endpoint = '/facturas';

  constructor(private apiService: ApiService) { }

  getFacturas(pagination: PaginationParams, filters?: FacturaFilters): Observable<PaginatedResponse<Factura>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Factura[]>(this.endpoint, params).pipe(
      map(response => {
        const items = Array.isArray(response) ? response : (response?.data || []);
        const total = items.length;
        return {
          data: items,
          total: total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: total > 0 && items.length === pagination.limit ? pagination.page + 1 : pagination.page
        };
      })
    );
  }

  getFacturaById(id: string): Observable<ApiResponse<Factura>> {
    return this.apiService.get<Factura>(`${this.endpoint}/${id}`);
  }

  createFactura(factura: CreateFacturaRequest): Observable<ApiResponse<Factura>> {
    return this.apiService.post<Factura>(this.endpoint, factura);
  }

  updateFactura(id: string, factura: UpdateFacturaRequest): Observable<ApiResponse<Factura>> {
    return this.apiService.put<Factura>(`${this.endpoint}/${id}`, factura);
  }

  deleteFactura(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

