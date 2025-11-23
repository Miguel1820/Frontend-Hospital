import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Enfermera, CreateEnfermeraRequest, UpdateEnfermeraRequest, EnfermeraFilters } from '../../shared/models/enfermera.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class EnfermeraService {
  private readonly endpoint = '/enfermeras';

  constructor(private apiService: ApiService) { }

  getEnfermeras(pagination: PaginationParams, filters?: EnfermeraFilters): Observable<PaginatedResponse<Enfermera>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Enfermera[]>(this.endpoint, params).pipe(
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

  getEnfermeraById(id: string): Observable<ApiResponse<Enfermera>> {
    return this.apiService.get<Enfermera>(`${this.endpoint}/${id}`);
  }

  createEnfermera(enfermera: CreateEnfermeraRequest): Observable<ApiResponse<Enfermera>> {
    return this.apiService.post<Enfermera>(this.endpoint, enfermera);
  }

  updateEnfermera(id: string, enfermera: UpdateEnfermeraRequest): Observable<ApiResponse<Enfermera>> {
    return this.apiService.put<Enfermera>(`${this.endpoint}/${id}`, enfermera);
  }

  deleteEnfermera(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

