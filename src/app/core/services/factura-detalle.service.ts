import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { FacturaDetalle, CreateFacturaDetalleRequest, UpdateFacturaDetalleRequest, FacturaDetalleFilters } from '../../shared/models/factura-detalle.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {
  private readonly endpoint = '/factura-detalles';

  constructor(private apiService: ApiService) { }

  getFacturasDetalle(pagination: PaginationParams, filters?: FacturaDetalleFilters): Observable<PaginatedResponse<FacturaDetalle>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<FacturaDetalle[]>(this.endpoint, params).pipe(
      map(response => {
        const items = Array.isArray(response) ? response : (response?.data || []);
        return {
          data: items,
          total: items.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(items.length / pagination.limit) || 1
        };
      })
    );
  }

  getFacturaDetalleById(id: string): Observable<ApiResponse<FacturaDetalle>> {
    return this.apiService.get<FacturaDetalle>(`${this.endpoint}/${id}`);
  }

  createFacturaDetalle(detalle: CreateFacturaDetalleRequest): Observable<ApiResponse<FacturaDetalle>> {
    return this.apiService.post<FacturaDetalle>(this.endpoint, detalle);
  }

  updateFacturaDetalle(id: string, detalle: UpdateFacturaDetalleRequest): Observable<ApiResponse<FacturaDetalle>> {
    return this.apiService.put<FacturaDetalle>(`${this.endpoint}/${id}`, detalle);
  }

  deleteFacturaDetalle(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

