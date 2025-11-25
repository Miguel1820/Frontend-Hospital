import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'categorias',
    loadComponent: () => import('./features/categoria/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    loadComponent: () => import('./features/producto/producto-list/producto-list.component').then(m => m.ProductoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./features/paciente/paciente-list/paciente-list.component').then(m => m.PacienteListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'medicos',
    loadComponent: () => import('./features/medico/medico-list/medico-list.component').then(m => m.MedicoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'enfermeras',
    loadComponent: () => import('./features/enfermera/enfermera-list/enfermera-list.component').then(m => m.EnfermeraListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'citas',
    loadComponent: () => import('./features/cita/cita-list/cita-list.component').then(m => m.CitaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'hospitalizaciones',
    loadComponent: () => import('./features/hospitalizacion/hospitalizacion-list/hospitalizacion-list.component').then(m => m.HospitalizacionListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historiales-medicos',
    loadComponent: () => import('./features/historial-medico/historial-medico-list/historial-medico-list.component').then(m => m.HistorialMedicoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historiales-entrada',
    loadComponent: () => import('./features/historial-entrada/historial-entrada-list/historial-entrada-list.component').then(m => m.HistorialEntradaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturas',
    loadComponent: () => import('./features/factura/factura-list/factura-list.component').then(m => m.FacturaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturas-detalle',
    loadComponent: () => import('./features/factura-detalle/factura-detalle-list/factura-detalle-list.component').then(m => m.FacturaDetalleListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
