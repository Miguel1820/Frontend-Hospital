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

  getEnfermeras(pagination: PaginationParams, filters?: EnfermeraFilters, includeInactive: boolean = false): Observable<PaginatedResponse<Enfermera>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit,
      include_inactive: includeInactive
    };
    
    if (filters) {
      if (filters.nombre) {
        params.nombre = filters.nombre;
      }
      if (filters.activo !== undefined && filters.activo !== null && filters.activo !== '') {
        params.activo = filters.activo === 'true' || filters.activo === true;
      }
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

  inactivarEnfermera(id: string): Observable<ApiResponse<void>> {
    return this.apiService.patch<void>(`${this.endpoint}/${id}/inactivar`, {});
  }

  reactivarEnfermera(id: string): Observable<ApiResponse<void>> {
    return this.apiService.patch<void>(`${this.endpoint}/${id}/reactivar`, {});
  }

  eliminarEnfermeraPermanente(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  deleteEnfermera(id: string): Observable<ApiResponse<void>> {
    return this.inactivarEnfermera(id);
  }
}

