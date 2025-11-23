import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Medico, CreateMedicoRequest, UpdateMedicoRequest, MedicoFilters } from '../../shared/models/medico.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private readonly endpoint = '/medicos';

  constructor(private apiService: ApiService) { }

  getMedicos(pagination: PaginationParams, filters?: MedicoFilters): Observable<PaginatedResponse<Medico>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Medico[]>(this.endpoint, params).pipe(
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

  getMedicoById(id: string): Observable<ApiResponse<Medico>> {
    return this.apiService.get<Medico>(`${this.endpoint}/${id}`);
  }

  createMedico(medico: CreateMedicoRequest): Observable<ApiResponse<Medico>> {
    return this.apiService.post<Medico>(this.endpoint, medico);
  }

  updateMedico(id: string, medico: UpdateMedicoRequest): Observable<ApiResponse<Medico>> {
    return this.apiService.put<Medico>(`${this.endpoint}/${id}`, medico);
  }

  deleteMedico(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

