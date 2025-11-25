import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CitaService } from '../../core/services/cita.service';
import { EnfermeraService } from '../../core/services/enfermera.service';
import { HospitalizacionService } from '../../core/services/hospitalizacion.service';
import { MedicoService } from '../../core/services/medico.service';
import { PacienteService } from '../../core/services/paciente.service';
import { UsuarioService } from '../../core/services/usuario.service';

interface DashboardStats {
  usuariosRegistrados: number;
  pacientesRegistrados: number;
  medicosRegistrados: number;
  enfermerasRegistradas: number;
  hospitalizacionesActivas: number;
  citasHoy: number;
  totalCitas: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  isConsumidor: boolean = false;
  stats: DashboardStats = {
    usuariosRegistrados: 0,
    pacientesRegistrados: 0,
    medicosRegistrados: 0,
    enfermerasRegistradas: 0,
    hospitalizacionesActivas: 0,
    citasHoy: 0,
    totalCitas: 0
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private enfermeraService: EnfermeraService,
    private hospitalizacionService: HospitalizacionService,
    private citaService: CitaService
  ) { }

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'admin';
    this.isConsumidor = role === 'consumidor';
    
    if (this.isAdmin) {
      this.loadStatistics();
    } else {
      this.loading = false;
    }
  }

  loadStatistics(): void {
    this.loading = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const pagination = { page: 1, limit: 1000 };

    forkJoin({
      usuarios: this.usuarioService.getUsuarios(pagination, undefined, true),
      pacientes: this.pacienteService.getPacientes(pagination, undefined, true),
      medicos: this.medicoService.getMedicos(pagination, undefined, true),
      enfermeras: this.enfermeraService.getEnfermeras(pagination, undefined, true),
      hospitalizaciones: this.hospitalizacionService.getHospitalizaciones(pagination, undefined, true),
      citas: this.citaService.getCitas(pagination, undefined, true)
    }).subscribe({
      next: (results) => {
        // Contar usuarios registrados
        this.stats.usuariosRegistrados = results.usuarios.data?.length || 0;

        // Contar pacientes registrados
        this.stats.pacientesRegistrados = results.pacientes.data?.length || 0;

        // Contar médicos registrados
        this.stats.medicosRegistrados = results.medicos.data?.length || 0;

        // Contar enfermeras registradas
        this.stats.enfermerasRegistradas = results.enfermeras.data?.length || 0;

        // Contar hospitalizaciones activas (sin fecha_salida)
        this.stats.hospitalizacionesActivas = results.hospitalizaciones.data?.filter(
          (h: any) => !h.fecha_salida
        ).length || 0;

        // Contar citas del día
        this.stats.citasHoy = results.citas.data?.filter((cita: any) => {
          if (cita.fecha_cita) {
            const citaDate = new Date(cita.fecha_cita);
            citaDate.setHours(0, 0, 0, 0);
            return citaDate.getTime() === today.getTime();
          }
          return false;
        }).length || 0;

        // Total de citas
        this.stats.totalCitas = results.citas.data?.length || 0;

        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.loading = false;
      }
    });
  }
}
