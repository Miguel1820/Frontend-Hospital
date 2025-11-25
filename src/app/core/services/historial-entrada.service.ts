import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateHistorialEntradaRequest, HistorialEntrada, HistorialEntradaFilters, UpdateHistorialEntradaRequest } from '../../shared/models/historial-entrada.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialEntradaService {
  private readonly endpoint = '/historial-entradas';

  constructor(private apiService: ApiService) { }

  getHistorialesEntrada(pagination: PaginationParams, filters?: HistorialEntradaFilters): Observable<PaginatedResponse<HistorialEntrada>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<HistorialEntrada[]>(this.endpoint, params).pipe(
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

  getHistorialEntradaById(id: string): Observable<ApiResponse<HistorialEntrada>> {
    return this.apiService.get<HistorialEntrada>(`${this.endpoint}/${id}`);
  }

  createHistorialEntrada(historial: CreateHistorialEntradaRequest): Observable<ApiResponse<HistorialEntrada>> {
    return this.apiService.post<HistorialEntrada>(this.endpoint, historial);
  }

  updateHistorialEntrada(id: string, historial: UpdateHistorialEntradaRequest): Observable<ApiResponse<HistorialEntrada>> {
    return this.apiService.put<HistorialEntrada>(`${this.endpoint}/${id}`, historial);
  }

  deleteHistorialEntrada(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

