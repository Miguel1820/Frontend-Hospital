import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    nombre_usuario?: string;
    apellido?: string;
    activo: boolean;
    es_admin: boolean;
    rol: string;
  };
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  nombre_usuario?: string;
  apellido?: string;
  activo: boolean;
  es_admin?: boolean;
  rol: string;
}

export type UserRole = 'admin' | 'consumidor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly ROLE_KEY = 'user_role';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  /**
   * Inicia sesión del usuario conectado al backend
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const loginPayload = {
      nombre_usuario: credentials.email,
      contraseña: credentials.password
    };

    return this.apiService.post<LoginResponse>('/auth/login', loginPayload).pipe(
      map((response: LoginResponse) => {
        const loginResponse: LoginResponse = {
          access_token: response.access_token,
          token_type: response.token_type,
          user: {
            id: response.user.id,
            email: response.user.email,
            nombre: response.user.nombre,
            nombre_usuario: response.user.nombre_usuario,
            apellido: response.user.apellido || '',
            activo: response.user.activo,
            es_admin: response.user.es_admin,
            rol: response.user.es_admin ? 'admin' : 'consumidor'
          }
        };

        return {
          success: true,
          message: 'Login exitoso',
          data: loginResponse,
          status: 200
        };
      }),
      catchError((error) => {
        const errorMessage = error.error?.detail || error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getValidUUIDForCreation(): string {
    const currentUser = this.getCurrentUser();
    if (currentUser?.id) {
      const idStr = String(currentUser.id);
      if (this.isValidUUID(idStr)) {
        return idStr;
      }
    }
    return '00000000-0000-0000-0000-000000000000';
  }

  getValidUUIDForEdition(): string | undefined {
    const currentUser = this.getCurrentUser();
    if (currentUser?.id) {
      const idStr = String(currentUser.id);
      if (this.isValidUUID(idStr)) {
        return idStr;
      }
    }
    return undefined;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Guarda los datos del usuario después del login
   */
  setUserData(loginResponse: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, loginResponse.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));
    const role = loginResponse.user.rol || (loginResponse.user.es_admin ? 'admin' : 'consumidor');
    localStorage.setItem(this.ROLE_KEY, role);
    const user: User = {
      ...loginResponse.user,
      rol: role
    };
    this.currentUserSubject.next(user);
  }

  /**
   * Carga los datos del usuario desde el almacenamiento local
   */
  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        this.logout();
      }
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.rol as UserRole || null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Verifica si el usuario es consumidor
   */
  isConsumidor(): boolean {
    return this.hasRole('consumidor');
  }

  /**
   * Verifica si el usuario puede acceder a una ruta específica
   */
  canAccess(route: string): boolean {
    const role = this.getUserRole();
    
    if (!role) return false;

    // Admin puede acceder a todo
    if (role === 'admin') return true;

    // Consumidor puede acceder a rutas limitadas del sistema hospitalario
    if (role === 'consumidor') {
      const allowedRoutes = [
        'dashboard',
        'citas',
        'facturas',
        'historiales-medicos'
      ];
      return allowedRoutes.includes(route.toLowerCase());
    }

    // Otros roles (médico, enfermera, etc.) pueden acceder a todo excepto usuarios
    return route !== 'usuarios';
  }
}
