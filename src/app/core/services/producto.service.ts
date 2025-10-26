import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProductoRequest, Producto, ProductoFilters, UpdateProductoRequest } from '../../shared/models/producto.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly endpoint = '/productos';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los productos con paginación
   */
  getProductos(pagination: PaginationParams, filters?: ProductoFilters): Observable<PaginatedResponse<Producto>> {
    return this.apiService.getPaginated<Producto>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un producto por ID
   */
  getProductoById(id: number): Observable<ApiResponse<Producto>> {
    return this.apiService.get<Producto>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo producto
   */
  createProducto(producto: CreateProductoRequest): Observable<ApiResponse<Producto>> {
    return this.apiService.post<Producto>(this.endpoint, producto);
  }

  /**
   * Actualiza un producto existente
   */
  updateProducto(id: number, producto: UpdateProductoRequest): Observable<ApiResponse<Producto>> {
    return this.apiService.put<Producto>(`${this.endpoint}/${id}`, producto);
  }

  /**
   * Elimina un producto
   */
  deleteProducto(id: number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Obtiene todos los productos activos (sin paginación)
   */
  getProductosActivos(): Observable<ApiResponse<Producto[]>> {
    return this.apiService.get<Producto[]>(`${this.endpoint}/activos`);
  }

  /**
   * Obtiene productos por categoría
   */
  getProductosByCategoria(categoriaId: number): Observable<ApiResponse<Producto[]>> {
    return this.apiService.get<Producto[]>(`${this.endpoint}/categoria/${categoriaId}`);
  }
}
