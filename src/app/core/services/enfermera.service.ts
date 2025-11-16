import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Enfermera, CreateEnfermeraRequest, UpdateEnfermeraRequest, EnfermeraFilters } from '../../shared/models/enfermera.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class EnfermeraService {
  private readonly endpoint = '/api/enfermeras';

  constructor(private apiService: ApiService) { }

  getEnfermeras(pagination: PaginationParams, filters?: EnfermeraFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getEnfermeraById(id: string): Observable<Enfermera> {
    return this.apiService.get<Enfermera>(`${this.endpoint}/${id}`);
  }

  createEnfermera(enfermera: CreateEnfermeraRequest): Observable<Enfermera> {
    return this.apiService.post<Enfermera>(this.endpoint, enfermera);
  }

  updateEnfermera(id: string, enfermera: UpdateEnfermeraRequest): Observable<Enfermera> {
    return this.apiService.put<Enfermera>(`${this.endpoint}/${id}`, enfermera);
  }

  deleteEnfermera(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  desactivarEnfermera(id: string): Observable<Enfermera> {
    return this.apiService.patch<Enfermera>(`${this.endpoint}/${id}/desactivar`, {});
  }
}