import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistorialEntrada, CreateHistorialEntradaRequest, UpdateHistorialEntradaRequest, HistorialEntradaFilters } from '../../shared/models/historial_entrada.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HistorialEntradaService {
  private readonly endpoint = '/api/historiales-entrada';

  constructor(private apiService: ApiService) { }

  getHistorialesEntradas(pagination: PaginationParams, filters?: HistorialEntradaFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getHistorialEntradaById(id: string): Observable<HistorialEntrada> {
    return this.apiService.get<HistorialEntrada>(`${this.endpoint}/${id}`);
  }

  createHistorialEntrada(entrada: CreateHistorialEntradaRequest): Observable<HistorialEntrada> {
    return this.apiService.post<HistorialEntrada>(this.endpoint, entrada);
  }

  updateHistorialEntrada(id: string, entrada: UpdateHistorialEntradaRequest): Observable<HistorialEntrada> {
    return this.apiService.put<HistorialEntrada>(`${this.endpoint}/${id}`, entrada);
  }

  deleteHistorialEntrada(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}