import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita, CreateCitaRequest, UpdateCitaRequest, CitaFilters } from '../../shared/models/cita.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly endpoint = '/api/citas';

  constructor(private apiService: ApiService) { }

  getCitas(pagination: PaginationParams, filters?: CitaFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getCitaById(id: string): Observable<Cita> {
    return this.apiService.get<Cita>(`${this.endpoint}/${id}`);
  }

  createCita(cita: CreateCitaRequest): Observable<Cita> {
    return this.apiService.post<Cita>(this.endpoint, cita);
  }

  updateCita(id: string, cita: UpdateCitaRequest): Observable<Cita> {
    return this.apiService.put<Cita>(`${this.endpoint}/${id}`, cita);
  }

  deleteCita(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  cambiarEstado(id: string, estado: string): Observable<Cita> {
    return this.apiService.patch<Cita>(`${this.endpoint}/${id}/estado`, { estado });
  }
}