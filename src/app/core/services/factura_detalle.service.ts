import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacturaDetalle, CreateFacturaDetalleRequest, UpdateFacturaDetalleRequest, FacturaDetalleFilters } from '../../shared/models/factura_detalle.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaDetalleService {
  private readonly endpoint = '/api/facturas-detalle';

  constructor(private apiService: ApiService) { }

  getFacturasDetalles(pagination: PaginationParams, filters?: FacturaDetalleFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getFacturaDetalleById(id: string): Observable<FacturaDetalle> {
    return this.apiService.get<FacturaDetalle>(`${this.endpoint}/${id}`);
  }

  createFacturaDetalle(detalle: CreateFacturaDetalleRequest): Observable<FacturaDetalle> {
    return this.apiService.post<FacturaDetalle>(this.endpoint, detalle);
  }

  updateFacturaDetalle(id: string, detalle: UpdateFacturaDetalleRequest): Observable<FacturaDetalle> {
    return this.apiService.put<FacturaDetalle>(`${this.endpoint}/${id}`, detalle);
  }

  deleteFacturaDetalle(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}