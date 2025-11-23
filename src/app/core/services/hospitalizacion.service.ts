import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Hospitalizacion, CreateHospitalizacionRequest, UpdateHospitalizacionRequest, HospitalizacionFilters } from '../../shared/models/hospitalizacion.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalizacionService {
  private readonly endpoint = '/hospitalizaciones';

  constructor(private apiService: ApiService) { }

  getHospitalizaciones(pagination: PaginationParams, filters?: HospitalizacionFilters): Observable<PaginatedResponse<Hospitalizacion>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Hospitalizacion[]>(this.endpoint, params).pipe(
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

  getHospitalizacionById(id: string): Observable<ApiResponse<Hospitalizacion>> {
    return this.apiService.get<Hospitalizacion>(`${this.endpoint}/${id}`);
  }

  createHospitalizacion(hospitalizacion: CreateHospitalizacionRequest): Observable<ApiResponse<Hospitalizacion>> {
    return this.apiService.post<Hospitalizacion>(this.endpoint, hospitalizacion);
  }

  updateHospitalizacion(id: string, hospitalizacion: UpdateHospitalizacionRequest): Observable<ApiResponse<Hospitalizacion>> {
    return this.apiService.put<Hospitalizacion>(`${this.endpoint}/${id}`, hospitalizacion);
  }

  deleteHospitalizacion(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

