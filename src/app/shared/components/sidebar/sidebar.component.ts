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
  { path: '/dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', class: '' },

  // Secciones del hospital
  { path: '/paciente', title: 'Pacientes', icon: 'fas fa-user-injured', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/usuario', title: 'Usuarios', icon: 'fas fa-users-cog', class: '', roles: ['admin'] },
  { path: '/cita', title: 'Citas', icon: 'fas fa-calendar-check', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/enfermera', title: 'Enfermeras', icon: 'fas fa-user-nurse', class: '', roles: ['admin'] },
  { path: '/medico', title: 'Medicos', icon: 'fas fa-user-md', class: '', roles: ['admin'] },
  { path: '/factura', title: 'Facturas', icon: 'fas fa-file-invoice-dollar', class: '', roles: ['admin'] },
  { path: '/factura_detalle', title: 'Detalle Factura', icon: 'fas fa-receipt', class: '', roles: ['admin'] },
  { path: '/historial_entrada', title: 'Historial Entradas', icon: 'fas fa-clipboard-list', class: '', roles: ['admin', 'enfermera'] },
  { path: '/historial_medico', title: 'Historial Médico', icon: 'fas fa-file-medical', class: '', roles: ['admin', 'doctor', 'enfermera'] },
  { path: '/hospitalizacion', title: 'Hospitalizaciones', icon: 'fas fa-procedures', class: '', roles: ['admin', 'doctor', 'enfermera'] },

  // Configuración final
  { path: '/configuracion', title: 'Configuración', icon: 'fas fa-cog', class: 'active active-pro', roles: ['admin'] }
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