import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/usuarios', title: 'Usuarios',  icon:'users_single-02', class: '', roles: ['admin'] },
    { path: '/pacientes', title: 'Pacientes',  icon:'users_single-02', class: '', roles: ['admin'] },
    { path: '/medicos', title: 'Médicos',  icon:'users_single-02', class: '', roles: ['admin'] },
    { path: '/enfermeras', title: 'Enfermeras',  icon:'users_single-02', class: '', roles: ['admin'] },
    { path: '/citas', title: 'Citas',  icon:'ui-1_calendar-60', class: '' },
    { path: '/hospitalizaciones', title: 'Hospitalizaciones',  icon:'business_bank', class: '', roles: ['admin'] },
    { path: '/historiales-medicos', title: 'Historiales Médicos',  icon:'files_paper', class: '' },
    { path: '/historiales-entrada', title: 'Historiales Entrada',  icon:'files_paper', class: '', roles: ['admin'] },
    { path: '/facturas', title: 'Facturas',  icon:'business_money-coins', class: '' },
    { path: '/facturas-detalle', title: 'Facturas Detalle',  icon:'business_money-coins', class: '', roles: ['admin'] }
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
  isSidebarOpen = false;
  isUserMenuOpen = false;
  isHovering = false;
  hoverTimeout: any;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => this.canAccessMenuItem(menuItem));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Ajustar sidebar en móviles
    if (window.innerWidth <= 991 && this.isSidebarOpen) {
      // En móviles, el sidebar puede estar abierto pero con overlay
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Cerrar menú de usuario si se hace clic fuera
    if (!target.closest('.user-info-dropdown')) {
      this.isUserMenuOpen = false;
    }
    // En móviles, cerrar sidebar si se hace clic fuera
    if (window.innerWidth <= 991) {
      if (!target.closest('.right-sidebar') && !target.closest('.sidebar-toggle')) {
        this.isSidebarOpen = false;
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isHovering = false;
    // Agregar clase al body para ajustar el layout
    if (this.isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

  onSidebarHover() {
    if (!this.isSidebarOpen) {
      this.isHovering = true;
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
    }
  }

  onSidebarLeave() {
    if (!this.isSidebarOpen) {
      this.hoverTimeout = setTimeout(() => {
        this.isHovering = false;
      }, 300);
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.isHovering = false;
    document.body.classList.remove('sidebar-open');
  }

  canAccessMenuItem(menuItem: RouteInfo): boolean {
    const userRole = this.authService.getUserRole();
    
    if (!userRole) return false;

    // Admin puede acceder a todo
    if (userRole === 'admin') return true;

    // Si no tiene roles definidos, todos pueden acceder (excepto si es consumidor)
    if (!menuItem.roles || menuItem.roles.length === 0) {
      // Consumidor solo puede acceder a rutas específicas
      if (userRole === 'consumidor') {
        const allowedRoutes = ['/dashboard', '/citas', '/facturas', '/historiales-medicos'];
        return allowedRoutes.includes(menuItem.path);
      }
      return true;
    }

    // Verificar si el usuario actual tiene alguno de los roles requeridos
    return menuItem.roles.includes(userRole);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.closeSidebar();
  }
}
