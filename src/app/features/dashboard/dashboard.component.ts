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

    // El backend tiene un límite máximo de 1000, usar ese valor
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
        console.log('Resultados de estadísticas completos:', results);
        
        // Verificar la estructura de cada respuesta
        console.log('Usuarios:', results.usuarios);
        console.log('Pacientes:', results.pacientes);
        console.log('Médicos:', results.medicos);
        console.log('Enfermeras:', results.enfermeras);
        console.log('Hospitalizaciones:', results.hospitalizaciones);
        console.log('Citas:', results.citas);
        
        // El backend devuelve arrays directamente, pero los servicios los mapean a {data: [], total: number}
        // Asegurarse de obtener el array correctamente
        const usuariosData = Array.isArray(results.usuarios) ? results.usuarios : (results.usuarios?.data || []);
        const pacientesData = Array.isArray(results.pacientes) ? results.pacientes : (results.pacientes?.data || []);
        const medicosData = Array.isArray(results.medicos) ? results.medicos : (results.medicos?.data || []);
        const enfermerasData = Array.isArray(results.enfermeras) ? results.enfermeras : (results.enfermeras?.data || []);
        const hospitalizacionesData = Array.isArray(results.hospitalizaciones) ? results.hospitalizaciones : (results.hospitalizaciones?.data || []);
        const citasData = Array.isArray(results.citas) ? results.citas : (results.citas?.data || []);
        
        console.log('Datos extraídos - Usuarios:', usuariosData.length);
        console.log('Datos extraídos - Pacientes:', pacientesData.length);
        console.log('Datos extraídos - Médicos:', medicosData.length);
        console.log('Datos extraídos - Enfermeras:', enfermerasData.length);
        console.log('Datos extraídos - Hospitalizaciones:', hospitalizacionesData.length);
        console.log('Datos extraídos - Citas:', citasData.length);
        
        // Contar registros
        this.stats.usuariosRegistrados = usuariosData.length;
        this.stats.pacientesRegistrados = pacientesData.length;
        this.stats.medicosRegistrados = medicosData.length;
        this.stats.enfermerasRegistradas = enfermerasData.length;

        // Contar hospitalizaciones activas (estado="activa" y activo=true)
        console.log('Hospitalizaciones recibidas para filtrar:', hospitalizacionesData);
        console.log('Detalle de cada hospitalización:', hospitalizacionesData.map((h: any) => ({
          id: h.id,
          estado: h.estado,
          activo: h.activo,
          fecha_salida: h.fecha_salida,
          numero_habitacion: h.numero_habitacion
        })));
        
        this.stats.hospitalizacionesActivas = hospitalizacionesData.filter(
          (h: any) => {
            // Hospitalización activa debe cumplir:
            // 1. Estado debe ser "activa" (case insensitive)
            // 2. Debe estar activa (activo === true)
            const estadoStr = String(h.estado || '').toLowerCase().trim();
            const estadoActivo = estadoStr === 'activa' || estadoStr === 'activo';
            const estaActiva = h.activo === true || h.activo === 1 || String(h.activo).toLowerCase() === 'true';
            const esActiva = estadoActivo && estaActiva;
            
            console.log(`Hospitalización ${h.id}: estado="${h.estado}" (normalizado: "${estadoStr}"), activo=${h.activo} (tipo: ${typeof h.activo}), estadoActivo=${estadoActivo}, estaActiva=${estaActiva}, esActiva=${esActiva}`);
            return esActiva;
          }
        ).length;
        console.log('Total hospitalizaciones activas contadas:', this.stats.hospitalizacionesActivas);

        // Contar citas del día
        this.stats.citasHoy = citasData.filter((cita: any) => {
          if (cita.fecha_cita) {
            const citaDate = new Date(cita.fecha_cita);
            citaDate.setHours(0, 0, 0, 0);
            return citaDate.getTime() === today.getTime();
          }
          return false;
        }).length;

        // Total de citas
        this.stats.totalCitas = citasData.length;

        console.log('Estadísticas finales calculadas:', this.stats);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        console.error('Detalles del error:', error.error);
        this.loading = false;
      }
    });
  }
}
