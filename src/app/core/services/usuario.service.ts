import { Injectable } from '@angular/core';
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
    return this.apiService.getPaginated<Usuario>(this.endpoint, pagination, filters);
  }

  /**
   * Obtiene un usuario por ID
   */
  getUsuarioById(id: number): Observable<ApiResponse<Usuario>> {
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
  updateUsuario(id: number, usuario: UpdateUsuarioRequest): Observable<ApiResponse<Usuario>> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  /**
   * Elimina un usuario
   */
  deleteUsuario(id: number): Observable<ApiResponse<void>> {
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
