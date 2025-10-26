import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria, CategoriaFilters, CreateCategoriaRequest, UpdateCategoriaRequest } from '../../shared/models/categoria.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly endpoint = '/categorias';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todas las categorías con paginación
   */
  getCategorias(pagination: PaginationParams, filters?: CategoriaFilters): Observable<PaginatedResponse<Categoria>> {
    return this.apiService.getPaginated<Categoria>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene una categoría por ID
   */
  getCategoriaById(id: number): Observable<ApiResponse<Categoria>> {
    return this.apiService.get<Categoria>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea una nueva categoría
   */
  createCategoria(categoria: CreateCategoriaRequest): Observable<ApiResponse<Categoria>> {
    return this.apiService.post<Categoria>(this.endpoint, categoria);
  }

  /**
   * Actualiza una categoría existente
   */
  updateCategoria(id: number, categoria: UpdateCategoriaRequest): Observable<ApiResponse<Categoria>> {
    return this.apiService.put<Categoria>(`${this.endpoint}/${id}`, categoria);
  }

  /**
   * Elimina una categoría
   */
  deleteCategoria(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todas las categorías activas (sin paginación)
   */
  getCategoriasActivas(): Observable<ApiResponse<Categoria[]>> {
    return this.apiService.get<Categoria[]>(`${this.endpoint}/activas`);
  }
}
