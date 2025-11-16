import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medico, CreateMedicoRequest, UpdateMedicoRequest, MedicoFilters } from '../../shared/models/medico.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private readonly endpoint = '/api/medicos';

  constructor(private apiService: ApiService) { }

  getMedicos(pagination: PaginationParams, filters?: MedicoFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getMedicoById(id: string): Observable<Medico> {
    return this.apiService.get<Medico>(`${this.endpoint}/${id}`);
  }

  createMedico(medico: CreateMedicoRequest): Observable<Medico> {
    return this.apiService.post<Medico>(this.endpoint, medico);
  }

  updateMedico(id: string, medico: UpdateMedicoRequest): Observable<Medico> {
    return this.apiService.put<Medico>(`${this.endpoint}/${id}`, medico);
  }

  deleteMedico(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  desactivarMedico(id: string): Observable<Medico> {
    return this.apiService.patch<Medico>(`${this.endpoint}/${id}/desactivar`, {});
  }
}