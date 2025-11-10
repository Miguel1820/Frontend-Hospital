import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'design_app', class: '' },

  // Secciones del hospital
  { path: '/paciente', title: 'Pacientes', icon: 'users_single-02', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/usuario', title: 'Usuarios', icon: 'users_circle-08', class: '', roles: ['admin'] },
  { path: '/cita', title: 'Citas', icon: 'ui-1_calendar-60', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/enfermera', title: 'Enfermeras', icon: 'users_single-02', class: '', roles: ['admin'] },
  { path: '/medico', title: 'Medicos', icon: 'users_single-02', class: '', roles: ['admin'] },
  { path: '/factura', title: 'Facturas', icon: 'shopping_credit-card', class: '', roles: ['admin'] },
  { path: '/factura_detalle', title: 'Detalle Factura', icon: 'files_single-copy-04', class: '', roles: ['admin'] },
  { path: '/historial_entrada', title: 'Historial Entradas', icon: 'files_paper', class: '', roles: ['admin', 'enfermera'] },
  { path: '/historial_medico', title: 'Historial Médico', icon: 'health_ambulance', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/hospitalizacion', title: 'Hospitalizaciones', icon: 'objects_key-25', class: '', roles: ['admin', 'doctor', 'enfermera'] },

  // Configuración final
  { path: '/configuracion', title: 'Configuración', icon: 'objects_spaceship', class: 'active active-pro', roles: ['admin'] }
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Filtra solo los menús que el usuario puede ver
    this.menuItems = ROUTES.filter(menuItem => this.canAccessMenuItem(menuItem));
  }

  canAccessMenuItem(menuItem: RouteInfo): boolean {
    // Si no tiene roles definidos, todos pueden acceder
    if (!menuItem.roles || menuItem.roles.length === 0) {
      return true;
    }

    // Verificar si el usuario actual tiene alguno de los roles requeridos
    const userRole = this.authService.getUserRole();
    return userRole ? menuItem.roles.includes(userRole) : false;
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}