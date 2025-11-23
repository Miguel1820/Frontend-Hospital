import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Paciente, CreatePacienteRequest, UpdatePacienteRequest, PacienteFilters } from '../../shared/models/paciente.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly endpoint = '/pacientes';

  constructor(private apiService: ApiService) { }

  getPacientes(pagination: PaginationParams, filters?: PacienteFilters): Observable<PaginatedResponse<Paciente>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Paciente[]>(this.endpoint, params).pipe(
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

  getPacienteById(id: string): Observable<any> {
    return this.apiService.get<Paciente>(`${this.endpoint}/${id}`);
  }

  getPacienteByEmail(email: string): Observable<any> {
    return this.apiService.get<Paciente>(`${this.endpoint}/email/${email}`);
  }

  buscarPacientesPorNombre(nombre: string): Observable<any> {
    return this.apiService.get<Paciente[]>(`${this.endpoint}/buscar/${nombre}`);
  }

  createPaciente(paciente: CreatePacienteRequest): Observable<any> {
    return this.apiService.post<Paciente>(this.endpoint, paciente);
  }

  updatePaciente(id: string, paciente: UpdatePacienteRequest): Observable<any> {
    return this.apiService.put<Paciente>(`${this.endpoint}/${id}`, paciente);
  }

  deletePaciente(id: string): Observable<any> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}

