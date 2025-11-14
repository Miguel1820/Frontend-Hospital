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
    path: 'pacientes',
    loadComponent: () => import('./features/paciente/paciente-list/paciente-list.component').then(m => m.PacienteListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard]
  },
 /*
  {
    path: 'citas',
    loadComponent: () => import('./features/cita/cita-list/cita-list.component').then(m => m.CitaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'enfermeras',
    loadComponent: () => import('./features/enfermera/enfermera-list/enfermera-list.component').then(m => m.EnfermeraListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'medicos',
    loadComponent: () => import('./features/medico/medico-list/medico-list.component').then(m => m.MedicoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturas',
    loadComponent: () => import('./features/factura/factura-list/factura-list.component').then(m => m.FacturaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle_factura',
    loadComponent: () => import('./features/factura/detalle_factura-list/detalle_factura-list.component').then(m => m.DetalleFacturaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial_entrada',
    loadComponent: () => import('./features/historial/historial_entrada-list/historial_entrada-list.component').then(m => m.HistorialEntradaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial_medico',
    loadComponent: () => import('./features/historial/historial_medico-list/historial_medico-list.component').then(m => m.HistorialMedicoListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'hospitalizaciones',
    loadComponent: () => import('./features/hospitalizacion/hospitalizacion-list/hospitalizacion-list.component').then(m => m.HospitalizacionListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./features/configuracion/configuracion.component').then(m => m.ConfiguracionComponent),
    canActivate: [AuthGuard]
  },
*/
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
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
