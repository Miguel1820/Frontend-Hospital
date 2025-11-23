import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { HistorialMedico, CreateHistorialMedicoRequest, UpdateHistorialMedicoRequest, HistorialMedicoFilters } from '../../shared/models/historial-medico.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private readonly endpoint = '/historiales-medicos';

  constructor(private apiService: ApiService) { }

  getHistorialesMedicos(pagination: PaginationParams, filters?: HistorialMedicoFilters): Observable<PaginatedResponse<HistorialMedico>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<HistorialMedico[]>(this.endpoint, params).pipe(
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

  getHistorialMedicoById(id: string): Observable<ApiResponse<HistorialMedico>> {
    return this.apiService.get<HistorialMedico>(`${this.endpoint}/${id}`);
  }

  createHistorialMedico(historial: CreateHistorialMedicoRequest): Observable<ApiResponse<HistorialMedico>> {
    return this.apiService.post<HistorialMedico>(this.endpoint, historial);
  }

  updateHistorialMedico(id: string, historial: UpdateHistorialMedicoRequest): Observable<ApiResponse<HistorialMedico>> {
    return this.apiService.put<HistorialMedico>(`${this.endpoint}/${id}`, historial);
  }

  deleteHistorialMedico(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

