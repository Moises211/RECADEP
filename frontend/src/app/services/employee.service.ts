import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employeer } from '../models/employee.model';
import { environment } from '../enviroment';
@Injectable({
  providedIn: 'root',
})
export class EmployeerService {
  private apiUrl: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.apiUrl = isPlatformServer(this.platformId)
    ? 'http://spring-backend:8080/api/employee'
    : 'http://localhost:8080/api/employee';
  }
  /*constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformServer(this.platformId)) {
      // Angular ejecutándose en SSR (Node.js)
      this.apiUrl = environment.springDocker + '/employee';
    } else {
      // Angular ejecutándose en navegador
      // Detectar si está en Docker usando hostname o heurística
      const isDocker = window.location.hostname !== 'localhost';

      this.apiUrl = isDocker
        ? environment.springHostBridge + '/employee'
        : environment.springLocal + '/employee';
    }
  }*/

  getAll(): Observable<Employeer[]> {
    return this.http.get<Employeer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employeer> {
    return this.http.get<Employeer>(`${this.apiUrl}/${id}`);
  }

  create(employee: Employeer): Observable<Employeer> {
    return this.http.post<Employeer>(this.apiUrl, employee);
  }

  update(id: number, employee: Employeer): Observable<Employeer> {
    return this.http.put<Employeer>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
