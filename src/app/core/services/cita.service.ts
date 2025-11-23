import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Cita, CreateCitaRequest, UpdateCitaRequest, CitaFilters } from '../../shared/models/cita.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly endpoint = '/citas';

  constructor(private apiService: ApiService) { }

  getCitas(pagination: PaginationParams, filters?: CitaFilters): Observable<PaginatedResponse<Cita>> {
    let endpoint = this.endpoint;
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };

    if (filters) {
      if (filters.paciente_id) {
        endpoint = `${this.endpoint}/paciente/${filters.paciente_id}`;
      } else if (filters.medico_id) {
        endpoint = `${this.endpoint}/medico/${filters.medico_id}`;
      } else if (filters.estado) {
        endpoint = `${this.endpoint}/estado/${filters.estado}`;
      }
    }

    return this.apiService.get<Cita[]>(endpoint, params).pipe(
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

  getCitaById(id: string): Observable<ApiResponse<Cita>> {
    return this.apiService.get<Cita>(`${this.endpoint}/${id}`);
  }

  createCita(cita: CreateCitaRequest): Observable<ApiResponse<Cita>> {
    return this.apiService.post<Cita>(this.endpoint, cita);
  }

  updateCita(id: string, cita: UpdateCitaRequest): Observable<ApiResponse<Cita>> {
    return this.apiService.put<Cita>(`${this.endpoint}/${id}`, cita);
  }

  deleteCita(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

