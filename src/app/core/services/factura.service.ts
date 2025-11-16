import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura, CreateFacturaRequest, UpdateFacturaRequest, FacturaFilters } from '../../shared/models/factura.model';
import { PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private readonly endpoint = '/api/facturas';

  constructor(private apiService: ApiService) { }

  getFacturas(pagination: PaginationParams, filters?: FacturaFilters): Observable<any> {
    const params = { ...pagination, ...filters };
    return this.apiService.getPaginated<any>(this.endpoint, params);
  }

  getFacturaById(id: string): Observable<Factura> {
    return this.apiService.get<Factura>(`${this.endpoint}/${id}`);
  }

  createFactura(factura: CreateFacturaRequest): Observable<Factura> {
    return this.apiService.post<Factura>(this.endpoint, factura);
  }

  updateFactura(id: string, factura: UpdateFacturaRequest): Observable<Factura> {
    return this.apiService.put<Factura>(`${this.endpoint}/${id}`, factura);
  }

  deleteFactura(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  cambiarEstado(id: string, estado: string): Observable<Factura> {
    return this.apiService.patch<Factura>(`${this.endpoint}/${id}/estado`, { estado });
  }
}