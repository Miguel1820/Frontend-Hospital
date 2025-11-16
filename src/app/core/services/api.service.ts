import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔥 ARREGLA AUTOMÁTICAMENTE DOBLES SLASHES "//"
  private buildUrl(endpoint: string): string {
    // Asegurarse de no romper el esquema "http://" al normalizar barras.
    // Normalizar quitando barras finales del baseUrl y barras iniciales del endpoint,
    // luego concatenar con una única barra.
    const base = this.baseUrl.replace(/\/+$/g, '');
    const ep = endpoint.replace(/^\/+/, '');
    return `${base}/${ep}`;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<T>(this.buildUrl(endpoint), { params: httpParams });
  }

  getPaginated<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), { params });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), data);
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint));
  }
}