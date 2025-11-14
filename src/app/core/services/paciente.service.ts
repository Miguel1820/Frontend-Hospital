import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Paciente } from '../../shared/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly endpoint = '/pacientes'; 

  constructor(private apiService: ApiService) { }

  getPacientes(): Observable<Paciente[]> {
    return this.apiService.get<Paciente[]>(this.endpoint);
  }

  getPacienteById(id: string): Observable<Paciente> {
    return this.apiService.get<Paciente>(`${this.endpoint}/${id}`);
    }

  createPaciente(data: any): Observable<Paciente> {
    return this.apiService.post<Paciente>(this.endpoint, data);
    }

  updatePaciente(id: string, data: any): Observable<Paciente> {
    return this.apiService.put<Paciente>(`${this.endpoint}/${id}`, data);
    }

  deletePaciente(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}