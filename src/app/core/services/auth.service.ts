import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    rol: string;
  };
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  activo: boolean;
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
   * Inicia sesión del usuario (FAKE - Sin conexión al backend)
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    // Simular delay de red
    return of(this.fakeLogin(credentials)).pipe(delay(1000));
  }

  /**
   * Login falso con credenciales hardcodeadas y roles
   */
  private fakeLogin(credentials: LoginRequest): ApiResponse<LoginResponse> {
    // Credenciales fijas con roles
    const validCredentials = [
      { email: 'admin', password: 'admin123', rol: 'admin' },
      { email: 'consumidor', password: 'consumidor123', rol: 'consumidor' }
    ];

    const validCredential = validCredentials.find(
      cred => cred.email === credentials.email && cred.password === credentials.password
    );

    if (validCredential) {
      const fakeUser: User = {
        id: validCredential.rol === 'admin' ? 1 : 2,
        email: validCredential.rol === 'admin' ? 'admin@itm.edu.co' : 'consumidor@itm.edu.co',
        nombre: validCredential.rol === 'admin' ? 'Administrador' : 'Consumidor',
        apellido: 'Sistema',
        activo: true,
        rol: validCredential.rol
      };

      const fakeResponse: LoginResponse = {
        access_token: 'fake_token_' + Date.now(),
        token_type: 'Bearer',
        user: fakeUser
      };

      return {
        success: true,
        message: 'Login exitoso',
        data: fakeResponse,
        status: 200
      };
    } else {
      // Simular error de credenciales
      throw new Error('Credenciales inválidas. Usa admin/admin123 o consumidor/consumidor123');
    }
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

  /**
   * Guarda los datos del usuario después del login
   */
  setUserData(loginResponse: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, loginResponse.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponse.user));
    localStorage.setItem(this.ROLE_KEY, loginResponse.user.rol);
    this.currentUserSubject.next(loginResponse.user);
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

    // Consumidor solo puede acceder a productos
    if (role === 'consumidor') {
      return route === 'productos' || route === 'dashboard';
    }

    return false;
  }
}
