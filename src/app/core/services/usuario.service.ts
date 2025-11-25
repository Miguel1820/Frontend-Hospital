import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { ChangePasswordRequest, CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UsuarioFilters } from '../../shared/models/usuario.model';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly endpoint = '/usuarios';

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene todos los usuarios con paginación
   */
  getUsuarios(pagination: PaginationParams, filters?: UsuarioFilters): Observable<PaginatedResponse<Usuario>> {
    const params: any = {
      skip: (pagination.page - 1) * pagination.limit,
      limit: pagination.limit
    };
    if (filters) {
      Object.assign(params, filters);
    }
    return this.apiService.get<Usuario[]>(this.endpoint, params).pipe(
      map(response => {
        const items = Array.isArray(response) ? response : (response?.data || []);
        const total = items.length;
        return {
          data: items,
          total: total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: total > 0 && items.length === pagination.limit ? pagination.page + 1 : pagination.page
        };
      })
    );
  }

  /**
   * Obtiene un usuario por ID
   */
  getUsuarioById(id: string | number): Observable<ApiResponse<Usuario>> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo usuario
   */
  createUsuario(usuario: CreateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  /**
   * Actualiza un usuario existente
   */
  updateUsuario(id: string | number, usuario: UpdateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  /**
   * Elimina un usuario
   */
  deleteUsuario(id: string | number): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Cambia la contraseña de un usuario
   */
  changePassword(id: number, passwordData: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.apiService.post<void>(`${this.endpoint}/${id}/change-password`, passwordData);
  }

  /**
   * Obtiene todos los usuarios activos (sin paginación)
   */
  getUsuariosActivos(): Observable<ApiResponse<Usuario[]>> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/activos`);
  }

  /**
   * Activa/desactiva un usuario
   */
  toggleUsuarioStatus(id: number, activo: boolean): Observable<ApiResponse<Usuario>> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/toggle-status`, { activo });
  }
}
