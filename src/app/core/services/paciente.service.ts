import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../../shared/models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly baseUrl = 'http://localhost:8000/api';
  private readonly endpoint = '/pacientes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.baseUrl}${this.endpoint}`);
  }

  getById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseUrl}${this.endpoint}/${id}`);
  }

  create(paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.baseUrl}${this.endpoint}`, paciente);
  }

  update(id: string, paciente: Partial<Paciente>): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.baseUrl}${this.endpoint}/${id}`, paciente);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.endpoint}/${id}`);
  }
}