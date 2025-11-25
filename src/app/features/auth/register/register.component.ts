import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card slide-in-up">
        <div class="card glass">
          <div class="card-header text-center">
            <div class="register-icon">✨</div>
            <h2 class="card-title text-title-contrast">Crear Cuenta</h2>
            <p class="register-subtitle text-high-contrast">Únete a nuestro sistema</p>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="form-group">
                <label for="email" class="form-label">
                  <span class="label-icon">📧</span>
                  Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  class="form-control" 
                  [(ngModel)]="registerData.email"
                  name="email"
                  required
                  email
                  placeholder="tu@email.com"
                  #email="ngModel"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">El email es requerido</div>
                  <div *ngIf="email.errors?.['email']">El email no es válido</div>
                </div>
              </div>

              <div class="form-group">
                <label for="contrasena" class="form-label">
                  <span class="label-icon">🔑</span>
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="contrasena"
                  class="form-control" 
                  [(ngModel)]="registerData.contrasena"
                  name="contrasena"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  #contrasena="ngModel"
                  [class.is-invalid]="contrasena.invalid && contrasena.touched"
                >
                <div class="invalid-feedback" *ngIf="contrasena.invalid && contrasena.touched">
                  <div *ngIf="contrasena.errors?.['required']">La contraseña es requerida</div>
                  <div *ngIf="contrasena.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="nombre" class="form-label">
                  <span class="label-icon">👤</span>
                  Nombre
                </label>
                <input 
                  type="text" 
                  id="nombre"
                  class="form-control" 
                  [(ngModel)]="registerData.nombre"
                  name="nombre"
                  required
                  minlength="2"
                  placeholder="Tu nombre"
                  #nombre="ngModel"
                  [class.is-invalid]="nombre.invalid && nombre.touched"
                >
                <div class="invalid-feedback" *ngIf="nombre.invalid && nombre.touched">
                  <div *ngIf="nombre.errors?.['required']">El nombre es requerido</div>
                  <div *ngIf="nombre.errors?.['minlength']">El nombre debe tener al menos 2 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="nombre_usuario" class="form-label">
                  <span class="label-icon">👤</span>
                  Nombre de Usuario
                </label>
                <input 
                  type="text" 
                  id="nombre_usuario"
                  class="form-control" 
                  [(ngModel)]="registerData.nombre_usuario"
                  name="nombre_usuario"
                  required
                  minlength="3"
                  placeholder="Tu nombre de usuario"
                  #nombre_usuario="ngModel"
                  [class.is-invalid]="nombre_usuario.invalid && nombre_usuario.touched"
                >
                <div class="invalid-feedback" *ngIf="nombre_usuario.invalid && nombre_usuario.touched">
                  <div *ngIf="nombre_usuario.errors?.['required']">El nombre de usuario es requerido</div>
                  <div *ngIf="nombre_usuario.errors?.['minlength']">El nombre de usuario debe tener al menos 3 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100 btn-lg"
                  [disabled]="registerForm.invalid || loading"
                  [class.loading]="loading"
                >
                  <span *ngIf="loading" class="spinner"></span>
                  <span *ngIf="loading">Registrando...</span>
                  <span *ngIf="!loading">
                    <span class="btn-icon">✨</span>
                    Crear Cuenta
                  </span>
                </button>
              </div>

              <div class="form-options">
                <div class="text-center">
                  <span class="login-text">¿Ya tienes cuenta? </span>
                  <a routerLink="/auth/login" class="link">
                    <span class="link-icon">🔐</span>
                    Inicia sesión aquí
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .register-card {
      width: 100%;
      max-width: 500px;
    }

    .register-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: pulse 2s infinite;
    }

    .register-subtitle {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1rem;
      margin-bottom: 0;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--dark-color);
    }

    .label-icon {
      font-size: 1.125rem;
    }

    .form-control {
      margin-top: 0.5rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .form-options {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
    }

    .link:hover {
      background: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }

    .link-icon {
      font-size: 1rem;
    }

    .login-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .btn.loading {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .register-container {
        padding: 1rem;
      }

      .register-card {
        max-width: 100%;
      }

      .register-icon {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .register-container {
        padding: 0.5rem;
      }

      .form-label {
        font-size: 0.875rem;
      }

      .link {
        font-size: 0.875rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerData = {
    email: '',
    contrasena: '',
    nombre: '',
    nombre_usuario: ''
  };
  
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    // TODO: Implementar verificación de autenticación
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    const usuarioData: CreateUsuarioRequest = {
      nombre: this.registerData.nombre,
      nombre_usuario: this.registerData.nombre_usuario,
      email: this.registerData.email,
      contraseña: this.registerData.contrasena
    };
    
    this.usuarioService.createUsuario(usuarioData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.notificationService.showError('Error al registrar usuario. Intenta nuevamente.');
        this.loading = false;
      }
    });
  }
}
