import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospitalizacion, CreateHospitalizacionRequest, UpdateHospitalizacionRequest, HospitalizacionFilters } from '../../shared/models/hospitalizacion.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalizacionService {
  private readonly endpoint = '/api/hospitalizaciones';

  constructor(private apiService: ApiService) { }

  getHospitalizaciones(pagination: PaginationParams, filters?: HospitalizacionFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getHospitalizacionById(id: string): Observable<Hospitalizacion> {
    return this.apiService.get<Hospitalizacion>(`${this.endpoint}/${id}`);
  }

  createHospitalizacion(hosp: CreateHospitalizacionRequest): Observable<Hospitalizacion> {
    return this.apiService.post<Hospitalizacion>(this.endpoint, hosp);
  }

  updateHospitalizacion(id: string, hosp: UpdateHospitalizacionRequest): Observable<Hospitalizacion> {
    return this.apiService.put<Hospitalizacion>(`${this.endpoint}/${id}`, hosp);
  }

  deleteHospitalizacion(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  cambiarEstado(id: string, estado: string): Observable<Hospitalizacion> {
    return this.apiService.patch<Hospitalizacion>(`${this.endpoint}/${id}/estado`, { estado });
  }
}