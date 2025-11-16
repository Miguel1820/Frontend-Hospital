import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente, CreatePacienteRequest, UpdatePacienteRequest, PacienteFilters } from '../../shared/models/paciente.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private readonly endpoint = '/api/pacientes';

  constructor(private apiService: ApiService) { }

  getPacientes(pagination: PaginationParams, filters?: PacienteFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getPacienteById(id: string): Observable<Paciente> {
    return this.apiService.get<Paciente>(`${this.endpoint}/${id}`);
  }

  createPaciente(paciente: CreatePacienteRequest): Observable<Paciente> {
    return this.apiService.post<Paciente>(this.endpoint, paciente);
  }

  updatePaciente(id: string, paciente: UpdatePacienteRequest): Observable<Paciente> {
    return this.apiService.put<Paciente>(`${this.endpoint}/${id}`, paciente);
  }

  deletePaciente(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  desactivarPaciente(id: string): Observable<Paciente> {
    return this.apiService.patch<Paciente>(`${this.endpoint}/${id}/desactivar`, {});
  }
}