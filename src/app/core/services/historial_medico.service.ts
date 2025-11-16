import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistorialMedico, CreateHistorialMedicoRequest, UpdateHistorialMedicoRequest, HistorialMedicoFilters } from '../../shared/models/historial_medico.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private readonly endpoint = '/api/historiales-medicos';

  constructor(private apiService: ApiService) { }

  getHistorialesMedicos(pagination: PaginationParams, filters?: HistorialMedicoFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getHistorialMedicoById(id: string): Observable<HistorialMedico> {
    return this.apiService.get<HistorialMedico>(`${this.endpoint}/${id}`);
  }

  createHistorialMedico(historial: CreateHistorialMedicoRequest): Observable<HistorialMedico> {
    return this.apiService.post<HistorialMedico>(this.endpoint, historial);
  }

  updateHistorialMedico(id: string, historial: UpdateHistorialMedicoRequest): Observable<HistorialMedico> {
    return this.apiService.put<HistorialMedico>(`${this.endpoint}/${id}`, historial);
  }

  deleteHistorialMedico(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  cambiarEstado(id: string, estado: string): Observable<HistorialMedico> {
    return this.apiService.patch<HistorialMedico>(`${this.endpoint}/${id}/estado`, { estado });
  }
}